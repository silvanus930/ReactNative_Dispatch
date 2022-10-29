import { NativeModules, View, Text, StyleSheet, TouchableWithoutFeedback, BackHandler, Animated, Dimensions, StatusBar, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, Icon, Modal, Alert, Pressable, Image } from 'native-base';
import RNFS from 'react-native-fs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { PanGestureHandler, PinchGestureHandlerGestureEvent, PinchGestureHandler, State, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { findFileName } from '../../store/utils/camera';
import { useDispatch } from 'react-redux';
import { setImages } from '../../store/state/orderSlice';
import Marker from "react-native-image-marker";
import { format } from "date-fns";
import { Camera, parsePhysicalDeviceTypes, useCameraDevices } from 'react-native-vision-camera';
import useSound from 'react-native-use-sound';
import { useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import ImageCompressor from 'react-native-compressor';

const height = Dimensions.get("window").height + (StatusBar.currentHeight === 24 ? StatusBar.currentHeight - 10 : 16)
const { width } = Dimensions.get('window');
// import Reanimated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedGestureHandler,
//   useAnimatedProps,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated"


// const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
// Reanimated.addWhitelistedNativeProps({
//   zoom: true,
// })
const SCALE_FULL_ZOOM = 3;
const NativeImage = NativeModules
const base64UrlRegex = /^data:image\/.*;(?:charset=.{3,5};)?base64,/;

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const CameraScreen = ({ navigation }) => {
  const [play, pause, stop, data] = useSound('camera_shutter.mp3');
  const camera = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [screenEffect, setScreenEffect] = useState(true);
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState({ zoom: 1, maxZoom: 2, minZoom: 1, neutralZoom: 0.1 });
  const [flash, setFlash] = useState('off');
  const [image, setImage] = useState(null);
  const [touchY, setTouchY] = useState(0);
  const [deviceType, setDeviceType] = useState('');
  const { orderDetails } = useSelector((state) => state.order);
  // const [{ cameraRef, autoFocus, autoFocusPoint, flash }, { takePicture, touchToFocus, setFlash }] = useCamera(null);

  const devices = useCameraDevices(deviceType);
  const device = devices.back;
  const isFocused = useIsFocused();
  // const zooming = useSharedValue(1)


  const backHandle = () => {
    RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`).then((data) => {
      dispatch(setImages(data));

    })

  }
  useEffect(() => {
  }, [!isFocused]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
      const device = await Camera.getAvailableCameraDevices();
      setZoom({ ...zoom, maxZoom: device[0].maxZoom, minZoom: 0, neutralZoom: device[0].neutralZoom })
      const deviceType = parsePhysicalDeviceTypes(device[0].devices);
      setDeviceType(deviceType);
      setScreenEffect(true);
    })()
  }, [])

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // const animatedProps = useAnimatedProps(() => {
  //   const z = Math.max(Math.min(zooming.value, zoom.maxZoom), zoom.minZoom);

  //   console.log('zooming', z, Math.min(zooming.value, zoom.maxZoom), zooming.value);
  //   return {
  //     zoom: z,
  //   };
  // }, [zoom, zooming]);

  const onRefresh = useCallback(() => {
    setScreenEffect(false);
    wait(100).then(() => setScreenEffect(true));
  }, [])

  const captureHandle = async () => {
    onRefresh();
    // play();
    const data = await camera.current.takePhoto({
      flash: flash,
      enableAutoStabilization: true,
      skipMetadata: true,
    });

    const files = await RNFS.readDir(RNFS.ExternalDirectoryPath);
    if (!findFileName(files, orderDetails.id)) {
      await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`);
    }
    // const data = await takePicture({ pauseAfterCapture: false, skipProcessing: true, fixOrientation: true, forceUpOrientation: true });
    // const value = `file://${data.path}`;

    //   console.log('aaaaaaaaaaaaaaaaaaaa', NativeImage)
    //   const cleanData = value.replace(base64UrlRegex, '');
    //   const result = await NativeImage.image_compress(cleanData, {
    //     compressionMethod: 'auto',
    //   });


    const result = await ImageCompressor.Image.compress(`file://${data.path}`, {
      compressionMethod: 'auto',
    });

    const image = await Marker.markText({
      src: result,
      text: `${format(new Date(), "MM-dd-yyyy hh:mm a")}`,
      position: 'bottomLeft',
      color: '#000', // '#ff0000aa' '#f0aa'
      fontName: 'Arial-BoldItalicMT',
      fontSize: 48,
      textBackgroundStyle: {
        paddingX: 20,
        paddingY: 10,
        color: '#fff' // '#0f0a'
      },
      scale: 1,
      quality: 100
    });

    if (image) {
      const newFilePath = `${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media/${new Date().getTime()}.jpg`;
      await RNFS.moveFile(image, newFilePath);
      // const images = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`)
      // dispatch(setImages(images));
    }

    //   .then(async (res) => {
    //   // setImage(res);
    //   const newFilePath = `${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media/${new Date().getTime()}.jpg`;
    //   await RNFS.moveFile(res, newFilePath);
    //   const images = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`)
    //   dispatch(setImages(images));
    // }).catch((err) => {
    //   console.log(err)
    // })
  }

  const onTouchStartHandle = (e) => setTouchY(e.nativeEvent.pageY);
  // const onTouchMoveHandle = (e) => {
  //   // console.log(zoom, (zoom.zoom + 0.1 <= zoom.maxZoom && zoom.zoom + 0.1 >= zoom.minZoom), zoom.zoom + 0.1, zoom.zoom + 0.1 <= zoom.maxZoom, zoom.zoom + 0.1 >= zoom.minZoom);
  //   // console.log('zooming zoom', zooming, zoom, e.nativeEvent.pageY < touchY, (zooming.value + zoom.neutralZoom <= zoom.maxZoom && zooming.value + zoom.neutralZoom >= zoom.minZoom), e.nativeEvent.pageY > touchY, (zooming.value - zoom.neutralZoom <= zoom.maxZoom && zooming.value - zoom.neutralZoom >= zoom.minZoom));
  //   console.log('zooming zoom', zooming);
  //   if (e.nativeEvent.pageY < touchY && (zooming.value + zoom.neutralZoom <= zoom.maxZoom && zooming.value + zoom.neutralZoom >= zoom.minZoom)) {
  //     zooming.value = withSpring(zooming.value + (zoom.maxZoom / 12))
  //     console.log(withSpring(zooming.value + (zoom.maxZoom / 12)))
  //     setZoom({ ...zoom, zoom: zooming.value + (zoom.maxZoom / 12) });
  //     // console.log('zooming in', zooming.value, zoom.maxZoom / 12, zooming.value + (zoom.maxZoom / 12));
  //     return;
  //   }
  //   console.log('zooming zoom', zooming.value - zoom.neutralZoom, zoom.minZoom, zooming.value - zoom.neutralZoom >= zoom.minZoom);
  //   if (e.nativeEvent.pageY > touchY && (zooming.value - zoom.neutralZoom <= zoom.maxZoom && zooming.value - zoom.neutralZoom >= zoom.minZoom)) {
  //     zooming.value = withSpring(zooming.value - (zoom.maxZoom / 12))
  //     setZoom({ ...zoom, zoom: zooming.value - (zoom.maxZoom / 12) });
  //     // console.log('zooming out', zooming.value, zoom.maxZoom / 12, zooming.value - (zoom.maxZoom / 12));
  //     return;
  //   }
  // }
  const onTouchEndHandle = (e) => setTouchY(e.nativeEvent.pageY);
  const closeHandle = async () => setImage(null);
  const saveHandle = async () => {
    setImage(null);
    const files = await RNFS.readDir(RNFS.ExternalDirectoryPath)
    if (!findFileName(files, orderDetails.id)) {
      await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`);
    }
    const newFilePath = `${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media/${new Date().getTime()}.jpg`;
    await RNFS.moveFile(image, newFilePath);
    const images = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${orderDetails.id}/media`)
    dispatch(setImages(images));
  };

  // const scale = useSharedValue(1);
  // const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      zooming.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = zooming.value;
    });

  // const animatedStyle = useAnimatedStyle(() => ({
  //   transform: [{ scale: zooming.value }],
  // }));

  // const onPinchGesture = useAnimatedGestureHandler({
  //   onStart: (_, context) => {
  //     context.startZoom = zooming.value;
  //   },
  //   onActive: (event, context) => {
  //     console.log('aaaaaa');

  //     // we're trying to map the scale gesture to a linear zoom here
  //     const startZoom = context.startZoom ?? 0;
  //     const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
  //     zooming.value = interpolate(scale, [-1, 0, 1], [zoom.minZoom, startZoom, zoom.maxZoom], Extrapolate.CLAMP);
  //   },
  // });

  return (
    <>
      {hasPermission && device &&

        <>
          <Camera
            ref={camera}
            style={{ flex: 1, position: "relative" }}
            device={device}
            isActive={isFocused}
            torch={flash}
            enableZoomGesture={true}
            // animatedProps={animatedProps}
            photo={true}


          // onTouchStart={onTouchStartHandle}
          // onTouchMove={onTouchMoveHandle}
          // onTouchEnd={onTouchEndHandle}
          />
          <Box w={width} h={height * 0.99} position="absolute" justifyContent="space-between">
            <Box w="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
              <IconButton icon={<Icon as={<MaterialIcons name="arrow-back-ios" />} color="#ffffff" size="xl" />} onPress={() => navigation.goBack()} />
              <IconButton w="10%" icon={<Icon color="light.200" size="lg" as={<MaterialIcons name={flash === 'on' ? 'flash-on' : 'flash-off'} />} name="capture" />} onPress={() => setFlash((flash) => flash === 'on' ? 'off' : 'on')} />
            </Box>
            <Box w="100%" alignItems="center">
              <Box w="16" h="16" bg="white" borderWidth={2} borderColor='light.100' borderRadius="full" alignItems="center" justifyContent="center" p={8} mb={2}>
                <IconButton size="full" marginLeft={2} icon={<Icon color="light.100" size="6xl" as={<FontAwesome name='circle' />} name="capture" onPress={captureHandle} />} />
              </Box>
            </Box>
          </Box>
          {!screenEffect && <Box h="100%" w="100%" bg="white" />}
        </>
      }
    </>
  )
}

export default CameraScreen;

const styles = StyleSheet.create({
  preview: {

    flex: 1,
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  }
})