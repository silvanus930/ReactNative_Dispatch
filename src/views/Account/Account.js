import { View, } from 'react-native'
import React, { useState } from 'react';
import { BgCloudIcon, CloudIcon } from '../assets/svg'
import { Box, Button, Container, FlatList, HStack, Icon, IconButton, Pressable, Progress, Text } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { setAuth, setMessage } from '../../store/state/authSlice';
import useSound from 'react-native-use-sound';
import { useEffect } from 'react';

const Account = ({ navigation }) => {
  const [fileType, setFileType] = useState('select');
  const [play, pause, stop] = useSound(fileType === 'select' ? 'select.wav' : 'back.wav');
  const dispatch = useDispatch();
  useEffect(() => {

    navigation.setOptions({
      headerLeft:
        () => (
          <Icon as={<AntDesign name="close" />} color="#ffffff" size="xl" onPress={() => { navigation.navigate('Home'); selected('back') }} />
        )
    })
  }, [ navigation])
  const logout = () => {
    dispatch(setMessage(null))
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Auth', }],
    // });
    navigation.navigate('Auth');
    dispatch(setAuth(false));

  }
  const selected = (type) => {
    setFileType(type)
    play();
  }
  return (
    <Container maxW="100%" h="100%" alignItems="center" bg="#ffffff">
      {/* <Box w="100%" h="10%" justifyContent="flex-end" bg="#024580" >
        <HStack justifyContent="space-between" pb={2} pl={4}>
          <Icon as={<AntDesign name="close" />} color="#ffffff" size="xl" onPress={() => { navigation.navigate('Home'); selected('back') }} />
          <Box w="60%">
            <Text color="#fff" fontSize={18} fontWeight="500">Account</Text>
          </Box>
        </HStack>
      </Box> */}
      <Box w="100%">
        <Pressable onPress={() => { navigation.navigate('Profile'); selected('select') }} borderBottomWidth="1" borderColor="#EDEDED">
          <HStack justifyContent="space-between" p={4} borderY="1">
            <Text>Profile</Text>
            <Feather color="#D6D6D6" size={22} name="chevron-right" />
          </HStack>
        </Pressable>
        <Pressable onPress={() => { navigation.navigate('History'); selected('select') }} borderBottomWidth="1" borderColor="#EDEDED">
          <HStack justifyContent="space-between" p={4} borderY="1">
            <Text>Account History</Text>
            <Feather color="#D6D6D6" size={22} name="chevron-right" />
          </HStack>
        </Pressable>
      </Box>
      <Box flex={1} alignContent="center" justifyContent="center">
        <Pressable onPress={logout} padding="4">
          <Text>Logout</Text>
        </Pressable>
      </Box>
    </Container>
  )
}

export default Account