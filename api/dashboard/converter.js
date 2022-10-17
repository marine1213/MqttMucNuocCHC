
// 6: no indicator, set text, remove small size Khô
// 5: set indicator, set Text, remove small size Ướt
// 3: set indicator, set Text, set small size Trơn Ướt
// 2: set indicator, set Text, set small size Đọng nước

const sensorList = ['TDZ11L','CTR11L29R','TDZ29R','TDZ11R','CTR11R29L','TDZ29L'];

var uiOb = {
	bars:{}
};
var uiData = {
	delay:{},
	rcrData:{},
};

// rcrName, rcrCode, indicator, sensorState
loadUiElement=(elName, elmId, subElmId)=>{
	if(!uiOb.bars[elmId]){ uiOb.bars[elmId]= {rcrStatus:null, rcrCode:null, indicator:null, sensorState:null}}
	if(uiOb.bars[elmId][elName]){return uiOb.bars[elmId][elName];}

	if(elName=='rcrCode')
		if(elmId=='CTR11R29L')
			 1==1;
	let mainEl = document.getElementById(elmId);
	return uiOb.bars[elmId][elName] = mainEl.getElementsByClassName(subElmId)[0];
}

getIndicatorElm=(htmlId)=>loadUiElement('indicator',htmlId,'idIndicator');
getRcrNameElm=(htmlId)=>loadUiElement('rcrName',htmlId,'idRcrName');
getRcrCodeElm=(htmlId)=>loadUiElement('rcrCode',htmlId,'idRcrCode');
getSensorStateElm=(htmlId)=>loadUiElement('sensorState',htmlId,'idSensorState');

