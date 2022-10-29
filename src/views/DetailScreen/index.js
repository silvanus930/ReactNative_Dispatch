import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailScreen from './DetailScreen';
import FormScreen from './FormScreen';


const Tab = createMaterialTopTabNavigator();

const index = ({ navigation, route: { params } }) => {
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <Tab.Navigator screenOptions={{
      tabBarIndicatorStyle: { backgroundColor: '#002444', borderColor: "#002444", borderWidth: 1 },
      tabBarLabelStyle: { fontSize: 15, fontWeight: '700', textTransform: 'capitalize' },
      tabBarItemStyle: { height: 60, },
      tabBarActiveTintColor: "#FFFFFF",
      tabBarStyle: [
        styles.tabBarStyle
      ]
    }}

    >
      <Tab.Screen name="Details" component={DetailScreen} initialParams={{ params }} />
      <Tab.Screen name="Form" component={FormScreen} initialParams={{ params }} />
    </Tab.Navigator>
  )
}

export default index;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#024580"
  }
})