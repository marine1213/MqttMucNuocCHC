
var uiOb = {
	bars:{}
};

// rcrName, rcrCode, gauge, sensorState
loadUiElement=(elName, elmId, subElmId)=>{
	if(!uiOb.bars[elmId]){ uiOb.bars[elmId]= {rcrStatus:null, rcrCode:null, gauge:null, sensorState:null}}
	if(uiOb.bars[elmId][elName]){return uiOb.bars[elmId][elName];}

	let mainEl = document.getElementById(elmId);
	return uiOb.bars[elmId][elName] = mainEl.getElementsByClassName(subElmId)[0];
}

getGaugeElm=(htmlId)=>loadUiElement('gauge',htmlId,'gauge');
getRcrNameElm=(htmlId)=>loadUiElement('rcrName',htmlId,'idRcrName');
getRcrCodeElm=(htmlId)=>loadUiElement('rcrCode',htmlId,'idRcrCode');
getSensorStateElm=(htmlId)=>loadUiElement('sensorState',htmlId,'idSensorState');


setBarData=(htmlId,height,rainSensor,noSignal)=>{let ob=heightToBarData(height,rainSensor); 
	gauge.setCode(getGaugeElm(htmlId),ob.rcrCode==6?-1:height);
	if(noSignal) gauge.noSignal(getGaugeElm(htmlId));
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
setRcrUiData=(sensorName,sensorCode,noSignal)=>{
	let output = codeToHeight(sensorCode);  //fake Values
	let obData = setBarData(sensorName,output.height,output.rainSensor,noSignal);
	uiData.rcrData[sensorName] = obData;
}
forwardSensorFunction=(sensorName,sensorCode,noSignal)=>{setRcrUiData(sensorName,sensorCode,noSignal)}


askAllSensors();
setInterval(askAllSensors,2000);


forwardAskPing=(sensorName,delayValue)=>{setBarStateData(sensorName,delayValue)}

setBarStateData=(htmlId,delayValue)=>{
	let classList =	getSensorStateElm(htmlId).classList;
	while (classList.length > 0) classList.remove(classList.item(0));

	let stateOb = {stateTx:'Running...',colorTx:'green'};
	if(delayValue==undefined) {
		stateOb = {stateTx:'No Signal!',colorTx:'grey'};
		gauge.noSignal(getGaugeElm(htmlId));
	}
	else {
		let val = parseInt(delayValue);
		if(val > 500) stateOb = {stateTx:'High latency!',colorTx:'yellow'};
		if(val > 1000) stateOb = {stateTx:'Too High latency!!!',colorTx:'red'};
	}
	getSensorStateElm(htmlId).innerHTML=stateOb.stateTx;
	getSensorStateElm(htmlId).classList.add('w3-text-'+stateOb.colorTx);
}

askPing();
setInterval(askPing,2000);

