import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './HomeView';
import RoomDetail from './RoomDetailView';
import Employee from './EmployeeView';
import EmployeeDetail from './EmployeeDetail';
import Setting from './SettingView';
import Support from './SupportView';
import DrawerContent from './DrawerContent';

function HomeStackScreen({ navigation }) {
  const HomeStack = createStackNavigator();
  return (
    <HomeStack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.title,
      }}>
      <HomeStack.Screen name='Home' component={Home} options={{
        title: 'Home',
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} style={styles.icon} backgroundColor="#0d727b" onPress={() => navigation.openDrawer()}></Icon.Button>
        ),
      }} />
      <HomeStack.Screen name='RoomDetail' component={RoomDetail} options={{ title: 'Room Detail' }} />
      <HomeStack.Screen name='Setting' component={Setting} options={{ title: 'Setting' }} />
    </HomeStack.Navigator>
  );
}

function EmployeeStackScreen({ navigation }) {
  const EmployeeStack = createStackNavigator();
  return (
    <EmployeeStack.Navigator
      initialRouteName='Employee'
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.title,
      }}>
      <EmployeeStack.Screen name='Employee' component={Employee} options={{
        title: 'Employee',
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} style={styles.icon} backgroundColor="#0d727b" onPress={() => navigation.openDrawer()}></Icon.Button>
        ),
      }} />
      <EmployeeStack.Screen name='EmployeeDetail' component={EmployeeDetail} options={{
        title: 'EmployeeDetail'      
      }} />
    </EmployeeStack.Navigator>
  );
}

function SettingStackScreen({ navigation }) {
  const SettingStack = createStackNavigator();
  return (
    <SettingStack.Navigator
      initialRouteName='Setting'
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.title,
      }}>
      <SettingStack.Screen name='Setting' component={Setting} options={{
        title: 'Setting',
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} style={styles.icon} backgroundColor="#0d727b" onPress={() => navigation.openDrawer()}></Icon.Button>
        ),
      }} />
    </SettingStack.Navigator>
  );
}

function SupportStackScreen({ navigation }) {
  const SupportStack = createStackNavigator();
  return (
    <SupportStack.Navigator
      initialRouteName='Support'
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.title,
      }}>
      <SupportStack.Screen name='Support' component={Support} options={{
        title: 'Support',
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} style={styles.icon} backgroundColor="#0d727b" onPress={() => navigation.openDrawer()}></Icon.Button>
        ),
      }} />
    </SupportStack.Navigator>
  );
}


function DrawerNavigatorScreen() {
  const DrawerNavigator = createDrawerNavigator();
  return (
    <DrawerNavigator.Navigator initialRouteName='HomeScreen' drawerContent={(props) => <DrawerContent {...props} />}
    drawerStyle={{
      height: '100%',
      width: '70%',
    }}>
      <DrawerNavigator.Screen
        name='HomeScreen'
        component={HomeStackScreen}
        options={{
          title: 'Home',
          drawerIcon: ({ focused, size }) => (
            <Icon name="ios-home" size={size} color={focused ? '#0d727b' : 'gray'} />
          ),
          headerShown: false
        }}
      />
      <DrawerNavigator.Screen
        name='EmployeeScreen'
        component={EmployeeStackScreen}
        options={{
          title: 'Employee',
          drawerIcon: ({ focused, size }) => (
            <Icon name="ios-people" size={size} color={focused ? '#0d727b' : 'gray'} />
          ),
          headerShown: false
        }}
      />
      <DrawerNavigator.Screen
        name='SettingScreen'
        component={SettingStackScreen}
        options={{
          title: 'Setting',
          drawerIcon: ({ focused, size }) => (
            <Icon name="settings" size={size} color={focused ? '#0d727b' : 'gray'} />
          ),
          headerShown: false
        }}
      />
      <DrawerNavigator.Screen
        name='SupportScreen'
        component={SupportStackScreen}
        options={{
          title: 'Support',
          drawerIcon: ({ focused, size }) => (
            <Icon name="ios-help-circle" size={size} color={focused ? '#0d727b' : 'gray'} />
          ),
          headerShown: false
        }}
      />
    </DrawerNavigator.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0d727b',
    elevation: 0
  },
  title: {
    color: '#fff',
    fontWeight: 'bold'
  },
  icon: {
    marginLeft: 10
  },
  
});

class Main extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <DrawerNavigatorScreen />
      </NavigationContainer>
    );
  }
}

export default Main;