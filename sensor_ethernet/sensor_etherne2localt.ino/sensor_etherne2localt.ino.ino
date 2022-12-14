#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

// MAC Address of the Ethernet Shield
byte mac[] = {0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02};
IPAddress ip(192,168,137 ,199);         //Fall back IP address

// Make sure to leave out the http and slashes!
const char* server = "broker.hivemq.com"; //"192.168.137.1";
const char* serverLocal = "172.16.222.60";  //172.16.222.60

const char* sensorName = "TDZ29R";
const char* debugTopic = "apx/waterlv/noibai/debug/tdz29r";
const char* ctrlTopic = "apx/waterlv/noibai/ctrl/tdz29r";
const char* dataTopic = "apx/waterlv/noibai/data/tdz29r";
const char* pingAskTopic = "apx/waterlv/noibai/pingAsk/tdz29r";
const char* pingRepTopic = "apx/waterlv/noibai/pingRep/tdz29r";

char sUart[7] = {"\0"};
 
// Ethernet and MQTT related objects
EthernetClient ethClient;
PubSubClient mqttClient(ethClient);

EthernetClient ethClientLocal;
PubSubClient mqttClientLocal(ethClientLocal);

unsigned int countMillis = 0;
unsigned int CONNECTION_STATE = 7;
unsigned long previousMillis = 0; 
const long interval = 500; 
char buf[150];
bool isConnected = false;
bool isConnectedLocal = false;

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
  
  mqttClientLocal.setServer(serverLocal, 1883); 
  mqttConnectLocal();
  
  mqttClient.setServer(server, 1883); 
  mqttConnect();

  digitalWrite(CONNECTION_STATE, HIGH);
  
  mqttClient.publish(debugTopic, buf);
  mqttClient.publish(debugTopic, "Setup Link is completed!");
}

void loop() {
  // This is needed at the top of the loop!
  mqttClient.loop();
  mqttClientLocal.loop();
  
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      countMillis++;
      if(countMillis & 1 == 1){
        long randNumber = countMillis%6; //random(6);
        byte c = Serial.read();
        
        sprintf(buf,"{\"name\":\"%s\",\"vals\":{\"rand\":%ld,\"data\":\"%d\"}}",sensorName,randNumber,c);
        serialFlush();
        if(mqttClient.publish(dataTopic,buf)){
            mqttClient.publish(debugTopic, "Publish message success");
        }else{
          Serial.println("Could not send message :(");
            mqttClient.publish(debugTopic, "Could not send message :(");
            mqttConnect();
        }
        if(mqttClientLocal.publish(dataTopic,buf)){
            mqttClientLocal.publish(debugTopic, "Publish message success");
        }else{
          Serial.println("Could not send message :(");
            mqttClientLocal.publish(debugTopic, "Could not send message :(");
            mqttConnectLocal();
        }
      }
      if(countMillis > 150){
        countMillis = 0;
        checkIP();
    }
  }
}
void mqttConnect(){
      if (mqttClient.connect(sensorName,"mqttArduino","test"))  
      {
        isConnected = true;
        mqttClient.publish(debugTopic, "Connection has been established, well done");
         
        // Ensure that we are subscribed to the topic "MakerIOTopic"
        mqttClient.subscribe(ctrlTopic);
        mqttClient.subscribe(pingAskTopic);
        
        // Establish the subscribe event
          mqttClient.setCallback(subscribeReceive);
      } 
      else 
      {
        isConnected = false;
        mqttClient.publish(debugTopic, "Looks like the server connection failed...");
      }
}
void mqttConnectLocal(){
      if (mqttClientLocal.connect(sensorName,"mqttArduino","arduino;"))  
      {
        isConnectedLocal = true;
        mqttClientLocal.publish(debugTopic, "Connection has been established, well done");
         
        // Ensure that we are subscribed to the topic "MakerIOTopic"
        mqttClientLocal.subscribe(ctrlTopic);
        mqttClientLocal.subscribe(pingAskTopic);
        
        // Establish the subscribe event
        mqttClientLocal.setCallback(subscribeReceiveLocal);
      } 
      else 
      {
        isConnectedLocal = false;
         mqttClientLocal.publish(debugTopic, "Looks like the server connection failed...");
      }
}
void checkIP(){
    byte t = 0;
    int  r = 0;
      do{
        t = Ethernet.maintain();               // Keep looking for an IP address

        String maintainRe = String("Maintain:")+t;
        mqttClient.publish(debugTopic, maintainRe.c_str());
        mqttClientLocal.publish(debugTopic, maintainRe.c_str());

        r = Ethernet.begin(mac);              // start the Ethernet connection, connect to DHCP. 

        String beginRe = String("Begin:")+r;
        mqttClient.publish(debugTopic, beginRe.c_str());
        mqttClientLocal.publish(debugTopic, beginRe.c_str());

        if (r == 0)      
        { 
          Ethernet.begin(mac,ip);
          digitalWrite(CONNECTION_STATE,LOW);
        }  
        IPAddress IPaddr = Ethernet.localIP();
         String myLocalIP = String("My IP address is:")+String(IPaddr[0])+'.'+String(IPaddr[1])+'.'+String(IPaddr[2])+'.'+String(IPaddr[3]);
         mqttClient.publish(debugTopic, myLocalIP.c_str());
         mqttClientLocal.publish(debugTopic, myLocalIP.c_str());
          Serial.println(myLocalIP);
      }while(r==0);
} 

void subscribeReceive(char* topic, byte* payload, unsigned int length)
{
  String strPingTopic = String(pingAskTopic);
  String strTopic = String(topic);
  // Print the topic
  if(strPingTopic.equals(strTopic)){
    String output = "ping:" + String(sensorName);
    mqttClient.publish(pingRepTopic, output.c_str());
  }else{
    String tr = String("Topic:")+String(topic);
    mqttClient.publish(debugTopic, tr.c_str());
  }
}
void subscribeReceiveLocal(char* topic, byte* payload, unsigned int length)
{
  String strPingTopic = String(pingAskTopic);
  String strTopic = String(topic);
  // Print the topic
  if(strPingTopic.equals(strTopic)){
    String output = "ping:" + String(sensorName);
    mqttClientLocal.publish(pingRepTopic, output.c_str());
  }else{
    String tr = String("Topic:")+String(topic);
    mqttClientLocal.publish(debugTopic, tr.c_str());
  }
}
void serialFlush(){ while(Serial.available() > 0) {Serial.read();} }
