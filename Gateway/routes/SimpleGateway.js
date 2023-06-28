var express = require('express');
var router = express.Router();
const mqtt = require('mqtt')
const { SerialPort } = require("serialport");

var message = "2"; // Thiet lap mode doc du lieu
var result = "";
var str = "";
var client = mqtt.connect({
    host: "broker.emqx.io",
    port: 1883,
    path: "/thcntt3_hk2233"
});

//step 1: open connection to COM port
const serialPort = new SerialPort({
    path: 'COM5',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
}, function (err) {
    if (err)
        console.log("Error", err.message);
    else
        console.log("OK");
});
//step 2 register to listen open the port
//router.get('/connect', function(req, res, next) {
serialPort.on("open", function () {
    console.log("-- Connection opened --");
    //step 3 test send message to HC05
    serialPort.write(message, function (err) {
        if (err) {
            console.log("Error on write: ", err.message);
            return serialPort.close();
        }
        console.log("Message sent successfully");
    });
    //step 4 register listen data on the open port and process receiced
    message
    serialPort.on("data", function (data) {
        str += data;
        result = data;
        console.log('data' + data);
    });
});

// Step 5: Đăng ký lắng nghe dữ liệu từ topic "checkDataDevice"
client.on('connect', function () {
    console.log("Connected to MQTT broker");
    client.subscribe('sendDataDevice', function (err) {
        if (err) {
            console.log("Error subscribing to topic: ", err.message);
        }
    });
});

client.on('message', function (topic, message) {
    // Xử lý dữ liệu nhận được từ topic "checkDataDevice"
    console.log("Received message from topic", topic, ":", message.toString());
    // Do something with the received data
    try {
        // Chuyển đổi dữ liệu JSON thành đối tượng JavaScript
        const data = JSON.parse(message.toString());

        // Chuyển đổi đối tượng JavaScript thành chuỗi (hoặc định dạng dữ liệu cần thiết)
        const dataString = JSON.stringify(data);

        // Gửi dữ liệu tới thiết bị HC05 qua cổng COM
        serialPort.write(dataString, function (err) {
            if (err) {
                console.log("Error on write: ", err.message);
            } else {
                console.log("Data sent to HC05: ", dataString);
            }
        });
    } catch (error) {
        console.log("Error parsing JSON data: ", error.message);
    }
});

module.exports = router;