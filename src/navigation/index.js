import React, { useCallback, useEffect, useState } from 'react';
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import SplashScreen from '../views/SplashScreen';
import HomeScreen from '../views/HomeScreen';
import UploadScreen from '../views/UploadScreen';
import DetailScreen from '../views/DetailScreen';
import GalleryScreen from '../views/DetailScreen/GalleryScreen';
import AuthScreen from '../views/AuthScreen';
import { Easing, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { HStack, Icon, IconButton } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AccountScreen from '../views/Account';
import CameraScreen from '../views/DetailScreen/CameraScreen';
import useSound from 'react-native-use-sound';
import { deleteImages } from '../store/utils/camera';
import LightboxView from '../views/DetailScreen/LightboxView';

const index = () => {
  const [fileType, setFileType] = useState('select');
  const { images, selectedImg } = useSelector((state) => state.order);
  const { isAuth } = useSelector((state) => state.auth);
  const [play, pause, stop, data] = useSound(fileType === 'select' ? 'select.wav' : 'back.wav');
  const Stack = createStackNavigator();

  const openConfig = {
    animation: 'fade',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };
  const closeConfig = {
    animation: 'timing',
    config: {
      duration: 200,
      easing: Easing.linear
    },
  };

  const deleteImg = () => {
    deleteImages(images, selectedImg)
  }

  const selected = (type) => {
    setFileType(type);
    if (data.isPlaying) pause();
    play();
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerTitleAlign: 'center',
          // gestureEnabled: true,
          transitionSpec: {
            open: openConfig,
            close: closeConfig,
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
        }}
      >
        <Stack.Screen
          navigationKey={isAuth ? 'user' : 'guest'}
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {!isAuth ? (

          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              headerShown: false,
              // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          <>

            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerBackVisible: false,
                headerShown: false,

                // title: 'Work Orders',
                // headerStyle: {
                //   backgroundColor: '#024580',
                // },
                // headerTintColor: '#fff',
                // headerTitleStyle: {
                //   fontSize: 16,
                //   fontWeight: 'normal',
                // },
              }}
            />
            <Stack.Screen
              name="Upload"
              component={UploadScreen}
              options={{
                headerShown: false,

              }}
            />

            <Stack.Screen
              name="AccountScreen"
              component={AccountScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={({ navigation }) => ({
                headerLeft:
                  () => (
                    <Icon ml={4} as={<AntDesign name="close" />} color="#ffffff" size="xl" onPress={() => { navigation.goBack(); selected('back'); }} />
                  ),
                headerRight: () => (
                  <IconButton mr={4} bg="#fff" borderWidth='0' variant="outline" size="xs" icon={<Icon size="sm" as={<MaterialIcons name="photo-library" />} color="#024580" />} onPress={() => { navigation.navigate('Gallery'); selected('select'); }} _pressed={{
                    bg: "none"
                  }} />
                ),
                title: 'Order Details',
                headerStyle: {
                  backgroundColor: '#024580',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontSize: 16,
                  fontWeight: 'normal',
                },
                headerShadowVisible: false
              })}
            />
            <Stack.Screen
              name="Gallery"
              component={GalleryScreen}
              options={({ navigation }) => ({


                headerStyle: {
                  backgroundColor: '#024580',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontSize: 16,
                  fontWeight: 'normal',
                },
              })}
            />
            <Stack.Screen
              name="LightboxView"
              component={LightboxView}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Camera"
              component={CameraScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}


      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default index