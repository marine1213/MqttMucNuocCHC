
var uiOb = {
	bars:{}
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

//map the data following the order in sensorList
setRcrUiData=(sensorName,sensorCode)=>{
	let output = codeToHeight(sensorCode);  //fake Values
	let obData = setBarData(sensorName,output.height,output.rainSensor);
	uiData.rcrData[sensorName] = obData;
}
forwardSensorFunction=(sensorName,sensorCode)=>{setRcrUiData(sensorName,sensorCode)}


askAllSensors();
setInterval(askAllSensors,2000);


forwardAskPing=(sensorName,delayValue)=>{setBarStateData(sensorName,delayValue)}

setBarStateData=(htmlId,delayValue)=>{
	let classList =	getSensorStateElm(htmlId).classList;
	while (classList.length > 0) classList.remove(classList.item(0));

	let stateOb = {stateTx:'Running...',colorTx:'green'};
	let barIndicator = getIndicatorElm(htmlId);

	if(delayValue==undefined) {
		stateOb = {stateTx:'No Signal!',colorTx:'grey'};
		barIndicator.style.display='none';
	}
	else {
		barIndicator.style.display='block';
		let val = parseInt(delayValue);
		if(val > 500) stateOb = {stateTx:'High latency!',colorTx:'yellow'};
		if(val > 1000) stateOb = {stateTx:'Too High latency!!!',colorTx:'red'};
	}
	getSensorStateElm(htmlId).innerHTML=stateOb.stateTx;
	getSensorStateElm(htmlId).classList.add('w3-text-'+stateOb.colorTx);
}

askPing();
setInterval(askPing,2000);

