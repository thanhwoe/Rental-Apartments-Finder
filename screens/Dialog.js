import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, Keyboard, Vibration, Platform, StatusBar, Dimensions, TextInput, Alert, Picker, ScrollView, Button } from 'react-native';
import { icons,soundE } from '../constants';
import { Audio } from 'expo-av';
const Dialog = () => {
    const handleVibrate = () => {
        Vibration.vibrate()
    }
    const handleRingBell = async() => {
        const { sound } = await Audio.Sound.createAsync(soundE);
         await sound.playAsync(); 
    }
    const handleShowDialog = () => {
        Alert.alert(
            "Dialog Box",
            "Press button to see magic",
            [
                {
                    text: "Ring Bell",
                    onPress: () => handleRingBell(),
                },
                {
                    text: "Vibrate",
                    onPress: () => handleVibrate()
                }
            ]
        )
    }
    return (
        <View style={{ marginTop: 80 }}>
            
            <Pressable onPress={handleShowDialog} style={{alignSelf:'center'}}>
                <Text style={{fontSize:20,fontWeight:'bold',color:'#0fb9b1'}}>Show Dialog</Text>
            </Pressable>
        </View>
    );
}

export default Dialog;
