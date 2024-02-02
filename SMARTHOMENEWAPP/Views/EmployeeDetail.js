import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import init from 'react_native_mqtt';
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from '../config/config';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

const options = {
  host: "broker.emqx.io",
  port: 8083,
  path: "/thcntt3_hk2233",
  id: "id_" + parseInt(Math.random() * 100000),
};

const client = new Paho.MQTT.Client(options.host, options.port, options.path);

const EmployeeDetail = ({ route }) => {
  const { employeeId } = route.params;
  const [employee, setEmployee] = useState(null);
  const [data, setData] = useState(null);
  const [rfid, setRfid] = useState("");
  const [status, setStatus] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showMismatchData, setShowMismatchData] = useState(false);
  const [showCheckInButton, setShowCheckInButton] = useState(true);
  const imageUrl = `${baseUrl}/images/`;
  const formattedDate = employee ? moment(employee.date).format('DD/MM/YYYY HH:mm') : '';

  useEffect(() => {
    getEmployeeData();

    connect();
    client.onMessageArrived = onMessageArrived;

    return () => {
      disconnect();
    };
  }, [employeeId]);

  const getEmployeeData = async () => {
    try {
      const response = await fetch(`${baseUrl}/employees/getEmployeeById/${employeeId}`);
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error(error);
    }
  };

  const connect = () => {
    client.connect({
      onSuccess: () => {
        console.log('Connect MQTT broker successful!');
        subscribeToTopic();
      },
      useSSL: false,
      timeout: 10,
      onFailure: () => {
        console.log('Connect failed. Reconnecting...');
        connect();
      },
    });
  };

  const disconnect = () => {
    client.disconnect();
  };

  const subscribeToTopic = () => {
    client.subscribe('checkdata', { qos: 0 });
  };

  const publishTopic = (rfid, status) => {
    const jsonData = {
      rfid: rfid,
      status: status
    };

    const message = new Paho.MQTT.Message(JSON.stringify(jsonData));
    message.destinationName = 'attendance2233';
    client.send(message);
  };

  const onMessageArrived = (message) => {
    console.log('onMessageArrived:', message.payloadString);
    const jsonData = JSON.parse(message.payloadString);
    console.log(jsonData);
    setData(jsonData);
  };

  const handleConfirmation = () => {
    // Xử lý sự kiện xác nhận dữ liệu điểm danh
    console.log('Checking data...');
    if (data && data.rfid === employee.rfid) {
      console.log('Dữ liệu trùng khớp. Vui lòng điểm danh.');
      setShowNotification(true);
      setShowMismatchData(false);
      setShowCheckInButton(true);
      // Các hành động khác khi dữ liệu trùng khớp
      if (employee.status === "" || employee.status === "checkout") {
        // Hiển thị nút check-in
        setStatus("checkin");
      } else {
        // Hiển thị nút check-out
        setStatus("checkout");
      }
    } else {
      console.log('Dữ liệu không trùng khớp.');
      setShowNotification(false);
      setShowMismatchData(true);
      // Các hành động khác khi dữ liệu không trùng khớp
    }
  };

  const handleCheckIn = async (rfid) => {
    // Xử lý sự kiện check-in
    console.log('Checking in...');
    publishTopic(rfid, 'checkin');

    // gửi yêu cầu PUT
    const apiUrl = `${baseUrl}/employees/updateEmployee/${employeeId}`;
    const payload = {
      rfid: rfid,
      status: 'checkin',
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    const jsonData = JSON.stringify(payload);

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      if (response.ok) {
        console.log(`${employee.rfid} Check-in successful`);
        // Cập nhật lại thông tin nhân viên
        getEmployeeData();
        // Thực hiện các hành động khác sau khi check-in thành công
      } else {
        console.error('Check-in failed');
        // Xử lý lỗi khi check-in thất bại
      }
    } catch (error) {
      console.error('Check-in error:', error);
      // Xử lý lỗi khi gửi yêu cầu
    }
  };
  const handleCheckOut = async (rfid) => {
    // Xử lý sự kiện check-out
    console.log('Checking out...');
    publishTopic(rfid, 'checkout');

    // gửi yêu cầu PUT
    const apiUrl = `${baseUrl}/employees/updateEmployee/${employeeId}`;
    const payload = {
      rfid: rfid,
      status: 'checkout',
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    const jsonData = JSON.stringify(payload);

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      if (response.ok) {
        console.log(`${employee.rfid} Check-out successful`);
        // Cập nhật lại thông tin nhân viên
        getEmployeeData();
        // Thực hiện các hành động khác sau khi check-in thành công
      } else {
        console.error('Check-out failed');
        // Xử lý lỗi khi check-in thất bại
      }
    } catch (error) {
      console.error('Check-out error:', error);
      // Xử lý lỗi khi gửi yêu cầu
    }
  };

  if (!employee) {
    return null; // Hoặc hiển thị một màn hình "Loading" nếu dữ liệu chưa được tải
  }

  return (
    <View style={styles.container}>
      {/* Hiển thị hình ảnh, thông tin nhân viên */}
      <Image style={styles.image} source={{ uri: imageUrl + employee.image }} />
      <View style={styles.infoContainer}>
        <Text style={[styles.label, styles.boldText]}>Mã NV:</Text>
        <Text style={[styles.value, styles.boldText]}>{employee.employeeCode}</Text>
        <Text style={[styles.label, styles.boldText]}>Tên NV:</Text>
        <Text style={[styles.value, styles.boldText]}>{employee.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.label, styles.boldText]}>Mã RFID:</Text>
        <Text style={[styles.value, styles.boldText]}>{employee.rfid}</Text>
        <Text style={[styles.label, styles.boldText]}>Vị trí:</Text>
        <Text style={[styles.value, styles.boldText]}>{employee.position}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.label, styles.boldText]}>Trạng thái:</Text>
        <Text style={[styles.value, styles.boldText]}>{employee.status}</Text>
        <Text style={[styles.label, styles.boldText]}>Thời gian:</Text>
        <Text style={[styles.value, styles.boldText]}>{formattedDate}</Text>
      </View>

      <View style={styles.infoContainer}>
        {/* Các phần tử khác */}
        {showNotification && (
          <Text style={styles.notificationText}>Dữ liệu trùng khớp. Vui lòng điểm danh.</Text>
        )}
        {showMismatchData && (
          <Text style={styles.notificationText}>Dữ liệu không trùng khớp.</Text>
        )}
      </View>
      {/* Nút Kiểm tra dữ liệu điểm danh */}
      <TouchableOpacity
        style={[styles.button, styles.confirmationButton]}
        onPress={handleConfirmation}
      >
        <Text style={[styles.buttonText, styles.confirmationButtonText]}>Kiểm tra dữ liệu điểm danh</Text>
      </TouchableOpacity>

      {/* Hàng chứa nút check-in và check-out */}
      <View style={styles.checkButtonContainer}>
        {/* Nút check-in */}
        {status === "checkin" && showCheckInButton && (
          <TouchableOpacity
            style={[styles.button, styles.checkButton, styles.checkInButton]}
            onPress={() => {handleCheckIn(employee.rfid); setShowCheckInButton(false);}}
          >
            <Text style={[styles.buttonText, styles.checkButtonText]}>Check-in</Text>
          </TouchableOpacity>
        )}

        {/* Nút check-out */}
        {status === "checkout" && showCheckInButton && (
          <TouchableOpacity
            style={[styles.button, styles.checkButton, styles.checkOutButton]}
            onPress={() => {handleCheckOut(employee.rfid); setShowCheckInButton(false);}}
          >
            <Text style={[styles.buttonText, styles.checkButtonText]}>Check-out</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#108d95',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginRight: 10,
  },
  value: {
    fontSize: 15,
    flex: 1,
  },
  boldText: {
    fontWeight: '500',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  confirmationButton: {
    backgroundColor: '#3fc1c9',
    marginBottom: 10,
    width: '100%',
  },
  confirmationButtonText: {
    fontSize: 18,
  },
  checkButtonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkButton: {
    flex: 1,
  },
  checkInButton: {
    backgroundColor: '#3fc1c9',
  },
  checkOutButton: {
    backgroundColor: '#3fc1c9',
  },
  checkButtonText: {
    fontSize: 18,
  },
});

export default EmployeeDetail;