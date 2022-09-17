
// 6: no indicator, set text, remove small size Khô
// 5: set indicator, set Text, remove small size Ướt
// 3: set indicator, set Text, set small size Trơn Ướt
// 2: set indicator, set Text, set small size Đọng nước
var uiOb = {
	bars:{}
};


// rcrName, rcrCode, indicator, sensorState
loadUiElement=(elName, elmId, subElmId)=>{
	if(!uiOb.bars[elmId]){ uiOb.bars[elmId]= {rcrName:null, rcrCode:null, indicator:null, sensorState:null}}
	if(uiOb.bars[elmId][elName]){return uiOb.bars[elmId][elName];}
	let mainEl = document.getElementById(elmId);
	return uiOb.bars[elmId][elName] = mainEl.getElementsByClassName(subElmId)[0];
}

getIndicatorElm=(htmlId)=>loadUiElement('indicator',htmlId,'idIndicator');
getRcrNameElm=(htmlId)=>loadUiElement('rcrName',htmlId,'idRcrName');
getRcrCodeElm=(htmlId)=>loadUiElement('rcrCode',htmlId,'idRcrCode');
getSensorStateElm=(htmlId)=>loadUiElement('sensorState',htmlId,'idSensorState');

heightToBarData=(height)=>{
	switch(height){
		case 13:return {indicator:'3.9vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 12:return {indicator:'6vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 11:return {indicator:'8.3vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 10:return {indicator:'10.4vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 9:return {indicator:'12.5vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 8:return {indicator:'14.6vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 7:return {indicator:'16.7vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 6:return {indicator:'18.8vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 5:return {indicator:'21vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 4:return {indicator:'23.2vh',rcrName:'STANDING WATER',rcrCode:2}; break;
		case 3:return {indicator:'25.1vh',rcrName:' WET',rcrCode:5}; break;
		case 2.5:return {indicator:'25.5vh',rcrName:'WET',rcrCode:5}; break;
		case 2:return {indicator:'27.5vh',rcrName:'WET',rcrCode:5}; break;
		case 1:return {indicator:'29.4vh',rcrName:'WET',rcrCode:5}; break;
		case 0.5:return {indicator:'30.5vh',rcrName:'WET',rcrCode:5}; break;
		case 0:return {indicator:'31.8vh',rcrName:'DRY',rcrCode:6}; break;
		default: return null;
	};
}

setBarData=(htmlId,height)=>{let ob=heightToBarData(height); 
	getIndicatorElm(htmlId).style.top=ob.indicator;
	getRcrNameElm(htmlId).innerHTML=ob.rcrName;
	getRcrCodeElm(htmlId).innerHTML=ob.rcrCode;
}

//Credit to: https://stackoverflow.com/questions/2803145/is-there-0b-or-something-similar-to-represent-a-binary-number-in-javascript
function codeToHeight(adcLv){
	let output = {status:true,result:'init'};
	switch(parseInt(adcLv)){
			case 0b010000: output.result = 13; break;
			case 0b001111: output.result = 12; break;
			case 0b001110: output.result = 11; break;
			case 0b001101: output.result = 10; break;
			case 0b001100: output.result = 9; break;
			case 0b001011: output.result = 8; break;
			case 0b001010: output.result = 7; break;
			case 0b001001: output.result = 6; break;
			case 0b001000: output.result = 5; break;
			case 0b000111: output.result = 4; break;
			case 0b000110: output.result = 3; break;
			case 0b000101: output.result = 2.5; break;
			case 0b000100: output.result = 2; break;
			case 0b000011: output.result = 1; break;
			case 0b000010: output.result = 0.5; break;
			case 0b000001: output.result = 0; break;
			default: output.error = 'error->'+adcLv; output.status = false; break;
	};
	return output;
}

function askSensors(sensorName) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {  if (this.readyState == 4 && this.status == 200) {
		try{
			let row = JSON.parse(this.responseText);
	  		let output = codeToHeight(row.data.data );
	  		setBarData(sensorName,output.result);

	  		if(output.status) console.log(output.result); else console.log(output.error);
		}catch(e){
			console.log(`Resp:${this.responseText}`);
			console.log(e);
		}
  	}   
  };
  xhttp.open("GET", `get?sensor=${sensorName}&last=1`, true);
  xhttp.send();
}

askSensors('TDZ11L');
setInterval(askSensors,2000,'TDZ11L');
