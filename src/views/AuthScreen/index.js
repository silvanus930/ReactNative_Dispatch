import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import { StatusBar } from 'native-base';


const Tab = createMaterialTopTabNavigator();

const index = () => {
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <Tab.Navigator screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#002444', borderColor: '#002444', borderWidth: 2 },
        tabBarLabelStyle: { fontSize: 15, fontWeight: '700', textTransform: 'capitalize' },
        tabBarItemStyle: { height: 60, },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: [
          styles.tabBarStyle
        ]
      }}
      >
        <Tab.Screen name="Sign in" component={SignInScreen} />
        <Tab.Screen name="Sign up" component={SignUpScreen} />
      </Tab.Navigator>
    </>
  )
}

export default index;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#024580",

  }
})

