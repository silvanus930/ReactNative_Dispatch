import { StyleSheet, View, Linking, Platform, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AspectRatio, Box, Button, Center, Container, Heading, HStack, VStack, Icon, Image, ScrollView, Stack, Text, WarningTwoIcon, Spinner, Pressable, useToast } from 'native-base';
import { Entypo, Ionicons, FontAwesome } from "@native-base/icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from 'react-redux';
import { getAttachment, getOrder, setImages } from '../../store/state/orderSlice';
import { format } from 'date-fns';
import RNFS from 'react-native-fs';
import { findFileName } from '../../store/utils/camera';
import CameraButton from '../../components/CameraButton';
import { attachmentNames } from '../../store/utils/orderFilter';
import Loader from '../../components/Loader';
import FileViewer from "react-native-file-viewer";

const apiKey = 'AIzaSyCf8tkb-45J7VGtsnWx-Cyhyy15uxvK8qs';

const { width, height } = Dimensions.get('window');

const DetailScreen = ({ navigation, route: { params: { params: { item } } } }) => {
  const [onLoad, setOnLoad] = useState(false);
  const { orderDetails, attachments, loading } = useSelector((state) => state.order);
  const toast = useToast();

  if (!orderDetails) { return (<Box>loading....</Box>) }
  const { id, street_address, secondary_address, city, state, zip, county, service, owner, client_name, due_date, start_date, instructions, rejection_reason, photos_required, access_code, con } = orderDetails;
  const dispatch = useDispatch();
  useEffect(() => {

    if (item) {
      dispatch(getOrder(item.id));
      dispatch(getAttachment(item.id));
    }
  }, []);

  useEffect(() => {


    (async () => {
      const files = await RNFS.readDir(RNFS.ExternalDirectoryPath);
      
      if (id && files && findFileName(files, id)) {
        const data = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${id}/media`) 
        dispatch(setImages(data));
      } else {
        dispatch(setImages([]));
      }
    })()

  }, [id]);

  const latitude = "30.3753";
  const longitude = "69.3451";
  const openMapDirection = () => {
    const url = Platform.select({
      ios: `comgooglemaps://?center=${street_address}%2C${city}%2C${state}%2C${zip}%2C${county}&zoom=14&views=traffic"`,
      android: `geo://?q=${street_address}%2C${city}%2C${state}%2C${zip}%2C${county}&zoom=22&views=traffic`,
    });
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          const browser_url = `https://www.google.de/maps/place/${street_address}%2C${city}%2C${state}%2C${zip}%2C${county}`;
          return Linking.openURL(browser_url);
        }
      })
      .catch(() => {
        if (Platform.OS === 'ios') {
          Linking.openURL(
            `maps://?q=${street_address}%2C${city}%2C${state}%2C${zip}%2C${county}`,
          );
        }
      });
  };

  const fileViewer = (url) => {
    toast.show({
      title: "File Downloading...",
      placement: "bottom"
    })

    const extension = url.split(/[#?]/)[0].split(".").pop().trim();

    // Feel free to change main path according to your requirements.
    const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;

    const options = {
      fromUrl: url,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
  }

  return (
    <Container maxW="100%" h="100%" alignItems="center" bg="#ffffff">
      {!loading ? <ScrollView >
        <VStack>
          <Box position="relative">
            {/* `https://maps.googleapis.com/maps/api/staticmap?center=${street_address}%2C${city}%2C${state}%2C${zip}%2C${county}&zoom=15&scale=2&size=600x300&maptype=roadmap&format=png&key=${apiKey}&markers=size:mid%7Ccolor:0xf50000%7Clabel:%7C2105%20S%20Central%20Ave%2C%20${city}` */}

            {/* <Image h="300" source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${street_address}%2C${city}%2C${state}%2C${zip}%2C${county}&zoom=21&scale=2&size=600x300&maptype=roadmap&format=png&key=${apiKey}&markers=size:mid%7Ccolor:0xf50000%7Clabel:%7C2105%20S%20Central%20Ave%2C%20${city}` }} alt="image" /> */}
            <Box h={height * 0.42}>
              {(onLoad || loading) && <Spinner h={height * 0.42} color="cyan.500" />}
              <Image w={width} h={(onLoad || loading) ? '0' : height * 0.42} source={{ uri: `https://maps.googleapis.com/maps/api/streetview?location=${street_address}%2C${city}%2C${state}%2C${zip}%2C${county}&size=1920x1080&heading=10&fov=46&pitch=0&key=${apiKey}` }} alt="image"
                onLoadStart={() => setOnLoad(true)}
                onLoadEnd={() => setOnLoad(false)}
              />
            </Box>
            {/* <Image source={require('../../assets/img/house.png')} alt="image" /> */}
            <Box w="100%" h="18%" bg="#0000008a" position="absolute" bottom="0" p={1} color="#ffffff">
              <HStack alignItems="center" justifyContent="space-between">
                <Pressable pl={3} alignItems="flex-start" justifyContent="center" marginTop={1} onPress={openMapDirection}>
                  <Text color="white" fontWeight="500" fontSize="12" >{street_address}{secondary_address && ','} {secondary_address}</Text>
                  <Text color="white" fontWeight="500" fontSize="12" >{city}{city && ','} {state} {zip}</Text>
                </Pressable>
                <Text pr={3} marginTop={1} color="white" fontWeight="500" fontSize="12" >#{id}</Text>
              </HStack>
            </Box>
          </Box>
          <Box>
            {!(!con) && <HStack w="100%" borderBottomWidth="1" borderColor="#EDEDED" py={2} px={4} >
              <Text w="50%" color="muted.500" fontSize={14}>
                Client Order Number
              </Text>
              <Text w="50%" fontSize={14}>
                {con}
              </Text>
            </HStack>}
            {!(!service) && <HStack w="100%" borderBottomWidth="1" borderColor="#EDEDED" py={2} px={4} >
              <Text w="50%" color="muted.500" fontSize={14}>
                Service
              </Text>
              <Text w="50%" fontSize={14}>
                {service}
              </Text>
            </HStack>}
            {!(!owner) && <HStack w="100%" borderBottomWidth="1" borderColor="#EDEDED" py={2} px={4}>
              <Text w="50%" color="muted.500" fontSize={14}>
                Owner
              </Text>
              <Text w="50%" fontSize={14}>
                {owner}
              </Text>
            </HStack>}
            {!(!client_name) && <HStack w="100%" borderBottomWidth="1" borderColor="#EDEDED" py={2} px={4} >
              <Text w="50%" color="muted.500" fontSize={14}>
                Client
              </Text>
              <Text w="50%" fontSize={14}>
                {client_name}
              </Text>
            </HStack>}
            {!(!due_date) && <HStack w="100%" borderBottomWidth="1" borderColor="#EDEDED" py={2} px={4}>
              <Text w="50%" color="muted.500" fontSize={14}>
                Due Date
              </Text>
              <Text w="50%" fontSize={14}>
                {format(new Date(due_date).getTime(), 'MM/dd/yyyy')}
              </Text>
            </HStack>}
            {!(!start_date) && <HStack w="100%" borderBottomWidth="1" borderColor="#EDEDED" py={2} px={4}>
              <Text w="50%" color="muted.500" fontSize={14}>
                Start Date
              </Text>
              <Text w="50%" fontSize={14}>
                {format(new Date(start_date.split(' ')[0]).getTime(), 'MM/dd/yyyy')}
              </Text>
            </HStack>}
            {!(!access_code) && <HStack w="100%" borderBottomWidth="1" borderColor="#EDEDED" py={2} px={4}>
              <Text w="50%" color="muted.500" fontSize={14}>
                Access Code
              </Text>
              <Text w="50%" fontSize={14}>
                {access_code}
              </Text>
            </HStack>}
            {attachments.length > 0 &&
              <HStack w="100%" pb={8} py={2} px={4}>
                <Text w="50%" color="muted.500" fontSize={14}>
                  Attachments
                </Text>
                <Box w="50%">
                  {attachmentNames(attachments)?.map((item) => (
                    <Pressable onPress={() => fileViewer(`https://app.dispatch.inc/admin/assets/attachments/${item}`)}>
                      <Text color="blue.800" fontSize={14}>{item}</Text>
                    </Pressable>
                  ))}
                </Box>
              </HStack>}
            {!(!rejection_reason) && <Box px={4} py={8} bg="muted.100">
              <HStack pb={4}>
                <Icon size="lg" as={Ionicons} name="md-warning" color="black" />
                {/* <WarningTwoIcon size={5} color="#000000" /> */}
                <Text fontSize={14} pl={3} color="#282829">Rejection Comment</Text>
              </HStack>
              <Text textAlign="left" fontSize={14} color="#868686">{rejection_reason}</Text>
            </Box>}
            {!(!instructions) && <Box px={4} py={8} >
              <HStack pb={4}>
                <MaterialIcons name="chat" size={24} color="#000000" />
                <Text fontSize={14} color="#282829" pl={3}>Instructions</Text>
              </HStack>
              <Text textAlign="left" fontSize={14} color="#868686">{instructions}</Text>
            </Box>}
          </Box>
        </VStack>
      </ScrollView> : <Loader />}
      <CameraButton navigation={navigation} details={orderDetails} />
    </Container>
  )
}

export default DetailScreen;

const styles = StyleSheet.create({
  camera: {
    transform: [
      { rotate: "270deg" },
    ],
  }
})


