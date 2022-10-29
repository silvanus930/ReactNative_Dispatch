import {
  Box,
  HStack,
  Icon,
  IconButton,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, StatusBar } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import useSound from "react-native-use-sound";
import SearchBar from '../../components/SearchBar';
import { audio } from '../../store/utils/audio';
import HomeScreen from './HomeScreen';
import DismissKeyboard from '../../components/DismissKeyboard';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders, setOrders, setTotalImages } from '../../store/state/orderSlice';
import { getQueueOrders, totalImage, uploadImages } from '../../store/utils/orderFilter';

const index = ({ navigation }) => {
  const { userId, loading, profile } = useSelector((state) => state.auth);
  const { openOrders, uploadStats, errors, totalImages } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [play, pause, stop, data] = useSound('tap.wav');
  const height = Dimensions.get("window").height + (StatusBar.currentHeight === 24 ? StatusBar.currentHeight - 2: 22);

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


  const searchFilter = (text) => {
    if (text) {
      const fiters = openOrders.filter((item) => {
        
        if (item.street_address.includes(text)) {
          return item
        }
        if (item.city.includes(text)) {
          return item
        }
        if (item.state.includes(text)) {
          return item
        }
        if (item.zip.includes(text)) {
          return item
        }
        if (item.service.includes(text)) {
          return item
        }
      });
      
      dispatch(setOrders(fiters));
    } else {
      dispatch(getOrders(userId));
    }
  }
  
  return (
    <DismissKeyboard>
      <>
        <VStack h={height * 0.12} bg="#024580" space={2}>
          <Box w="100%" alignItems="center" pb={0} pt={4}>
            <Text color="#fff" fontWeight="600" fontSize={16}>
              Work Orders
            </Text>
          </Box>
          {/* <HStack w="100%" py={2} px={4} space={6}> */}
          <Box w="100%" px={4}>
            <SearchBar searchFilter={searchFilter} />
          </Box>
          {/* <HStack space={2} alignItems="center">
              <IconButton
                bg="#fff"
                variant="outline"
                size="xs"
                borderWidth="0"
                p={1.5}
                icon={
                  <Icon size="xs" as={<Feather name="share" />} color="#024580" />
                }
              />
              <IconButton
                bg="#fff"
                variant="outline"
                size="xs"
                borderWidth="0"
                p={1.5}
                icon={
                  <Icon
                    size="xs"
                    as={<Feather name="filter" />}
                    color="#024580"
                  />
                }
              />
            </HStack> */}
          {/* </HStack> */}
        </VStack>
        <Box h={height * 0.78} >
          <HomeScreen navigation={navigation} />
        </Box>
        <HStack h={height * 0.10}
          bg="#fff"
          justifyContent="space-evenly"
          alignItems="center"
          w="100%"
          bottom="0"
          // borderTopWidth="1"
          // borderTopColor="#EDEDED"
          pt={2}
          pb={4}>
          <Pressable
            alignItems="center"
            onPress={() => navigation.navigate('Home')}>
            <Feather name="home" color="#024580" size={24} />
            <Text color="#024580" fontSize={11} fontWeight="600">
              Home
            </Text>
          </Pressable>
          <Pressable
            alignItems="center"
            onPress={() => {
              navigation.navigate('Upload');
              play();
            }}>
            <Feather name="upload-cloud" color="#B1B1B1" size={24} />
            <Text color="#2B2727" fontSize={11} fontWeight="400">
              Pending Upload
            </Text>
            <Text
              position="absolute"
              top="0"
              right="4"
              color="#fff"
              bg="#D10505"
              fontSize={10}
              fontWeight="bold"
              borderRadius={50}
              width={6}
              height={6}
              textAlign="center"
              pt={1}
            >
              {uploadStats.remaining ? uploadStats.remaining : 0}
            </Text>
          </Pressable>
          <Pressable
            alignItems="center"
            onPress={() => {
              navigation.navigate('AccountScreen');
              play();
            }}>
            <Feather name="user" color="#B1B1B1" size={24} />
            <Text color="#2B2727" fontSize={11} fontWeight="400">
              Account
            </Text>
          </Pressable>
        </HStack>
      </>
    </DismissKeyboard>
  );
};

export default index;

// const styles = StyleSheet.create({
//   tabBarStyle: {
//     backgroundColor: "#024580"
//   }
// })

// return (
//   <>
//     <StatusBar hidden={true} />
//     <Tab.Navigator activeColor="#024580"
//       screenListeners={({ navigation }) => ({
//         state: (e) => {
//           // Do something with the state
//           console.log('state changed', e.data.state.history);

//           // Do something with the `navigation` object
//           if (!navigation.canGoBack()) {
//             console.log("we're on the initial screen");
//           }
//         },
//       })}
//     >
//       <Tab.Screen name='Home' component={HomeScreen} options={({ route }) => ({
//         tabBarLabel: 'Home',
//         tabBarActiveTintColor: "#024580",
//         title: "Work Orders",
//         headerStyle: {
//           backgroundColor: '#024580',
//         },
//         headerTitleAlign: "center",
//         headerTitleStyle: { color: '#fff', fontSize: 18, fontWeight: "500" },
//         tabBarIcon: ({ color, focused }) => (
//           <Feather name="home" color={focused ? '#024580' : color} size={24} />
//         ),
//       })} />
//       <Tab.Screen name='Upload' component={UploadScreen} options={{
//         tabBarLabel: 'Pending Upload',
//         tabBarBadge: 132,
//         headerShown: false,
//         tabBarStyle: { display: "none" },
//         tabBarIcon: ({ color, focused }) => (
//           <Feather name="upload-cloud" color={focused ? '#024580' : color} size={24} />
//         ),
//       }} />
//       <Tab.Screen name='Account' component={Account} options={{
//         headerShown: false,
//         tabBarStyle: { display: "none" },
//         tabBarIcon: ({ color, focused }) => (
//           <Feather name="user" color={focused ? '#024580' : color} size={24} />
//         )
//       }} />
//     </Tab.Navigator>
//   </>
// )
