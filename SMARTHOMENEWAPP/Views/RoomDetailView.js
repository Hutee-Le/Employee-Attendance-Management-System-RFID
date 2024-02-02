import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from "react-native";
import { FlatGrid } from 'react-native-super-grid';
import { Switch } from "react-native-switch";
import IconNV from 'react-native-vector-icons/FontAwesome5';
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

const RoomDetail = ({ navigation, route }) => {
  const [roomName, setRoomName] = useState("");
  const [data, setData] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getData().then((data) => {
      setRoomName(data.name);
      setDevices(data.devices);
    });

    connect();
    client.onMessageArrived = onMessageArrived;

    return () => {
      disconnect();
    };
  }, []);

  const getData = async () => {
    const roomId = route.params.roomId;
    const result = await fetch(`${baseUrl}/rooms/${roomId}`)
    const data = await result.json()
    return data;
  }

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

  const subscribeToTopic = () => {
    client.subscribe('checkDataDevice', { qos: 0 });
  };

  const disconnect = () => {
    client.disconnect();
  };

  const onMessageArrived = (message) => {
    console.log('onMessageArrived:', message.payloadString);
    const jsonData = JSON.parse(message.payloadString);
    console.log(jsonData);
    setData(jsonData);
  };

  const publishTopic = (deviceName, deviceStatus) => {
    const jsonData = {
      deviceName: deviceName,
      isOn: deviceStatus,
    };
  
    const message = new Paho.MQTT.Message(JSON.stringify(jsonData));
    message.destinationName = 'sendDataDevice'; // Thay bằng tên topic MQTT thích hợp
    client.send(message);
  };


  const toggleSwitch = async (id, value) => {
    const newDevices = devices.map(device => {
      if (device._id === id) {
        return { ...device, isOn: value };
      }
      return device;
    });
    setDevices(newDevices);
    try {
      const deviceName = newDevices.find(device => device._id === id)?.deviceName;
      const deviceStatus = value ? 'on' : 'off';
      publishTopic(deviceName, deviceStatus);
      // fetch tới server
      const response = await fetch(`${baseUrl}/devices/updateDevice/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isOn: value })
      });
      if (response.ok) {
        console.log("Device state updated successfully");
      } else {
        throw new Error("Failed to update device state");
      }
    } catch (error) {
      console.log(error);
    }
    console.log(newDevices);
  };

  const filteredData = devices.filter(device => device.deviceName === 'temperature-high' || device.deviceName === 'tint');
  return (
    <View style={styles.container}>
      <StatusBar backgroundcolor='#108d95' barStyle="light-content" />
      <View>
        <View style={styles.header}>
          <View style={styles.flexRow}>
            <View style={[styles.flexOne, styles.justCenter]}>
              <Text style={styles.txtHeading}>{roomName}</Text>
              <Text style={styles.txtSubHeading}>Welcome to Room</Text>
            </View>
            <View style={styles.iconSetting}>
              <IconNV name="cog" size={25} color="#ffffff" onPress={() => navigation.navigate('Setting')}/>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {filteredData.map(device => (
              <View key={device.deviceName} style={styles.device}>
                {device.deviceName === 'temperature-high' && (
                  <View style={styles.flexRow}>
                    <View style={styles.iconDevices}>
                      <IconNV name={device.icon} size={25} color="#ffffff" />
                    </View>
                    <View style={styles.infoDevices}>
                      <Text style={styles.deviceType}>{device.status}</Text>
                      <Text style={styles.deviceName}>TEMP</Text>
                    </View>
                  </View>
                )}
                {device.deviceName === 'tint' && (
                  <View style={styles.flexRow}>
                    <View style={styles.iconDevices}>
                      <IconNV name={device.icon} size={25} color="#ffffff" />
                    </View>
                    <View style={styles.infoDevices}>
                      <Text style={styles.deviceType}>{device.status}</Text>
                      <Text style={styles.deviceName}>HUMIDITY</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
      <FlatGrid
        style={styles.flatGid}
        itemDimension={300}
        spacing={15}
        data={devices}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.bgWhite, styles.item]}>
            <View style={styles.flexRow}>
              <View style={styles.justCenter}>
                <IconNV name={item.icon} size={25} color="#108d95" />
              </View>
              <View style={[styles.flexOne, styles.justCenter, styles.marginLeft20]}>
                <Text style={styles.txtdeviceName}>{item.deviceName}</Text>
                <Text style={styles.txtStatus}>{item.status}</Text>
              </View>
              <View style={styles.justCenter}>
                <Switch
                  value={item.isOn}
                  onValueChange={(value) => toggleSwitch(item._id, value)}
                  activeText={'On'}
                  inActiveText={'Off'}
                  circleSize={26}
                  barHeight={10}
                  circleBorderWidth={0}
                  backgroundActive={'#8ac7cd'}
                  backgroundInactive={'#d1ece8'}
                  circleActiveColor={'#108d95'}
                  circleInActiveColor={'#d6edee'}
                  changeValueImmediately={true}
                  innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                  outerCircleStyle={{}}
                  renderActiveText={false}
                  renderInActiveText={false}
                  switchBorderRadius={30}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82c5ce',
  },
  header: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#108d95',
    padding: 20
  },
  iconSetting: {
    justifyContent: "center",
    alignItems: "center"
  },
  marginLeft20: {
    marginLeft: 20
  },
  flexOne: {
    flex: 1
  },
  justCenter: {
    justifyContent: "center"
  },
  touchBack: {
    marginTop: 30
  },
  txtHeading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20
  },
  txtSubHeading: {
    fontSize: 12,
    color: "#ffdccb"
  },
  iconDevices: {
    backgroundColor: "#43d7de",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50
  },
  device: {
    width: '50%',
    marginTop: 30
  },
  deviceType: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 18
  },
  deviceName: {
    color: "#ffffff",
  },
  flexRow: {
    flexDirection: "row"
  }, alignItems: {
    alignItems: "center"
  },
  infoDevices: {
    justifyContent: "center",
    marginLeft: 10
  },
  bgWhite: {
    backgroundColor: '#ffffff'
  },
  item: {
    height: 90,
    borderRadius: 12,
    elevation: 3,
    padding: 20,
  },
  txtdeviceName: {
    fontWeight: "bold",
    fontSize: 24
  },
  txtStatus: {
    fontSize: 12,
    color: '#ababab',
  },
  flatGid: {
    flex: 1,
    marginTop: 30,
    marginHorizontal: 20
  }
});
export default RoomDetail; 
