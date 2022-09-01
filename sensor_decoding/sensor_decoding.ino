#include <Wire.h> // Library for I2C communication
#include <LiquidCrystal_I2C.h> // Library for LCD

// Wiring: SDA pin is connected to A4 and SCL pin to A5.
// Connect to LCD via I2C, default address 0x27 (A0-A2 not jumpered)
LiquidCrystal_I2C lcd = LiquidCrystal_I2C(0x27, 20, 4); // Change to (0x27,20,4) for 20x4 LCD.

byte inPort[] = {7,6,5,4,3,2};
const byte inPortLen = 6;

void setup() {
  // Initiate the LCD:
  lcd.init();
  lcd.backlight();
  lcd.setCursor(2, 0); 
  lcd.print("Received Data:"); 
  
  for(byte i = 0; i < inPortLen; i++){pinMode(inPort[i],INPUT);}
  Serial.begin(9600);
}

void loop() {
  byte r = B00000000;
   lcd.setCursor(0, 1);
  for(byte i = 0; i < inPortLen; i++){byte t = !digitalRead(inPort[i]); lcd.print(t); r=r|((1&t)<<i);}
  Serial.write(r); lcd.print("~");lcd.print(r);
  delay(20);
}
