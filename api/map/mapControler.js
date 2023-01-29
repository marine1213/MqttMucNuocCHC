	//================================map control===============================
const config={bearing:17,coorL:'[105.80615562601713, 21.218605193793564]',coorM:'[105.8043684, 21.2140661]',mapboxStyle:'mapbox://styles/cuongbk56/ckngt11310hdt17p80pgjhhw9',mapboxAccessToken:'pk.eyJ1IjoiY3VvbmdiazU2IiwiYSI6ImNqeHJzbWJxbDBjY3Yzb241aWY1Nmt6OG0ifQ.98MN1Dl1vrRJKbnkZTnxbQ'}
// const sensorList = ['TDZ11L','CTR11L29R','TDZ29R','TDZ11R','CTR11R29L','TDZ29L'];
const coordList = [
	[105.79652625133053, 21.224384760140392],
	[105.80802749639601, 21.221133887603074],
	[105.81810698102122, 21.218197272169135],
	[105.8134866870721, 21.216719206741303],
	[105.80348418341092, 21.2195933238704],
	[105.78887560293873,21.223737175440576],
];

var mapPage = function(){
	var publicData = {};
	var loadedPopupList = [], currentMarker = {lMarker:null}, lastMarkerFlag = false;

	var coorM = JSON.parse(config.coorM); //[105.8043684, 21.2140661]; //NB
	var coorL = JSON.parse(config.coorL); //[105.80615562601713, 21.218605193793564]; //NB

	// Credit to: https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);        

	// GeoJSON object to hold the flag features
	var geojson = {"type": "FeatureCollection","features": []};

	var map = new mapboxgl.Map({
		container: 'map',
		style: config.mapboxStyle,
		center: w<751?coorM:coorL,
		zoom: w < 449?12:w < 751?13:14, // starting zoom
		maxBounds: [[105.749537,21.188519],[105.892,21.274]],
		bearing: config.bearing, // goc nghieng
		accessToken: config.mapboxAccessToken,
	});
	    
	//Credit to: https://docs.mapbox.com/mapbox-gl-js/example/navigation/
	let geoLocOption = { positionOptions: {enableHighAccuracy:true,timeout:10000}, fitBoundsOptions: {maxZoom: 19}, trackUserLocation: true };
	let geoLocControl = new mapboxgl.GeolocateControl(geoLocOption);
	geoLocControl.on('geolocate', this.onLocationFound);

	// Add zoom and rotation controls to the map.
	map.addControl(new mapboxgl.NavigationControl(),'top-left');
	map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
	map.addControl(geoLocControl,'top-left');
	  
	//==========Register map events===============
    map.on('click', this.onMapClicked);
	//=============

	onLocationFound=(position)=>{
		let geoData = { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy, }
		log.value('onLocationFound','timestamp: '+ position.timestamp + '\n coor:'+JSON.stringify(geoData));
		publicData.onAddDataMarker(geoData.lat, geoData.lng);
	}

	onMapClicked=(e)=>{ if(e != undefined){ {publicData.onAddDataMarker(e.lngLat.lat,e.lngLat.lng); console.log(e.lngLat.lng+','+e.lngLat.lat);} }  }
	//=============
    map.on('load', function() {
		map.addSource('geojson', {"type": "geojson","data": geojson});
        map.addLayer({
          id: 'suco-flag',
          type: 'symbol',
          source: 'geojson',
          layout: {
             "icon-image": "{icon}-30",
             "icon-allow-overlap": true,
             "icon-anchor": "bottom-left"
          }
       });

	//======= Pulsing Dot Redering ==========
	const size = 100;
 
	// This implements `StyleImageInterface`
	// to draw a pulsing dot icon on the map.
	publicData.renderGreen = function () {return renderGen(this,'200,255,200,','100, 255, 100')}
	publicData.renderRed = function () {return renderGen(this,'255, 200, 200,','255, 100, 100')}
	publicData.renderYellow = function () {return renderGen(this,'255, 255, 200,','255, 255, 100')}
	publicData.renderDark = function () {return renderGen(this,'200, 200, 200,','150, 150, 150',true)}

	let renderGen = (thisPtr,outerCircleColor,innerCircleColor,stopPulsing)=>{
		var duration = 1000;
		var t = stopPulsing?1:(performance.now() % duration) / duration;
		 
		var radius = (size / 2) * 0.3;
		var outerRadius = (size / 2) * 0.7 * t + radius;
		var context = thisPtr.context;
		 
		// Draw the outer circle.
		context.clearRect(0, 0, thisPtr.width, thisPtr.height);
		context.beginPath();
		context.arc( thisPtr.width / 2, thisPtr.height / 2, outerRadius, 0, Math.PI * 2 );
		context.fillStyle = 'rgba('+(outerCircleColor) + (1 - t) + ')';
		context.fill();
		 
		// Draw the inner circle.
		context.beginPath();
		context.arc( thisPtr.width / 2, thisPtr.height / 2, radius, 0, Math.PI * 2 );
		context.fillStyle = `rgba(${innerCircleColor},1)`;
		context.strokeStyle = 'white';
		context.lineWidth = 2 + 4 * (1 - t);
		context.fill();
		context.stroke();
		 
		// Update this image's data with data from the canvas.
		thisPtr.data = context.getImageData( 0, 0, thisPtr.width, thisPtr.height ).data;
		 
		// Continuously repaint the map, resulting
		// in the smooth animation of the dot.
		mapPage.getMap().triggerRepaint();
		 
		// Return `true` to let the map know that the image was updated.
		return true;
	}
	//===========================================

	//https://docs.mapbox.com/mapbox-gl-js/example/add-image-animated/
 	genPulsingDotSetting=()=>({width:size,height:size,data: new Uint8Array(size * size * 4), onAdd: function(){ let canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size; this.context = canvas.getContext('2d'); },render: publicData.renderGreen});
	genPointGeojson=(coor)=>({
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [
				{
					'type': 'Feature',
					'geometry': {
						'type': 'Point',
						'coordinates': coor, // icon position [lng, lat]
					}
				}
			]
		}
	});

 	publicData.pulsingDotList=sensorList.reduce((out,sensorName,idx)=>{out[sensorName] = genPulsingDotSetting();
 		map.addImage('imgDot'+sensorName,out[sensorName], { pixelRatio: 2 });
		map.addSource('source'+sensorName, genPointGeojson(coordList[idx]) );
		map.addLayer({'id': 'layerDot'+sensorName, 'type': 'symbol', 'source': 'source'+sensorName, 'layout': { 'icon-image': 'imgDot'+sensorName }  });
 		return out;
 	},{});
});
	//==========public===============      
	  publicData.initMap = function(){
	    if (!mapboxgl.supported()) 
	      alert('Your browser does not support Mapbox GL');
	  }

	  publicData.getMap = ()=>map;

