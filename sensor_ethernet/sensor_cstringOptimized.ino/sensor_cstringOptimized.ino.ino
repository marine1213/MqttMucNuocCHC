#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

// MAC Address of the Ethernet Shield
byte mac[] = {0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02};
IPAddress ip(192,168,137 ,199);         //Fall back IP address

// Make sure to leave out the http and slashes!
//const char* server = "broker.hivemq.com"; //"192.168.137.1";
const char server[] = "172.16.222.60";  //172.16.222.60

const char sensorName[] = "TDZ11L";
const char debugTopic[] = "apx/waterlv/noibai/debug";
const char ctrlTopic[] = "apx/waterlv/noibai/ctrl";
const char dataTopic[] = "apx/waterlv/noibai/data";
const char pingAskTopic[] = "apx/waterlv/noibai/pingAsk";
const char pingRepTopic[] = "apx/waterlv/noibai/pingRep/tdz11l";
const char ipTopic[] = "apx/waterlv/noibai/ip";

 
// Ethernet and MQTT related objects
EthernetClient ethClient;
PubSubClient mqttClient(ethClient);


unsigned int countMillis = 0;
unsigned int CONNECTION_STATE = 7;
unsigned long previousMillis = 0; 
const long interval = 500; 
char dataBuf[150];
char buf[50];
byte isConnected = 0;

void setup()
{
  pinMode(CONNECTION_STATE,OUTPUT);
  digitalWrite(CONNECTION_STATE,LOW);
 
  Serial.begin(9600);  //begin serial

  previousMillis =  millis();
  // Ethernet takes some time to boot!
  checkIP();

  unsigned long currentMillis = millis();
  long p = currentMillis - previousMillis;
  ltoa(p,buf,10);
  
  mqttClient.setServer(server, 1883); 
  
  // Attempt to connect to the server with the ID "tdz1"
  mqttConnect();

  digitalWrite(CONNECTION_STATE, HIGH);
  
  mqttClient.publish(debugTopic, buf);
  mqttClient.publish(debugTopic, "Setup Link is completed!");
}

void loop() {
  // This is needed at the top of the loop!
  mqttClient.loop();
  
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      countMillis++;
      if(countMillis & 1 == 1){
        long randNumber = countMillis%6; //random(6);
        byte c = Serial.read();
        
        sprintf(dataBuf,"{\"name\":\"%s\",\"v\":{\"r\":%ld,\"data\":\"%b\"}}",sensorName,randNumber,c);
        serialFlush();
        if(mqttClient.publish(dataTopic,buf)){
            mqttClient.publish(debugTopic, "Success!");
        }else{
            mqttClient.publish(debugTopic, "Failed!");
            mqttConnect();
        }
      }
      if(countMillis > 150){
        countMillis = 0;
        checkIP();
    }
  }
}
void mqttConnect(){
      if (mqttClient.connect(sensorName,"cuong","123456"))  
      {
        mqttClient.publish(debugTopic, "Connected!");
         
        // Ensure that we are subscribed to the topic "MakerIOTopic"
        mqttClient.subscribe(ctrlTopic);
        mqttClient.subscribe(pingAskTopic);
        
        // Establish the subscribe event
        mqttClient.setCallback(subscribeReceive);
      } 
      else 
      {
         mqttClient.publish(debugTopic, "Server connection failed...");
      }
}
void checkIP(){
    byte t = 0;
    int  r = 0;
      do{
        t = Ethernet.maintain();               // Keep looking for an IP address

        sprintf(buf,"%s:Maintain:%d",sensorName,t);
        mqttClient.publish(debugTopic, buf);

        r = Ethernet.begin(mac);              // start the Ethernet connection, connect to DHCP. 

        sprintf(buf,"%s:Begin:%d",sensorName,t);
        mqttClient.publish(debugTopic, buf);

        if (r == 0)      
        { 
          Ethernet.begin(mac,ip);
          digitalWrite(CONNECTION_STATE,LOW);
        }  
        IPAddress IPaddr = Ethernet.localIP();
        sprintf(buf,"%s:IP address is:%d.%d.%d.%d",sensorName,IPaddr[0],IPaddr[1],IPaddr[2],IPaddr[3]);
        mqttClient.publish(ipTopic, buf);
        Serial.println(buf);
      }while(r==0);
} 

void subscribeReceive(char* topic, byte* payload, unsigned int length)
{
  if(strcmp(pingAskTopic,topic)== 0){
    sprintf(buf,"Ping:%s",sensorName);
    mqttClient.publish(pingRepTopic, buf);
  }else{
    sprintf(buf,"%s:Topic:%s",sensorName,topic);
    mqttClient.publish(debugTopic, buf);
  }
}

void serialFlush(){ while(Serial.available() > 0) {Serial.read();} }
