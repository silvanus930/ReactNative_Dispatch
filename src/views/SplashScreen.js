import { Alert, Platform, View } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import React, { useEffect } from 'react'
import { Box, Center, StatusBar, Text, ZStack } from 'native-base'
import { Logo } from '../assets/svg'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import { setAuth, setUserId } from '../store/state/authSlice';
import { checkExpirePhotos } from '../store/utils/camera';
import { setAppRated, setInstallDate, setRemindMeLater } from '../store/state/appRating';
import { selectShouldShowRatingDialog } from '../store/utils/appRating';
import NetInfo from '@react-native-community/netinfo';
import { getOrders } from '../store/state/orderSlice';

const SplashScreen = ({ navigation }) => {
  const { isAuth } = useSelector((state) => state.auth);
  const { errors } = useSelector((state) => state.order);
  const { installDate } = useSelector((state) => state.appRating);
  const showRatingDialog = useSelector(selectShouldShowRatingDialog);
  const dispatch = useDispatch();
  // const netInfo = useNetInfo();
  // console.log('network information', netInfo.isConnected);

  useEffect(() => {
    checkExpirePhotos();
    if (!installDate) {
      dispatch(setInstallDate(new Date().toISOString()));
    }
    const token = AsyncStorage.getItem('token').then((token) => {
      const { data } = jwt_decode(token);
      dispatch(setUserId(data.id));
      NetInfo.addEventListener(async state => {
        if (state.isConnected) {
          dispatch(getOrders(data.id));
        }
      });
     
    })
    setTimeout(async () => {
      const token = await AsyncStorage.getItem('token')
      
      if (token || isAuth) {
        dispatch(setAuth(true));
        navigation.navigate('Home');
      } else {
        navigation.navigate('Auth');
      }
      if (token) {
        const { data } = jwt_decode(token);
        dispatch(setUserId(data.id))
      }
    }, 2000);

  }, []);

  // useEffect(() => {
  //   NetInfo.addEventListener(async state => {
  //     if (state.isConnected) {

  //     }
  //   });

  //   if (errors?.error.includes('Expired token')) {
  //     console.log('online data orders', errors);
  //     AsyncStorage.setItem('token', null)
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Auth', }],
  //     });
  //     navigation.navigate('Auth')
  //   }
  //   // if (Array.isArray(orders)) {
  //   //   setData(orders);
  //   // }
  // }, []);

  return (
    <Box bg={{
      linearGradient: {
        colors: ["#024580", "#08365F"]
      }
    }} w="100%" h="100%" alignItems="center" justifyContent="center" safeArea>

      <Center position="absolute">
        <ZStack
          alignItems="center" justifyContent="center">
          <Box bg="#FFFFFF" opacity={5} size="56" borderRadius="full" />
          <Box bg="#FFFFFF" opacity={10} size="48" borderRadius="full" />
          <Box bg="#FFFFFF" opacity={20} size="40" borderRadius="full" />
          <Box bg="#FFFFFF" size="32" borderRadius="full" />
          <Logo color="#206280" width="54" height="54" />
        </ZStack>
      </Center>
      <Box position="relative" top="56">
        <Text color="white" opacity={60}>© 2022 Dispatch Inc</Text>
      </Box>
    </Box>
  )
}

export default SplashScreen;