return publicData;
}();

	//============================================================
	forwardSensorFunction=(sensorName,sensorCode,noSignal)=>{
		if(noSignal){
			console.error('No signal:'+sensorName);
			return;
		}
		if(!mapPage.pulsingDotList){
			console.error('PulsingDot is not initiated:'+sensorName);
			return;
		}
		let ctrlDot = mapPage.pulsingDotList[sensorName];
		let output = codeToHeight(sensorCode);
		if(output.height > 2.5) ctrlDot.render = mapPage.renderRed; else 
		if(output.height > 0 || (output.height==0 &&output.rainSensor)) ctrlDot.render = mapPage.renderYellow; else
		ctrlDot.render = mapPage.renderGreen;
	}

askAllSensors();
setInterval(askAllSensors,2000);

	forwardAskPing=(sensorName,delayValue)=>{
		if(delayValue==undefined){
			console.log(sensorName);
			mapPage.pulsingDotList[sensorName].render = mapPage.renderDark;
		}
	}

askPing();
setInterval(askPing,2000);
	
	//============================end========================================
	/* Recycle code
	//    var el = document.createElement('div');
	//    el.className = 'marker-outer';
	//    el.innerHTML = "<div class=marker></div>";
	    //Credit to: https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js
	   
	//    var tempMarker = new mapboxgl.Marker(el).setLngLat([lng,lat]).addTo(map);
	//    var popup = new mapboxgl.Popup({ offset: 25, closeOnClick:false }).setText('Noi Bai.').setLngLat([lng,lat]);
	//    tempMarker.setPopup(popup);
	*/
/*
	 map.on('click','suco-flag', function(e){
	     // xoa popup truoc
	     if(loadedPopupList.length > 0)
	       loadedPopupList.pop().remove();
	     
	     var coordinates = e.features[0].geometry.coordinates.slice();
	     var markerData = e.features[0].properties;
	     
	     var loadedPopup = new mapboxgl.Popup({offset:[10,-30], closeOnClick:false, anchor:'bottom' })
	     .setLngLat(coordinates)
	     .setHTML(markerData.popupContent)
	     .on('open',function(popup){})
	     .on('close',function(popup){
	         loadedPopupList.pop();
	         //Credit to: https://stackoverflow.com/questions/3455405/how-do-i-remove-a-key-from-a-javascript-object
	     });
	     
	     loadedPopupList.push(loadedPopup);
	     loadedPopup.addTo(map);
	   });
	 	map.on('mouseenter', 'suco-flag', function(e) {
		  // Change the cursor style as a UI indicator.
		  map.getCanvas().style.cursor = 'pointer';
		});
		 
		map.on('mouseleave', 'suco-flag', function() {
		  map.getCanvas().style.cursor = '';
		});*/

//   let marker = new mapboxgl.Marker({draggable:true}).setLngLat([105.78887560293873,21.223737175440576]).addTo(map);
// let popup = new mapboxgl.Popup({ offset: 25, closeOnClick:false }).setText('25%.').setLngLat([105.78887560293873,21.223737175440576]);
// 		marker.setPopup(popup);