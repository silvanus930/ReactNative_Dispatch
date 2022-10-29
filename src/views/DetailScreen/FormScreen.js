import { Alert, View } from 'react-native';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  HStack,
  Input,
  Modal,
  ScrollView,
  Text,
  TextArea,
  useToast,
} from 'native-base';
import { api } from '../../store/servies/api';
import { findPhotos, startDate } from '../../store/utils/camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFormData, createOrderQueue, getQueueOrders, uploadImages } from '../../store/utils/orderFilter';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { setUploadStats } from '../../store/state/orderSlice';
import DismissKeyboard from '../../components/DismissKeyboard';
import { useDispatch } from 'react-redux';


const FormScreen = ({
  state,
  navigation,
  route: {
    params: {
      params: { item },
    },
  },
}) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [text, setText] = useState('');
  const isFocused = useIsFocused();
  const toast = useToast();
  const dispatch = useDispatch();
  useEffect(() => {

    if (isFocused && !(startDate(item))) {
      setOpen(true);
      setText('This order is outside of the window start date');
    }
  }, [isFocused])

  const submit = async () => {

    try {
      const images = await findPhotos(item);
      if (!(images.length >= item.photos_required) ||( images === 'error' && item.photos_required !== '0')) {
        setOpen(true);
        setText(`This order requires a minimum of ${item.photos_required} photos.`);
        return;
      }
      const formData = new FormData();
      formData.append('comment', comment);
      formData.append('order_id', item.id);
      // const data = await api.postAuth('/work_orders/comment.php', formData);

      createOrderQueue(item, formData).then(async () => {
        setComment('')
        // setTimeout(async() => {
        const uploaded = await getQueueOrders();
        dispatch(setUploadStats({ ...uploaded, remaining: uploaded.total - uploaded.upload }));
        // }, 2000);

        navigation.navigate('Details');
      })
      // if (uploadQueue) {

      // } else {

      //   AsyncStorage.setItem('uploadQueue', { orderStatus: "2", order: item });
      // }

      // const formData = new FormData();
      // formData.append('comment', comment);
      // formData.append('order_id', item.id);
      // // console.log(formData);
      // // const formData = `&comment=${comment}&order_id=${item.id}`;
      // const data = await api.postAuth('/work_orders/comment.php', formData);
      // console.log('aaaa', data.data);
      // if (data.data?.error && data.data?.error.includes('Expired token')) {
      //   AsyncStorage.setItem('token', null);
      //   navigation.reset({
      //     index: 0,
      //     routes: [{ name: 'Auth' }],
      //   });
      //   navigation.navigate('Auth');
      // }
      // // data.data?.message.includes()
      // if (data.data) {
      //   const form = createFormData(images, { workorder_id: item.id });
      //   const res = await api.post('/work_orders/add_attachment.php', form)
      //   // AsyncStorage.setItem('uploadImages', images.length)
      //   await uploadImages(images.length);
      //   console.log('formData', res);
      //   navigation.goBack();
      // }

    } catch (error) {
      // setOpen(true);

    }
  };
  return (
    <Container maxW="100%" h="100%" alignItems="center" bg="#ffffff">
      <DismissKeyboard>
        <ScrollView w="100%">
          {/* <Box>
          <Text px={4} py={1} color="muted.400" bg="muted.100">Occupancy Status</Text>
          <HStack p={4} space={6}>
            <HStack alignItems="center" space={3}>
              <Checkbox borderColor="muted.100" borderRadius={50} size="md" color="green.600" />
              <Text color="muted.400" fontWeight="500">Occupied</Text>
            </HStack>
            <HStack alignItems="center" space={3}>
              <Checkbox borderColor="muted.100" borderRadius={50} size="md" color="green.600" />
              <Text color="muted.400" fontWeight="500">Vacant</Text>
            </HStack>
            <HStack alignItems="center" space={3}>
              <Checkbox borderColor="muted.100" borderRadius={50} size="md" color="green.600" />
              <Text color="muted.400" fontWeight="500">Unknown</Text>
            </HStack>
          </HStack>
        </Box>
        <Box w="100%" >
          <Text px={4} py={1} color="muted.400" bg="muted.100">Utility Status</Text>
          <HStack p={4} space={6}>
            <HStack alignItems="center" space={3}>
              <Checkbox borderColor="muted.100" borderRadius={50} size="md" color="green.600" />
              <Text color="muted.400" fontWeight="500">On</Text>
            </HStack>
            <HStack alignItems="center" space={3}>
              <Checkbox borderColor="muted.100" borderRadius={50} size="md" color="green.600" />
              <Text color="muted.400" fontWeight="500">Off</Text>
            </HStack>
            <HStack alignItems="center" space={3}>
              <Checkbox borderColor="muted.100" borderRadius={50} size="md" color="green.600" />
              <Text color="muted.400" fontWeight="500">Unknown</Text>
            </HStack>
          </HStack>
        </Box>
        <Box w="100%" >
          <Text px={4} py={1} color="muted.400" bg="muted.100">Occupancy Indicators</Text>
          <Box p={4}>
            <HStack space={4} pb={4}>
              <HStack alignItems="center" space={3}>
                <Checkbox borderColor="muted.100" size="md" color="green.600" />
                <Text color="muted.400" fontWeight="500">Operable Vehicles</Text>
              </HStack>
              <HStack alignItems="center" space={3}>
                <Checkbox borderColor="muted.100" size="md" color="green.600" />
                <Text color="muted.400" fontWeight="500">Lights on inside</Text>
              </HStack>
            </HStack>
            <HStack space={8} >
              <HStack alignItems="center" space={3}>
                <Checkbox borderColor="muted.100" size="md" color="green.600" />
                <Text color="muted.400" fontWeight="500">Seasonal Decor</Text>
              </HStack>
              <HStack alignItems="center" space={3}>
                <Checkbox borderColor="muted.100" size="md" color="green.600" />
                <Text color="muted.400" fontWeight="500">Full trash cans</Text>
              </HStack>
            </HStack>
          </Box>
        </Box>
        <Box w="100%" >
          <Text px={4} py={1} color="muted.400" bg="muted.100">Who did you make contact with?</Text>
          <Box px={4} py={4} space={6}>
            <Input placeholder='Jameson Rodgers' borderRadius={8} py={1} />
          </Box>
        </Box> */}
          <Box w="100%">
            <Text px={4} py={1} color="muted.400" bg="muted.100">
              Leave comment
            </Text>
            <Box p={4} space={6}>
              <TextArea
                placeholder="Comments"
                borderRadius={12}
                fontSize={16}
                value={comment}
                onChangeText={text => setComment(text)}
              />
            </Box>
          </Box>
          <Box w="100%" px={4} pb={12} mt={4}>
            <Button
              variant="outline"
              borderRadius={12}
              size="sm"
              borderWidth={2}
              borderColor="#024580"
              onPress={submit}>
              <Text color="#024580" fontSize={16} fontWeight="500">
                COMPLETE ORDER
              </Text>
            </Button>
          </Box>
        </ScrollView>
      </DismissKeyboard>
      <Modal isOpen={open} onClose={() => { navigation.navigate('Details'); setOpen(false) }} safeAreaTop={true}>
        <Modal.Content maxWidth="350">
          <Modal.Body>
            {text}
          </Modal.Body>
          <Button
            variant="ghost"
            colorScheme="blueGray"
            onPress={() => { navigation.navigate('Details'); setOpen(false) }}>
            Ok
          </Button>
        </Modal.Content>
      </Modal>
    </Container>
  );
};

export default FormScreen;