heightToBarData=(height,rainSensor)=>{
	switch(height){
		case 13:return {indicator:'3.9vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 12:return {indicator:'6vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 11:return {indicator:'8.3vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 10:return {indicator:'10.4vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 9:return {indicator:'12.5vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 8:return {indicator:'14.6vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 7:return {indicator:'16.7vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 6:return {indicator:'18.8vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 5:return {indicator:'21vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 4:return {indicator:'23.2vh',rcrStatus:'STANDING WATER',rcrCode:2,rwStatusVN:'ĐỌNG NƯỚC'}; break;
		case 3:return {indicator:'25.1vh',rcrStatus:' WET',rcrCode:5,rwStatusVN:'ƯỚT'}; break;
		case 2.5:return {indicator:'25.5vh',rcrStatus:'WET',rcrCode:5,rwStatusVN:'ƯỚT'}; break;
		case 2:return {indicator:'27.5vh',rcrStatus:'WET',rcrCode:5,rwStatusVN:'ƯỚT'}; break;
		case 1:return {indicator:'29.4vh',rcrStatus:'WET',rcrCode:5,rwStatusVN:'ƯỚT'}; break;
		case 0.5:return {indicator:'30.5vh',rcrStatus:'WET',rcrCode:5,rwStatusVN:'ƯỚT'}; break;
		case 0:return rainSensor?{indicator:'31.8vh',rcrStatus:'WET',rcrCode:5,rwStatusVN:'ƯỚT'}:{indicator:'31.8vh',rcrStatus:'DRY',rcrCode:6,rwStatusVN:'KHÔ'}; break;
		default: return null;
	};
}

setBarData=(htmlId,height,rainSensor)=>{let ob=heightToBarData(height,rainSensor); 
	getIndicatorElm(htmlId).style.top=ob.indicator;
	getRcrNameElm(htmlId).innerHTML=ob.rcrStatus;
	getRcrCodeElm(htmlId).innerHTML=ob.rcrCode;
	return {
		rcr:   					ob.rcrCode,
		rwStatusVN:   	ob.rwStatusVN,
		waterCoverage:  ob.rcrCode==6?'NR':100,
		waterDepth: 		'NR',
	};
}

//Credit to: https://stackoverflow.com/questions/2803145/is-there-0b-or-something-similar-to-represent-a-binary-number-in-javascript
function codeToHeight(adcLv){
	let output = {status:true,result:'init',rain:0};
	let inputCode = parseInt(adcLv);
	let waterLvCode = adcLv & 0x11111; output.rainSensor = (inputCode >> 5) & 1;
	switch(waterLvCode){
			case 0b10000: output.result = 'ok'; output.height = 13; break;
			case 0b01111: output.result = 'ok'; output.height = 12; break;
			case 0b01110: output.result = 'ok'; output.height = 11; break;
			case 0b01101: output.result = 'ok'; output.height = 10; break;
			case 0b01100: output.result = 'ok'; output.height = 9; break;
			case 0b01011: output.result = 'ok'; output.height = 8; break;
			case 0b01010: output.result = 'ok'; output.height = 7; break;
			case 0b01001: output.result = 'ok'; output.height = 6; break;
			case 0b01000: output.result = 'ok'; output.height = 5; break;
			case 0b00111: output.result = 'ok'; output.height = 4; break;
			case 0b00110: output.result = 'ok'; output.height = 3; break;
			case 0b00101: output.result = 'ok'; output.height = 2.5; break;
			case 0b00100: output.result = 'ok'; output.height = 2; break;
			case 0b00011: output.result = 'ok'; output.height = 1; break;
			case 0b00010: output.result = 'ok'; output.height = 0.5; break;
			case 0b00001: output.result = 'ok'; output.height = 0; break;
			default: output.error = 'error->'+adcLv; output.status = false; break;
	};
	return output;
}

function askSensors(sensorName) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {  if (this.readyState == 4 && this.status == 200) {
			try{
				let row = JSON.parse(this.responseText);
		  		let output = codeToHeight(row.data.data );
		  		let rcrOb = setBarData(sensorName,output.height,output.rainSensor);

		  		if(output.status) console.log(output.height); else console.log(output.error);
			}catch(e){
				console.log(`Resp:${this.responseText}`);
				console.log(e);
			}
  	}   
  };
  xhttp.open("GET", `get?sensor=${sensorName}&last=1`, true);
  xhttp.send();
}
// askSensors('TDZ11L');
// setInterval(askSensors,2000,'TDZ11L');

//map the data following the order in sensorList
reportMapping=()=>{

}

function askAllSensors() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {  if (this.readyState == 4 && this.status == 200) {
			try{
				let row = JSON.parse(this.responseText);
				sensorList.forEach((sensorName,idx)=>{
					if(row[sensorName]) {	
						let tempRow = JSON.parse(row[sensorName]);
						let output = codeToHeight(tempRow.data.data);
			  		let obData = setBarData(sensorName,output.height,output.rainSensor);
			  		uiData.rcrData[sensorName] = obData;
					}else{
		  			console.error(`${sensorName}: No Signal!`);
		  			let output = codeToHeight(33);  //fake Values
			  		let obData = setBarData(sensorName,output.height,output.rainSensor);
			  		uiData.rcrData[sensorName] = obData;
					}
		  		// if(output.status) console.log(output.height); else console.log(output.error);
				});
			}catch(e){
				console.log(`Resp:${this.responseText}`);
				console.log(e);
			}
  	}   
  };
  xhttp.open("GET", `getAllSensors`, true);
  xhttp.send();
}

askAllSensors();
setInterval(askAllSensors,2000);

setBarStateData=(htmlId)=>{
	let classList =	getSensorStateElm(htmlId).classList;
	while (classList.length > 0) classList.remove(classList.item(0));

	let stateOb = {stateTx:'Running...',colorTx:'green'};

	if(uiData.delay[htmlId]==undefined) stateOb = {stateTx:'No Signal!',colorTx:'grey'};
	else { let val = parseInt(uiData.delay[htmlId]);
		if(val > 500) stateOb = {stateTx:'High latency!',colorTx:'yellow'};
		if(val > 1000) stateOb = {stateTx:'Too High latency!!!',colorTx:'red'};
	}
	getSensorStateElm(htmlId).innerHTML=stateOb.stateTx;
	getSensorStateElm(htmlId).classList.add('w3-text-'+stateOb.colorTx);
}

function askPing() {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){if(this.readyState==4 && this.status==200){
		try{
			uiData.delay = JSON.parse(this.responseText); 
			sensorList.forEach((sensorName)=>{setBarStateData(sensorName);});
		}catch(e){
			console.log(e);
		}
	}};
	//http://localhost:9009/server?param=mainData.delay
	xhttp.open("GET","getDelay",true);
	xhttp.send();
}

askPing();
setInterval(askPing,2000);
