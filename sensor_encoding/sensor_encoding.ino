byte inPort[] = {3,4,5,6,7,8,9,10,25,12,23,14,15,16};
const byte inPortLen = 14;
const byte inPortRain = 17;
byte outPort[] = {A0,A1,A2,A3,A4,A5};
const byte outPortLen = 6;

void setup() {
  // put your setup code here, to run once:
  for(byte i = 0; i < inPortLen ; i++){pinMode(inPort[i] ,INPUT );}
  for(byte i = 0; i < outPortLen; i++){pinMode(outPort[i],OUTPUT);}
  pinMode(A2, OUTPUT);
  pinMode(inPortRain, INPUT);
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
    case 0x0000: out = B010011; break;
    case 0x1000: out = B010010; break;
    case 0x1010: out = B010001; break;
    case 0x2000:
    case 0x2001:
    case 0x2002:
    case 0x2003:
    case 0x2004:
    case 0x2005:
    case 0x2006:
    case 0x2007:
    case 0x2008:
    case 0x2009:
    case 0x200A:
    case 0x200B:
    case 0x200C:
    case 0x200D:
    case 0x200E:
    case 0x200F:
    case 0x2010:
    case 0x2011:
    case 0x2012:
    case 0x2013:
    case 0x2014:
    case 0x2015:
    case 0x2016:
    case 0x2017:
    case 0x2018:
    case 0x2019:
    case 0x201A:
    case 0x201B:
    case 0x201C:
    case 0x201D:
    case 0x201E:
    case 0x201F:
    case 0x2020:
    case 0x2021:
    case 0x2022:
    case 0x2023:
    case 0x2024:
    case 0x2025:
    case 0x2026:
    case 0x2027:
    case 0x2028:
    case 0x2029:
    case 0x202A:
    case 0x202B:
    case 0x202C:
    case 0x202D:
    case 0x202E:
    case 0x202F:
    case 0x2030:
    case 0x2031:
    case 0x2032:
    case 0x2033:
    case 0x2034:
    case 0x2035:
    case 0x2036:
    case 0x2037:
    case 0x2038:
    case 0x2039:
    case 0x203A:
    case 0x203B:
    case 0x203C:
    case 0x203D:
    case 0x203E:
    case 0x203F:
    case 0x2040:
    case 0x2041:
    case 0x2042:
    case 0x2043:
    case 0x2044:
    case 0x2045:
    case 0x2046:
    case 0x2047:
    case 0x2048:
    case 0x2049:
    case 0x204A:
    case 0x204B:
    case 0x204C:
    case 0x204D:
    case 0x204E:
    case 0x204F:
    case 0x2050:
    case 0x2051:
    case 0x2052:
    case 0x2053:
    case 0x2054:
    case 0x2055:
    case 0x2056:
    case 0x2057:
    case 0x2058:
    case 0x2059:
    case 0x205A:
    case 0x205B:
    case 0x205C:
    case 0x205D:
    case 0x205E:
    case 0x205F:
    case 0x2060:
    case 0x2061:
    case 0x2062:
    case 0x2063:
    case 0x2064:
    case 0x2065:
    case 0x2066:
    case 0x2067:
    case 0x2068:
    case 0x2069:
    case 0x206A:
    case 0x206B:
    case 0x206C:
    case 0x206D:
    case 0x206E:
    case 0x206F:
    case 0x2070:
    case 0x2071:
    case 0x2072:
    case 0x2073:
    case 0x2074:
    case 0x2075:
    case 0x2076:
    case 0x2077:
    case 0x2078:
    case 0x2079:
    case 0x207A:
    case 0x207B:
    case 0x207C:
    case 0x207D:
    case 0x207E:
    case 0x207F:
    case 0x2080:
    case 0x2081:
    case 0x2082:
    case 0x2083:
    case 0x2084:
    case 0x2085:
    case 0x2086:
    case 0x2087:
    case 0x2088:
    case 0x2089:
    case 0x208A:
    case 0x208B:
    case 0x208C:
    case 0x208D:
    case 0x208E:
    case 0x208F:
    case 0x2090:
    case 0x2091:
    case 0x2092:
    case 0x2093:
    case 0x2094:
    case 0x2095:
    case 0x2096:
    case 0x2097:
    case 0x2098:
    case 0x2099:
    case 0x209A:
    case 0x209B:
    case 0x209C:
    case 0x209D:
    case 0x209E:
    case 0x209F:
    case 0x20A0:
    case 0x20A1:
    case 0x20A2:
    case 0x20A3:
    case 0x20A4:
    case 0x20A5:
    case 0x20A6:
    case 0x20A7:
    case 0x20A8:
    case 0x20A9:
    case 0x20AA:
    case 0x20AB:
    case 0x20AC:
    case 0x20AD:
    case 0x20AE:
    case 0x20AF:
    case 0x20B0:
    case 0x20B1:
    case 0x20B2:
    case 0x20B3:
    case 0x20B4:
    case 0x20B5:
    case 0x20B6:
    case 0x20B7:
    case 0x20B8:
    case 0x20B9:
    case 0x20BA:
    case 0x20BB:
    case 0x20BC:
    case 0x20BD:
    case 0x20BE:
    case 0x20BF:
    case 0x20C0:
    case 0x20C1:
    case 0x20C2:
    case 0x20C3:
    case 0x20C4:
    case 0x20C5:
    case 0x20C6:
    case 0x20C7:
    case 0x20C8:
    case 0x20C9:
    case 0x20CA:
    case 0x20CB:
    case 0x20CC:
    case 0x20CD:
    case 0x20CE:
    case 0x20CF:
    case 0x20D0:
    case 0x20D1:
    case 0x20D2:
    case 0x20D3:
    case 0x20D4:
    case 0x20D5:
    case 0x20D6:
    case 0x20D7:
    case 0x20D8:
    case 0x20D9:
    case 0x20DA:
    case 0x20DB:
    case 0x20DC:
    case 0x20DD:
    case 0x20DE:
    case 0x20DF:
    case 0x20E0:
    case 0x20E1:
    case 0x20E2:
    case 0x20E3:
    case 0x20E4:
    case 0x20E5:
    case 0x20E6:
    case 0x20E7:
    case 0x20E8:
    case 0x20E9:
    case 0x20EA:
    case 0x20EB:
    case 0x20EC:
    case 0x20ED:
    case 0x20EE:
    case 0x20EF:
    case 0x20F0:
    case 0x20F1:
    case 0x20F2:
    case 0x20F3:
    case 0x20F4:
    case 0x20F5:
    case 0x20F6:
    case 0x20F7:
    case 0x20F8:
    case 0x20F9:
    case 0x20FA:
    case 0x20FB:
    case 0x20FC:
    case 0x20FD:
    case 0x20FE:
    case 0x20FF:
    out = B001111; break;
    case 0x3000: out = B001110; break;
    case 0x3800: out = B001101; break;
    case 0x3C00: out = B001100; break;
    case 0x3E00: out = B001011; break;
    case 0x3F00: 
    case 0x3F01: 
    case 0x3F02: 
    case 0x3F03: 
    case 0x3F04: 
    case 0x3F05: 
    case 0x3F06: 
    case 0x3F07: 
    case 0x3F08: 
    case 0x3F09: 
    case 0x3F0A: 
    case 0x3F0B: 
    case 0x3F0C: 
    case 0x3F0D: 
    case 0x3F0E: 
    case 0x3F0F: 
    case 0x3F10: 
    case 0x3F11: 
    case 0x3F12: 
    case 0x3F13: 
    case 0x3F14: 
    case 0x3F15: 
    case 0x3F16: 
    case 0x3F17: 
    case 0x3F18: 
    case 0x3F19: 
    case 0x3F1A: 
    case 0x3F1B: 
    case 0x3F1C: 
    case 0x3F1D: 
    case 0x3F1E: 
    case 0x3F1F:
    case 0x3F20: 
    case 0x3F21: 
    case 0x3F22: 
    case 0x3F23: 
    case 0x3F24: 
    case 0x3F25: 
    case 0x3F26: 
    case 0x3F27: 
    case 0x3F28: 
    case 0x3F29: 
    case 0x3F2A: 
    case 0x3F2B: 
    case 0x3F2C: 
    case 0x3F2D: 
    case 0x3F2E: 
    case 0x3F2F:
    case 0x3F30: 
    case 0x3F31: 
    case 0x3F32: 
    case 0x3F33: 
    case 0x3F34: 
    case 0x3F35: 
    case 0x3F36: 
    case 0x3F37: 
    case 0x3F38: 
    case 0x3F39: 
    case 0x3F3A: 
    case 0x3F3B: 
    case 0x3F3C: 
    case 0x3F3D: 
    case 0x3F3E: 
    case 0x3F3F:
    case 0x3F40: 
    case 0x3F41: 
    case 0x3F42: 
    case 0x3F43: 
    case 0x3F44: 
    case 0x3F45: 
    case 0x3F46: 
    case 0x3F47: 
    case 0x3F48: 
    case 0x3F49: 
    case 0x3F4A: 
    case 0x3F4B: 
    case 0x3F4C: 
    case 0x3F4D: 
    case 0x3F4E: 
    case 0x3F4F:
    case 0x3F50: 
    case 0x3F51: 
    case 0x3F52: 
    case 0x3F53: 
    case 0x3F54: 
    case 0x3F55: 
    case 0x3F56: 
    case 0x3F57: 
    case 0x3F58: 
    case 0x3F59: 
    case 0x3F5A: 
    case 0x3F5B: 
    case 0x3F5C: 
    case 0x3F5D: 
    case 0x3F5E: 
    case 0x3F5F:
    case 0x3F60: 
    case 0x3F61: 
    case 0x3F62: 
    case 0x3F63: 
    case 0x3F64: 
    case 0x3F65: 
    case 0x3F66: 
    case 0x3F67: 
    case 0x3F68: 
    case 0x3F69: 
    case 0x3F6A: 
    case 0x3F6B: 
    case 0x3F6C: 
    case 0x3F6D: 
    case 0x3F6E: 
    case 0x3F6F:
    case 0x3F70: 
    case 0x3F71: 
    case 0x3F72: 
    case 0x3F73: 
    case 0x3F74: 
    case 0x3F75: 
    case 0x3F76: 
    case 0x3F77: 
    case 0x3F78: 
    case 0x3F79: 
    case 0x3F7A: 
    case 0x3F7B: 
    case 0x3F7C: 
    case 0x3F7D: 
    case 0x3F7E: 
    case 0x3F7F: out = B001010; break;
    case 0x3F80:
    case 0x3F81:
    case 0x3F82:
    case 0x3F83:
    case 0x3F84:
    case 0x3F85:
    case 0x3F86:
    case 0x3F87:
    case 0x3F88:
    case 0x3F89:
    case 0x3F8A:
    case 0x3F8B:
    case 0x3F8C:
    case 0x3F8D:
    case 0x3F8E:
    case 0x3F8F:
    case 0x3F90:
    case 0x3F91:
    case 0x3F92:
    case 0x3F93:
    case 0x3F94:
    case 0x3F95:
    case 0x3F96:
    case 0x3F97:
    case 0x3F98:
    case 0x3F99:
    case 0x3F9A:
    case 0x3F9B:
    case 0x3F9C:
    case 0x3F9D:
    case 0x3F9E:
    case 0x3F9F: 
    case 0x3FA0:
    case 0x3FA1:
    case 0x3FA2:
    case 0x3FA3:
    case 0x3FA4:
    case 0x3FA5:
    case 0x3FA6:
    case 0x3FA7:
    case 0x3FA8:
    case 0x3FA9:
    case 0x3FAA:
    case 0x3FAB:
    case 0x3FAC:
    case 0x3FAD:
    case 0x3FAE:
    case 0x3FAF:
    case 0x3FB0:
    case 0x3FB1:
    case 0x3FB2:
    case 0x3FB3:
    case 0x3FB4:
    case 0x3FB5:
    case 0x3FB6:
    case 0x3FB7:
    case 0x3FB8:
    case 0x3FB9:
    case 0x3FBA:
    case 0x3FBB:
    case 0x3FBC:
    case 0x3FBD:
    case 0x3FBE:
    case 0x3FBF:out = B001001; break;
    case 0x3FC0: 
    case 0x3FC1: 
    case 0x3FC2: 
    case 0x3FC3: 
    case 0x3FC4: 
    case 0x3FC5: 
    case 0x3FC6: 
    case 0x3FC7: 
    case 0x3FC8: 
    case 0x3FC9: 
    case 0x3FCA: 
    case 0x3FCB: 
    case 0x3FCC: 
    case 0x3FCD: 
    case 0x3FCE: 
    case 0x3FCF: 
    case 0x3FD0: 
    case 0x3FD1: 
    case 0x3FD2: 
    case 0x3FD3: 
    case 0x3FD4: 
    case 0x3FD5: 
    case 0x3FD6: 
    case 0x3FD7: 
    case 0x3FD8: 
    case 0x3FD9: 
    case 0x3FDA: 
    case 0x3FDB: 
    case 0x3FDC: 
    case 0x3FDD: 
    case 0x3FDE: 
    case 0x3FDF: out = B000111; break;
    case 0x3FE0: 
    case 0x3FE1: 
    case 0x3FE2: 
    case 0x3FE3: 
    case 0x3FE4: 
    case 0x3FE5: 
    case 0x3FE6: 
    case 0x3FE7: 
    case 0x3FE8: 
    case 0x3FE9: 
    case 0x3FEA: 
    case 0x3FEB: 
    case 0x3FEC: 
    case 0x3FED: 
    case 0x3FEE: 
    case 0x3FEF: out = B000110; break;
    case 0x3FF0: 
    case 0x3FF1: 
    case 0x3FF2: 
    case 0x3FF3: 
    case 0x3FF4: 
    case 0x3FF5: 
    case 0x3FF6: 
    case 0x3FF7: out = B000101; break;
    case 0x3FF8: 
    case 0x3FF9: 
    case 0x3FFA: 
    case 0x3FFB: out = B000100; break;
    case 0x3FFC:
    case 0x3FFD: out = B000011; break;
    case 0x3FFE: out = B000010; break;
    case 0x3FFF: out = B000001; break;
    default: out = 0; ;break;
  }

  byte wetData = digitalRead(inPortRain);
  if(!wetData) out = out | (1<<5);
  // print output to port
//   out =0xff;
  Serial.println(out);
  for(byte i = 0; i < outPortLen; i++){digitalWrite(outPort[i],(out>>i)&1);}

  delay(100);
}
