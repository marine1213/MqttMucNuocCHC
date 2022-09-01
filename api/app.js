var mqtt    = require('mqtt');
var client  = mqtt.connect("mqtt:  //broker.mqttdashboard.com",{clientId:"mqttjsSv"});
// var client  = mqtt.connect("mqtt://192.168.137.1");

var mainData = {sensor:{}, debug:{}}, cache = {sensor:{},last:{}};
var inArgs = process.argv.slice(2);
var isDebug = inArgs[0] == '-d';

client.on("connect",function(){	console.log("connected  "+client.connected); onConnect();})
client.on("error",function(error){console.log("Can't connect" + error);process.exit(1)});

client.on('message',function(topic, message, packet){
  if(topic.includes('data')) onData(topic, message, packet);
  if(topic.includes('debug')) onDebug(topic, message, packet);
  if(isDebug)
	  console.log("Topic="+ topic+"==> message is: "+ message);
});

function publish(topic,msg,options){
	// console.log("===> publishing",msg);

	if (client.connected == true){
		client.publish(topic,msg,options);
	}
}

onConnect = () => {var topic=["apx/waterlv/noibai/tdz1/data", 'apx/waterlv/noibai/tdz1/ctrl','apx/waterlv/noibai/tdz1/debug'];client.subscribe('apx/waterlv/noibai/tdz1/#',{qos:1}); }
onData = (topic, message, packet) => {
  let jsMess = ""; try{ jsMess = JSON.parse(message.toString());}catch(e){ console.log(message);console.log(message.toString());console.log(e); return;} mainData.sensor[jsMess.name]=mainData.sensor[jsMess.name]?mainData.sensor[jsMess.name]:[]; 
  let lastVal = {timestamp:(new Date()).toString(),data:(jsMess.vals)}; mainData.sensor[jsMess.name].push(lastVal); cache.last[jsMess.name] = JSON.stringify(lastVal);
  if(mainData.sensor[jsMess.name].length > 200) mainData.sensor[jsMess.name].shift(); cache.sensor[jsMess.name]=JSON.stringify(mainData.sensor[jsMess.name]);}//console.log(JSON.stringify(message.toString()));
onDebug = (topic, message, packet) => {let nowStr = new Date(); mainData.debug[nowStr.getTime()] = message.toString()+' at '+nowStr.toString()}

getSensorData = (sensorName,isLast) => {return isLast?(cache.sensor[sensorName]?cache.last[sensorName]:''):(cache.sensor[sensorName]?cache.sensor[sensorName]:'');}

getServerData = (param) => {
  switch(param){
    case 'mainData': return JSON.stringify(mainData);
    case 'mainData.sensor': return JSON.stringify(mainData.sensor);
    case 'mainData.debug': return JSON.stringify(mainData.debug);
    case 'cache': return JSON.stringify(cache);
    case 'servers': return JSON.stringify(servers);
    case 'configs': return JSON.stringify(configs);
  }
}

//==============================================
var configs = {http:{}};
var servers = [], s = null;

var http = require('http');
var url = require('url');

configs.http.map = {port:9000};
configs.http.debug = {port:9009};

var responseList = {
  debug: (req, res) => {
    var q = url.parse(req.url, true);
    switch(q.pathname){
      case '/': return responseHTML('index.html',res);
      case '/get': return responseText(getSensorData(q.query.sensor,q.query.last),res,q.query.auto);
      case '/server': return responseText(getServerData(q.query.param),res,q.query.auto);
      case '/test': return responseText(JSON.stringify(q),res);
    }
    return responseHTML("." + q.pathname,res); // neu co tham so thi chay ham va tra ve ketqua
  },
  map:(req, res) => {
    var q = url.parse(req.url, true);
    switch(q.pathname){
      case '/': return responseHTML('map.html',res);
      case '/get': return responseText(getSensorData(q.query.sensor,q.query.last),res,q.query.auto);
    }
    return responseHTML("." + q.pathname,res); // neu co tham so thi chay ham va tra ve ketqua
  },
  dashboard:(req, res) =>{
    var q = url.parse(req.url, true);
    switch(q.pathname){
      case '/': return responseHTML('dashboard.html',res);
    }
    return responseHTML("." + q.pathname,res); // neu co tham so thi chay ham va tra ve ketqua
  }
}

Object.keys(configs.http).forEach(service => {
  s = http.createServer(responseList[service]);
  s.listen(configs.http[service].port,() => {console.log(`server http-${service} is running on port ${configs.http[service].port}`)});
  servers.push(s);
});


//===============================================
var fs = require('fs');

responseHTML=(pathname,res,autoRefresh)=>{
  fs.readFile(pathname, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, autoRefresh?{'Content-Type': 'text/html','Connection': 'close','Refresh': '5'}:{'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}

responseText=(text,res,autoRefresh)=>{
  res.writeHead(200, autoRefresh?{'Content-Type': 'text/html','Connection': 'close','Refresh': '5'}:{'Content-Type': 'text/html'});
  res.write(text);
  res.end();
}


//==========================================

monitorConfigs=()=>`<script>var svConfigs = ${JSON.stringify(configs)}</script>`;
monitorData=()=>Object.keys(mainData.sensor).reduce((out,sensorName)=>{out+=('Sensor: '+JSON.stringify(sensorName)+'<br>'+mainData.sensor[sensorName].reduce((outStr,val)=>outStr+=JSON.stringify(val)+'<br>',''));return out;},'');

// Credit to: https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// repairMessage=(message)=>message.replace(/,/g,'\",\"').replace(/:/g,'\":\"');

//=================================================
