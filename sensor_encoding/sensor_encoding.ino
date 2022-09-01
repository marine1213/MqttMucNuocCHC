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
  int r = 0;
  for(byte id = 0; id < inPortLen ; id++){ r=r|(digitalRead(inPort[id])<<id);  Serial.println(digitalRead(inPort[id]));} // 0,1,3,7,15
  Serial.println("\nregister:");
  Serial.println(r);
  // check if the logic is good 
  // convert input to output
  byte out=0;
  switch(r){
    case 0x0000:  out = B001111; break;
    case 0x4000: out = B100011; break;
    case 0x6000: out = B010011; break;
    case 0x7000: out = B001011; break;
    case 0x7800: out = B000111; break;
    case 0x7C00: out = B100001; break;
    case 0x7E00: out = B010001; break;
    case 0x7F00: out = B001001; break;
    case 0x7F80: out = B000101; break;
    case 0x7FC0: out = B000011; break;
    case 0x7FE0: out = B100000; break;
    case 0x7FF0: out = B010000; break;
    case 0x7FF8: out = B001000; break;
    case 0x7FFC: out = B000100; break;
    case 0x7FFE: out = B000010; break;
    case 0x7FFF: out = B000001; break;
    default: out = 0; ;break;
  }
  // print output to port
  for(byte i = 0; i < outPortLen; i++){digitalWrite(outPort[i],(out>>i)&1);}

  delay(500);
}
