import { View, Text, BackHandler } from 'react-native'
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './Account';
import Profile from './Profile';
import AccountHistory from './AccountHistory';

const index = ({ navigation }) => {
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [])
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name='Account' component={Account} options={{
        title: 'Account', headerStyle: {
          backgroundColor: '#024580',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: 'normal',
        },
        headerShadowVisible: false
      }} ></Stack.Screen>
      <Stack.Screen name='Profile' component={Profile} options={{
        title: 'Profile', headerStyle: {
          backgroundColor: '#024580',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: 'normal',
        },
        headerShadowVisible: false
      }} ></Stack.Screen>
      <Stack.Screen name='History' component={AccountHistory} options={{
        title: 'Account History', headerStyle: {
          backgroundColor: '#024580',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: 'normal',
        },
        headerShadowVisible: false
      }} ></Stack.Screen>
    </Stack.Navigator>
  )
}

export default index