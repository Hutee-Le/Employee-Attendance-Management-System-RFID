import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatGrid } from 'react-native-super-grid';
import baseUrl from '../config/config';
const Employee = () => {
  const imageUrl = `${baseUrl}/images/`;
  const [employees, setEmployees] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getData().then((data) => setEmployees(data));
  }, []);

  const getData = async () => {
    const result = await fetch(`${baseUrl}/employees/getAllEmployees`);
    const data = await result.json();
    console.log(data);
    return data;
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('EmployeeDetail', { employeeId: item._id })}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: imageUrl + item.image }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.rfid}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#108d95' barStyle="light-content" />
      <View style={styles.listContainer}>
        <FlatGrid
          itemDimension={300}
          data={employees}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#108d95',
  },
  listContainer: {
    backgroundColor: '#108d95',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#3fc1c9',
    flexDirection: 'row',
    height: 90,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3fc1c9',
    marginVertical: 5,
    marginHorizontal: 8,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
    marginLeft: 14,
    marginTop: 10,
    backgroundColor: '#ccc',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Employee;