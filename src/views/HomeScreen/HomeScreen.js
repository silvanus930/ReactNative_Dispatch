import { View, Text, Alert, BackHandler, RefreshControl, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Box, Container, FlatList, HStack, Icon, IconButton, Image, Pressable, VStack } from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import Empty from '../../components/Empty';
import SearchBar from '../../components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders, setComOrders, setOrder, setOrders, setTotalImages, setUploadStats } from '../../store/state/orderSlice';
import { ImgScreen } from '../../components/ImgScreen';
import { getProfile, setProfile } from '../../store/state/authSlice';
import { format } from 'date-fns';
import NetInfo from '@react-native-community/netinfo';
import { GetDatas } from '../../store/servies/offlineData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSound from 'react-native-use-sound';
import { selectShouldShowRatingDialog } from '../../store/utils/appRating';
import { setAppRated, setRemindMeLater } from '../../store/state/appRating';
import { getQueueOrders, totalImages } from '../../store/utils/orderFilter';
import Loader from '../../components/Loader';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = ({ navigation, route }) => {
  const [play, pause, stop] = useSound('select.wav');
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { userId, profile } = useSelector((state) => state.auth);
  const { openOrders, errors, loading } = useSelector((state) => state.order);
  const showRatingDialog = useSelector(selectShouldShowRatingDialog);

  // const netInfo = useNetInfo();
  // console.log('network information', netInfo.isConnected);

  // BackHandler.addEventListener(
  //   "hardwareBackPress",
  //   backAction
  // );



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getOrders(userId));
    wait(3000).then(() => setRefreshing(false));
  }, [userId, loading]);

  useEffect(() => {
    

    NetInfo.addEventListener(async state => {
      const uploaded = await getQueueOrders();
      
      dispatch(setUploadStats({ ...uploaded, remaining: uploaded.total - uploaded.upload }));
      
      const userData = await GetDatas('userInfo');
      const profileData = JSON.parse(userData);
      const id = userId ? userId : profileData.id;
      if (state.isConnected) {
        
        dispatch(getOrders(id));
        dispatch(getProfile(id));
      } else {
        
        const orderData = await GetDatas('openOrders');
        const completeOrders = await GetDatas('completeOrders');
        
        dispatch(setOrders(JSON.parse(orderData)));
        dispatch(setComOrders(JSON.parse(completeOrders)));
        dispatch(setProfile(profileData));
        // setData(JSON.parse(orderData));
      }
    })
    // netInfo.then((info) => {
    //   console.log('ggggg', info);
    // })
    // if (!true) {
    //   console.log('onlineData');
    //   dispatch(getOrders(userId));
    //   dispatch(getProfile(userId));
    // } else {
    //   console.log('offlineData');
    //   GetOrders();
    // }

    // const backAction = () => {
    //   BackHandler.exitApp()
    //   return true;
    // }
    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   backAction
    // );

    // return () => backHandler.remove();

  }, [])

  const detail = (item) => {
    NetInfo.addEventListener(async state => {

      if (state.isConnected) {
        
        navigation.navigate('Detail', { item: item });
      } else {
        
        dispatch(setOrder(item))
        navigation.navigate('Detail', { item: '' });
      }
    });
  }

  // if (loading) return <Box>Loading...</Box>
  

  return (
    <Box w="100%" h="100%" bg="#fff">

      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: openOrders.length === 0 ? "center" : "flex-start",
          alignItems: openOrders.length === 0 ? "center" : "stretch"
        }}
        disableVirtualization={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        } data={openOrders}
        ListEmptyComponent={
          <Empty type='home' title='There are no work orders to display' />
        }
        showsVerticalScrollIndicator={false}
        renderItem={({
          item
        }) =>
          <Pressable onPress={() => { detail(item); play() }} borderWidth="0.3" borderColor={item.status !== '3' ? "#EDEDED" : '#FFECAD'}>
            <HStack justifyContent="space-between" p={4} borderY="1">
              <Box color="#868686" >
                <Text>{item.street_address}</Text>
                <Text>{item.city}, {item.state} {item.zip} </Text>
                <Text style={{ color: "#024580", marginTop: 6 }} >{item.service}</Text>
              </Box>
              <HStack space={2} alignItems="center" pb={2}>
                <Text >Due {format(new Date(item.due_date).getTime(), 'MM/dd/yyyy')}</Text>
                <Feather color="#D6D6D6" size={28} name="chevron-right" />
              </HStack>
            </HStack>
          </Pressable>
        } keyExtractor={item => item.id} />

    </Box>

  )
}

export default HomeScreen