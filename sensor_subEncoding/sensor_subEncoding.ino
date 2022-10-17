byte inPort[] = {2,3};
const byte inPortLen = 2;
byte outPort[] = {9};
const byte outPortLen = 1;

void setup() {
  // put your setup code here, to run once:
  for(byte i = 0; i < inPortLen ; i++){pinMode(inPort[i] ,INPUT );}
  for(byte i = 0; i < outPortLen; i++){pinMode(outPort[i],OUTPUT);}
  pinMode(2, INPUT);
  pinMode(3, INPUT);
  pinMode(9, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // load data into register
  byte r = 0;
  for(byte id = 0; id < inPortLen ; id++){ byte temp=digitalRead(inPort[id]); r=r|(temp);  Serial.print(temp);}
  Serial.println();
  digitalWrite(outPort[0],r);
  delay(1);
}
