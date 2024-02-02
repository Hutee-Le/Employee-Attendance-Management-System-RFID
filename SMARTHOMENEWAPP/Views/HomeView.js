import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Image } from "react-native";
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/FontAwesome';
const baseUrl = 'http://10.106.25.156:5555';

const Home = ({navigation}) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() =>{
      getData().then((data) => (setRooms(data)));
  },[])

  const getData = async () => {
    const result = await fetch(`${baseUrl}/rooms`);
    const data = await result.json();
    console.log(data);
    return data;
  }

  return (
      <View style={styles.container}>
        <StatusBar backgroundcolor='#108d95' barStyle="light-content" />
        <View style={styles.header} >
          <Image
            style={styles.tinyLogo}
            source={require('../assets/profile.jpeg')}
          />
          <Text style={[styles.txtText, styles.txtProfile]}>Hi Nhựt</Text>
          <Text style={[styles.txtText, styles.txtTextSub]}>Welcome Come Back!</Text>
        </View>
        <View style={styles.main}>
          <Text style={styles.txtMainHeading}>My Rental Room</Text>
          <FlatGrid
            itemDimension={150}
            data={rooms}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={[styles.bgWhite, styles.item]} onPress={() => navigation.navigate('RoomDetail',{roomId: item._id})}>
                <Icon name="hotel" size={40} color="#4cb4be" />
                <Text style={styles.txtPlace}>{item.name}</Text>
                <Text style={styles.txtDesc}>{item.desc}</Text>
                <Text style={styles.txtDeviceCount}>{item.devices.length} devices</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {/* <View style={styles.footer}>
          <TouchableOpacity style={styles.touchO}>
            <IconNV name="home" size={20} color="#108d95" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchO}>
            <IconNV name="clock" size={20} color="#108d95" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchO}>
            <IconNV name="plus-circle" size={40} color="#108d95" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchO}>
            <IconNV name="chart-bar" size={20} color="#108d95" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchO}>
            <IconNV name="cog" size={20} color="#108d95" />
          </TouchableOpacity>
        </View> */}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#108d95',
    justifyContent: 'center', // căn giữa theo trục dọc
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignSelf: 'flex-start'
  },
  header: {
    flex: 1,
    marginTop: 45,
    marginLeft: 30,
  },
  txtText: {
    color: '#ffffff',
    marginTop: 5
  },
  txtProfile: {
    fontWeight: "bold",
    fontSize: 18
  },
  txtPlace: {
    fontWeight: "bold",
    fontSize: 24
  }
  ,
  txtTextSub: {
    color: '#fdfefe',
    fontSize: 16
  },
  bgWhite: {
    backgroundColor: '#ffffff'
  },
  item: {
    height: 200,
    borderRadius: 12,
    elevation: 3,
    padding: 20,
    borderTopRightRadius: 120,
  },
  main: {
    flex: 6,
    padding: 5
  },
  txtMainHeading: {
    marginLeft: 10,
    color: '#ffffff',
    fontSize: 16
  },
  txtDesc: {
    color: '#ababab',
    fontSize: 12
  },
  txtDeviceCount: {
    color: '#108d95',
    fontWeight: 'bold',
    marginVertical: 10
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  touchO: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default Home;



