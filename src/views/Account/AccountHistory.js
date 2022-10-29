import { View } from 'react-native'
import React from 'react'
import { Box, Container, FlatList, Heading, HStack, Icon, ScrollView, Text } from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import useSound from 'react-native-use-sound';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { startDate } from '../../store/utils/camera';

const AccountHistory = ({ navigation }) => {
  const [play, pause, stop] = useSound('back.wav');
  const { completeOrders, errors } = useSelector((state) => state.order);
  useEffect(() => {

    navigation.setOptions({
      headerLeft:
        () => (
          <Icon textAlign="center" left={-10} as={<Feather name="chevron-left" />} color="#ffffff" size="4xl" onPress={() => { navigation.goBack(); play() }} />
        )
    })
  }, [navigation, play])
  // console.log('xxxxxxxxxxxxxxxxxxx', completeOrders);
  return (
    <Container maxW="100%" h="100%" alignItems="center" bg="#ffffff">

      {/* <Box w="100%" h="10%" justifyContent="flex-end" bg="#024580" >
        <HStack justifyContent="space-between" alignItems="center" pb={2} pl={2}>
          <Icon as={<Feather name="chevron-left" />} color="#ffffff" size="4xl" onPress={() => { navigation.goBack(); play() }} />
          <Box w="64%">
            <Text color="#fff" fontSize={17} fontWeight="500">Account History</Text>
          </Box>
        </HStack>
      </Box> */}
      <Box w="100%" h="100%">
        <Box w="100%" h="30%" bg="#FAFAFA" justifyContent="center" alignItems="center">
          <Heading size="3xl" fontWeight="400" fontSize={42} color="#024580">{completeOrders.length}</Heading>
          <Text width="50%" textAlign="center">Completed Orders</Text>
        </Box>
        <FlatList
          data={completeOrders.slice(0).reverse()}
          showsVerticalScrollIndicator={false}
         
          renderItem={({
            item
          }) =>
            <HStack justifyContent="space-between" p={4} borderBottomWidth="1" borderColor="#EDEDED">
              <Box color="#868686">
                <Text color="#024580" fontWeight="500">{item.id}</Text>
                <Text>Completed: {item.date_completed ? format(new Date(item.date_completed.replace(' ', 'T')).getTime(), 'MM/dd/yyyy') : 'Date not available'} </Text>
              </Box>
              <Box space={2} alignItems="center" pb={2}>
                <Text color={item.paid === '0' ? "#024580" : "green.500"} fontWeight="500">{item.paid === '0' ? 'Pending' : 'Paid'}</Text>
                <Text >${item.payable}</Text>
              </Box>
            </HStack>
          } keyExtractor={item => item.id} />




        {/* <HStack justifyContent="space-between" p={4} borderBottomWidth="1" borderColor="#EDEDED">
          <Box color="#868686">
            <Text color="#024580" fontWeight="500">12345678</Text>
            <Text>Completed: 5/25/2022</Text>
          </Box>
          <Box space={2} alignItems="center" pb={2}>
            <Text color="#024580" fontWeight="500">Pending</Text>
            <Text >$6.00</Text>
          </Box>
        </HStack> */}
      </Box>
    </Container>
  )
}

export default AccountHistory