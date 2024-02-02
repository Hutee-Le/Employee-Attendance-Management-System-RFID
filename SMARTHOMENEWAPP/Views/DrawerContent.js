import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

function DrawerContent(props) {

  const { navigation } = props;
  const handleLogout = () => {

    // Xử lý logout ở đây
  }
  return (
    <View style={styles.drawerContent}>
      <View style={styles.userInfoSection}>
        <View style={{ marginTop: 60 }}>
          <Image
            source={require('../assets/profile.jpeg')}
            style={styles.logo}
          />
          <Text style={styles.name}>Lê Minh Nhựt</Text>
        </View>
      </View>
      <DrawerContentScrollView {...props} >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <View style={styles.separator} />
        <DrawerItem
          icon={({ color, size }) => (
            <Icon
              name="log-out-outline"
              color={color}
              size={size}
            />
          )}
          label="Đăng xuất"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    backgroundColor: "#0d727b",
    height: 180
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
  name: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: 'bold',
    color: '#fff'
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-end'
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
});

export default DrawerContent;