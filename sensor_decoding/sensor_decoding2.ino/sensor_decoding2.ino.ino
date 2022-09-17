#include <Wire.h> // Library for I2C communication
#include <LiquidCrystal_I2C.h> // Library for LCD

// Wiring: SDA pin is connected to A4 and SCL pin to A5.
// Connect to LCD via I2C, default address 0x27 (A0-A2 not jumpered)
LiquidCrystal_I2C lcd = LiquidCrystal_I2C(0x27, 20, 4); // Change to (0x27,20,4) for 20x4 LCD.

byte inPort[] = {7,6,5,4,3,2};
const byte inPortLen = 6;
int rOut;
  byte r = B00000000, adx = 0, idx = 0;

void setup() {
  rOut = 0x0000;
  // Initiate the LCD:
  lcd.init();
  lcd.backlight();
  lcd.setCursor(2, 0); 
  lcd.print("Received Data:"); 
  
  for(byte i = 0; i < inPortLen; i++){pinMode(inPort[i],INPUT);}
  Serial.begin(9600);
}

void loop() {
  // read a cycle from sensor encoder
  lcd.setCursor(0, 1);
  for(byte i = 0; i < inPortLen; i++){byte t = !digitalRead(inPort[i]); lcd.print(t); r=r|((1&t)<<i);}

  //decode a message which is a part of the output
  adx = (r>>4)&0x03, idx = r&0x0F; rOut = rOut | (idx<<(adx<<2));
  switch(adx){
    case 0: Serial.print("1:");
    case 1: Serial.print("2:");
    case 2: Serial.print("3:");
    case 3: Serial.print("4:");
  }
  Serial.println(idx,BIN);
  Serial.println(rOut,BIN); lcd.print("~");lcd.print(rOut);
  delay(1);
}
