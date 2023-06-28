#include <SPI.h>
#include <MFRC522.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define SS_PIN D8     // Chân SS (Slave Select) của RC522, kết nối với chân D10 trên Wemos D1 R1
#define RST_PIN D3     // Chân RST của RC522, kết nối với chân D9 trên Wemos D1 R1

MFRC522 mfrc522(SS_PIN, RST_PIN); // Khởi tạo đối tượng MFRC522

#define ssid "HSU_Students"
#define password "dhhs12cnvch"

// #define ssid "Basic Coffee"    // Tên mạng Wi-Fi của bạn
// #define password "" // Mật khẩu Wi-Fi của bạn

// Thông tin về MQTT Broker
#define mqtt_server "broker.emqx.io"
const uint16_t mqtt_port = 1883;
#define mqtt_topic_pub_rfid "checkdata"
#define mqtt_topic_pub_test "thcntt3/test"

WiFiClient espClient;
PubSubClient client(espClient);
void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();

  // hàm thực hiện chức năng kết nối Wifi và in ra địa chỉ IP của ESP8266
  setup_wifi();
  // cài đặt server eclispe mosquitto / mqttx và lắng nghe client ở port 1883
  client.setServer(mqtt_server, mqtt_port);
  // gọi hàm reconnect() để thực hiện kết nối lại với server khi bị mất kết nối
  reconnect();
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  // kết nối đến mạng Wifi
  WiFi.begin(ssid, password);
  // in ra dấu . nếu chưa kết nối được đến mạng Wifi
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // in ra thông báo đã kết nối và địa chỉ IP của ESP8266
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // lặp cho đến khi được kết nối trở lại
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // hàm connect có đối số thứ 1 là id đại diện cho mqtt client, đối số thứ 2 là username và đối số thứ 3 là password 
    if (client.connect("thcntt3_hk2233")) {
      Serial.println("connected");
      // publish gói tin "Hello esp8266!" đến topic mqtt_topic_pub_test

      StaticJsonDocument<256> doc;
      doc["message"] = "Hello esp8266!";
      char buffer[256];
      size_t n = serializeJson(doc, buffer);
      client.publish(mqtt_topic_pub_test, buffer, n);
    }
    else {
      // in ra màn hình trạng thái của client khi không kết nối được với MQTT broker
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // delay 5s trước khi thử lại
      delay(5000);
    }
  }
}

void loop() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String rfid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      rfid.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
      rfid.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    
    rfid.toUpperCase(); // Chuyển đổi mã thẻ thành chữ hoa

    // Hiển thị mã thẻ trên Serial Monitor
    Serial.print("RFID: ");
    Serial.println(rfid);

    // Tạo JSON object để chứa dữ liệu RFID và trạng thái
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["rfid"] = rfid;

    char buffer[256];
    size_t n = serializeJson(jsonDoc, buffer);
    client.publish(mqtt_topic_pub_rfid, buffer, n);

    delay(2000);
  }
  
  // Các lệnh khác trong hàm loop()
}
