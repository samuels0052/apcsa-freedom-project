#include <Wire.h>
#include <U8g2lib.h>

U8G2_SSD1306_128X64_NONAME_F_HW_I2C display(U8G2_R0, U8X8_PIN_NONE); //initializes the display

void setup() {
  Serial.begin(9600);
  display.begin();
  display.setFont(u8g2_font_ncenB14_tr);
  display.clearBuffer();
  display.drawStr(0, 18, "Waiting...");
  display.sendBuffer();
}

void loop() {
  if (Serial.available()) { //checks if text was sent to the device
    String text = "";

    while (Serial.available()) {
      text += (char)Serial.read();
      delay(2); //delay to process
    }

    text.trim();

    display.clearBuffer();

    int x = 0; //aligns text on x-axis
    int y = 18; //aligns text on y-axis
    int lineHeight = 18;
    int maxWidth = 128;
    int ml = 3;

    String word = ""; //current word
    String line = ""; //current line
    int lc = 0; //total lines to manage format

    for (int i = 0; i < text.length(); i++) {
      char c = text[i];

      if (c == ' ' || i == text.length() - 1) {
        if (i == text.length() - 1 && c != ' ') word += c;

        int ww = display.getUTF8Width(word.c_str());
        int lw = display.getUTF8Width(line.c_str());

        //moves text to next line if don't fit  
        if (lw + ww > maxWidth) {
          display.setCursor(x, y);
          display.print(line);
          y += lineHeight;
          line = word + " ";
          lc++;
        } else {
          line += word + " ";
        }

        word = "";

        if (lc >= ml) break;
      } else {
        word += c;
      }
    }

    if (lc < ml) {
      display.setCursor(x, y);
      display.print(line);
    }

    display.sendBuffer();
  }
}