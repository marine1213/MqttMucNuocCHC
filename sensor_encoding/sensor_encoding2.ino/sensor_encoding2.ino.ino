byte inPort[] = {3,4,5,6,7,8,9,10,25,12,23,14,15,16,17};
const byte inPortLen = 15;
byte outPort[] = {A0,A1,A2,A3,A4,A5};
const byte outPortLen = 6;

void setup() {
  // put your setup code here, to run once:
  for(byte i = 0; i < inPortLen ; i++){pinMode(inPort[i] ,INPUT );}
  for(byte i = 0; i < outPortLen; i++){pinMode(outPort[i],OUTPUT);}
  pinMode(A2, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // load data into register
  byte r = 0;
  for(byte id = 0; id < inPortLen ; id++){byte idx = id%4, adx = (id>>2)&0x03; r=r|(digitalRead(inPort[id])<<id);Serial.print(digitalRead(inPort[id])); 
    byte out= adx<<4 + (r&0x0f);
    // print output to port
    for(byte i = 0; i < outPortLen; i++){digitalWrite(outPort[i],(out>>i)&1);}
    delay(20);
    if(adx==3){Serial.print(' '); Serial.print(r); Serial.println(' '); Serial.println('>'); r=0;} 
  } // 0,1,3,7,15 

  delay(100);
}
