//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const Setting = () => {
    return (
        <View style={styles.container}>
            <Text>Setting</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#108d95',
    },
});

//make this component available to the app
export default Setting;
