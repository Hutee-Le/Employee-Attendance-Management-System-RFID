#include <SoftwareSerial.h>
#include <ArduinoJson.h>

#define TX_PIN D7  // chân D7 arduino có chức năng của TX
#define RX_PIN D6  // chân D6 arduino có chức năng của RX
#define LED_PIN1 D4  // chân D4 arduino kết nối với đèn LED 1
#define LED_PIN2 D5  // chân D5 arduino kết nối với đèn LED 2

SoftwareSerial bluetooth(RX_PIN, TX_PIN);  // RX_PIN Arduino nối vào chân TX của HC_06 và TX_PIN Arduino nối với RX của HC_06

void setup() {
  Serial.begin(9600);
  bluetooth.begin(9600);
  pinMode(LED_PIN1, OUTPUT);
  pinMode(LED_PIN2, OUTPUT);
}

void loop() {
  if (bluetooth.available() > 0) {
    String data = bluetooth.readString();
    Serial.println("Received data: " + data);

    // Chuyển đổi dữ liệu JSON thành đối tượng ArduinoJson
    DynamicJsonDocument doc(128);
    deserializeJson(doc, data);

    // Lấy giá trị từ trường "deviceName" và "isOn"
    String deviceName = doc["deviceName"].as<String>();
    String isOn = doc["isOn"].as<String>();

    // Kiểm tra tên thiết bị và thực hiện điều khiển đèn LED tương ứng
    if (deviceName == "Light1") {
      if (isOn == "on") {
        digitalWrite(LED_PIN1, HIGH);  // Bật đèn LED 1
      } else if (isOn == "off") {
        digitalWrite(LED_PIN1, LOW);  // Tắt đèn LED 1
      }
    } else if (deviceName == "Light2") {
      if (isOn == "on") {
        digitalWrite(LED_PIN2, HIGH);  // Bật đèn LED 2
      } else if (isOn == "off") {
        digitalWrite(LED_PIN2, LOW);  // Tắt đèn LED 2
      }
    }
  }
}                      