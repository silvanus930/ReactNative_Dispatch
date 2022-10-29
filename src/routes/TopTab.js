import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SignInScreen from '../views/AuthScreen/';
import SignUpScreen from '../views/AuthScreen/';

const Tab = createMaterialTopTabNavigator();

const TopTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#FFA500",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [
          styles.tabBarStyle
        ]
      }}
    >
      <Tab.Screen name="Signin" component={SignInScreen} />
      <Tab.Screen name="Signup" component={SignUpScreen} />
    </Tab.Navigator>
  );
}

export default TopTab;


const styles = StyleSheet.create({
  tabBarStyle: {
    borderRadius: 20
  }
})