var mqtt    = require('mqtt');
var client  = mqtt.connect("mqtt://192.168.1.37",{clientId:"mqttjs01"});

client.on("connect",function(){	console.log("connected  "+client.connected); onConnect();})
client.on("error",function(error){console.log("Can't connect" + error);process.exit(1)});

client.on('message',function(topic, message, packet){
	console.log("Topic="+ topic+"==> message is: "+ message);
});

function publish(topic,msg,options){
	// console.log("===> publishing",msg);

	if (client.connected == true){
		client.publish(topic,msg,options);
	}
}

onConnect = () => {var topic="MakerIOTopic";client.subscribe(topic,{qos:1}); 
	
	var timer_id=setInterval(function(){publish(topic,'From Server');},6000);
}


