import { View, StyleSheet, ImageBackground, Dimensions, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Box, Button, Center, Checkbox, Container, FlatList, Flex, HStack, Icon, IconButton, Image, Pressable, ScrollView, Text } from 'native-base'
import Empty from '../../components/Empty'
import Img from '../../assets/img';
import { ImgScreen, ImgScreena } from '../../components/ImgScreen';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setImages, setSelectedImg } from '../../store/state/orderSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import RNFS from 'react-native-fs';
import CameraButton from '../../components/CameraButton';
import { startDate } from '../../store/utils/camera';
import useSound from 'react-native-use-sound';
import Lightbox from 'react-native-lightbox';
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image'
import GridFlatList from 'grid-flatlist-react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../components/Loader';
import { useIsFocused } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;
const numColumns = 4;
const tileSize = (screenWidth / numColumns) - 12;


const GalleryScreen = ({ navigation }) => {
  const [fileType, setFileType] = useState('select');
  const [check, setCheck] = useState([]);
  const [image, setImage] = useState();
  const [open, setOpen] = useState(false);
  const [play, pause, stop, data] = useSound(fileType === 'select' ? 'select.wav' : 'back.wav');
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { images, orderDetails, loading } = useSelector((state) => state.order);

  const shareHandler = async (check) => {
    let urls = [];
    const shareOptions = {
      title: 'Share file',
      failOnCancel: false,
      excludedActivityTypes: urls,
      urls: urls,
      showAppsToView: true,
      isNewTask: true
    };
    if (check.length > 0) {
      images.map((item) => {
        if (check.includes(item.name)) {
          urls.push(`file://${item.path}`);
        }
      })

      // If you want, you can use a try catch, to parse
      // the share response. If the user cancels, etc.
      try {
        const ShareResponse = await Share.open(shareOptions);
        // setResult(JSON.stringify(ShareResponse, null, 2));
        setCheck([])
      } catch (error) {
        setCheck([])
        // setResult('error: '.concat(getErrorString(error)));
      }
    }
  }

  useEffect(() => {
    if (isFocused) {
      RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`).then((data) => {
        dispatch(setImages(data));
      });
    }
  }, [isFocused])

  useEffect(() => {
    navigation.setOptions({
      headerLeft:
        () => (
          <Icon ml={4} as={<MaterialIcons name="arrow-back-ios" />} color="#ffffff" size="xl" onPress={() => { navigation.goBack(); selected('back') }} />
        ),
      headerRight: () => (
        <HStack space={2} mr={4}>
          <IconButton onPress={() => deleteImages(check)} bg="#fff" borderWidth='0' variant="outline" size="xs" icon={<Icon onPress={() => deleteImages(check)} size="sm" as={<Feather onPress={() => deleteImages(check)} name="trash-2" />} color="#024580" />} _pressed={{
            bg: "none"
          }} />
          <IconButton bg="#fff" borderWidth='0' variant="outline" size="xs" icon={<Icon size="sm" as={<Feather name="share" />} color="#024580" onPress={() => shareHandler(check)} />} _pressed={{
            bg: "none"
          }} />
        </HStack>
      ),
    })
  }, [deleteImages, navigation, check, selected, shareHandler])


  const deleteImages = async (check) => {

    if (check.length > 0) {
      // for (let i = 0; i < images.length; i++) {
      //   const element = images[i];
      //   if (check.includes(element.name)) {
      //     console.log('ffffffffffffffffffffffffffffffffffffff', check, element, check.includes(element.name));

      //     RNFS.unlink(element.path)
      //   }

      // }
      // setCheck([])
      // const data = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`)
      // dispatch(setImages(data));
      images.map(async (item) => {
        if (check.includes(item.name)) {
          RNFS.unlink(item.path)
            .then(async () => {
              setCheck([])
              const data = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`)
              dispatch(setImages(data));

            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
              console.log('eeee', err.message);
            });
        }
      })
    }
  }

  const selected = (type) => {
    setFileType(type)

    play();
  }

  const showModalFunction = (visible, imageURL) => {
    //handler to handle the click on image of Grid
    //and close button on modal
    setImage(imageURL);
    setOpen(visible);
  };

  return (
    <>
      {images && images.length > 0 ?
        <>
          {open ?
            (
              <Modal
                transparent={false}
                animationType={'fade'}
                visible={open}
                onRequestClose={() => {
                  showModalFunction(!open, '');
                }}>
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.4)'
                }}>
                  <FastImage
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                    }}
                    source={{ uri: image }}
                    resizeMode={
                      FastImage.resizeMode.contain
                    }
                  />
                  <IconButton position="absolute" top="2" left="-14"
                    onPress={() => showModalFunction(!open, '')}
                    icon={
                      <Icon ml={4} as={<AntDesign name="close" />} color="#000" size="xl" />
                    } />
                </View>
              </Modal>
            )
            : !loading ?
              (<FlatList
                data={images}
                numColumns={numColumns}
                showsVerticalScrollIndicator={false}
                paddingX={2}
                paddingY={2}
                renderItem={({ item }) => (
                  <Pressable position="relative" w={tileSize} h={tileSize} m="1" overflow="hidden" onPress={() => showModalFunction(true, `file://${item.path}`)}>
                    <FastImage style={{ position: "absolute", width: tileSize, height: tileSize, borderRadius: 6, resizeMode: 'contain', }} source={{
                      uri: `file://${item.path}`
                    }} />

                    <Checkbox isChecked={check.includes(item.name)} ml={1} mt={1} bg="transparent" onChange={(text) => {
                      selected('select');
                      (text ? setCheck((check) => [...check, item.name]) : setCheck((check) => check.filter(item => item.name !== item.name)));
                    }} position="absolute" size="sm" />
                    {/* <ImageBackground w="100%" h="100%" source={require('../../assets/img/house.png')} /> */}
                    {/* {item.path} */}

                    {/* <Image source={require(item.path)} alt="image" /> */}
                  </Pressable>
                )} keyExtractor={item => item.id}
              />) : <Loader />
          }
        </>
        :
        <Container maxW="100%" h="100%" alignItems="center" justifyContent="center" bg="#ffffff">
          <Empty type='gallery' title='Your gallery is a looking a bit empty.' />
        </Container>
      }

      <CameraButton navigation={navigation} details={orderDetails} />
    </>
  )
}

export default GalleryScreen;

const styles = StyleSheet.create({
  camera: {
    transform: [
      { rotate: "270deg" },
    ],
  }
})

// {
//   images.map((item, i) => (
//     <Box w="84" h="90" mt={3} borderRadius={6} borderWidth={2}>
//       <Image zIndex={2} w="84" h="90" borderRadius={6} borderWidth="2" source={{
//         uri: item.path
//       }} />
//       {/* <Checkbox onChange={(text) => text ? setCheck([...check, item.name]) : setCheck((check) => check.filter(item => item.name !== item.name))} position="absolute" /> */}
//       {/* <ImageBackground w="100%" h="100%" source={require('../../assets/img/house.png')} /> */}
//       {/* {item.path} */}

//       {/* <Image source={require(item.path)} alt="image" /> */}

//     </Box>
//   ))
// }