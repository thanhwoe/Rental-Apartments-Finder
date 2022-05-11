import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './screens/Home'
import Register from './screens/Register';
import Login from './screens/Login';
import ListData from './screens/ListData';
import DetailData from './screens/DetailData';
import SearchRessult from './screens/SearchRessult';
import TakeImage from './screens/TakeImage';
import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyDNl5IWSdLPMIHSMAi-xDcLQnjZHefQYeQ",
  authDomain: "some-project-7cf1e.firebaseapp.com",
  projectId: "some-project-7cf1e",
  storageBucket: "some-project-7cf1e.appspot.com",
  messagingSenderId: "682812054275",
  appId: "1:682812054275:web:c426c57276acfb0fa02736",
  measurementId: "G-ZNBR92B72H"
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator()



export default function App() {

  // const handlePostData = (values) => {
  //   firebase.firestore()
  //     .collection('restaurant')
  //     .add({
  //       RestauranntName: values.restName,
  //       RestauranntType: values.restType,
  //       DateVisit: date,
  //       AveragePrice: values.average,
  //       RateServivce: values.service,
  //       RateCleanliness: values.cleanliness,
  //       RateFoodQuality: values.foodQua,
  //       Note: values.note,
  //       Reposter: values.user,
  //     })
  //     .then(res =>{
  //       Alert.alert('Submit success')
  //     })

  // }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={'Login'}
      >
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='ListData' component={ListData} />
        <Stack.Screen name='DetailData' component={DetailData} />
        <Stack.Screen name='SearchRessult' component={SearchRessult} />
        <Stack.Screen name='TakeImage' component={TakeImage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}


