import { View, StyleSheet, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BgCloudIcon, CloudIcon } from '../assets/svg'
import { Box, Button, Container, Icon, IconButton, Progress, Text } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useSound from 'react-native-use-sound';
import { useDispatch, useSelector } from 'react-redux';
import { getQueueOrders, totalImage, uploadImages, uploadOrders } from '../store/utils/orderFilter';
import { getOrders, setTotalImages, setUploadStats } from '../store/state/orderSlice';

const UploadScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [play, pause, stop] = useSound('back.wav');
  const { userId, profile } = useSelector((state) => state.auth);
  const { uploadStats, totalImages } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const uploaded = async () => {
    uploadOrders().then(async (res) => {
      
      setError(null);
      const uploaded = await getQueueOrders();
      dispatch(setUploadStats({ ...uploaded, remaining: uploaded.total - uploaded.upload }));
      dispatch(getOrders(userId));
    }).catch(async () => {
      setError('Fail to Upload.');
      const uploaded = await getQueueOrders();
      
      dispatch(setUploadStats({ ...uploaded, remaining: uploaded.total - uploaded.upload }));
      dispatch(getOrders(userId));
    })
    // if (upload) {
    // setTimeout(async () => {
    // }, 6000);
    // }
  }

  return (
    <Container maxW="100%" h="100%" alignItems="center" justifyContent="flex-start" bg="#ffffff"  >
      <View style={styles.box} >
        <View style={styles.boxOne}>
          <Icon as={<AntDesign name="close" />} color="#ffffff" size="xl" onPress={() => { navigation.navigate('Home'); play() }} />
        </View>
        <View style={styles.boxTwo}>
          <CloudIcon color='#fff' width="132" height="105" />
        </View>
      </View>
      <Box w="100%" mt={20}>
        <Box position="relative" w="100%">
          <Progress bg="coolGray.100" size="2xl" _filledTrack={{
            bg: "#024580",
            _text: "2"
          }} value={Math.floor((uploadStats.upload / uploadStats.total) * 100)} mx="4" />

          <Text color={((uploadStats.upload / uploadStats.total) * 100) < 50? "black": "white"} fontSize="sm" mt={0.5} position="absolute" left="45%" >{Math.floor((uploadStats.upload / uploadStats.total) * 100)}%</Text>
        </Box>
        <Text ml={4} pt={1} color="muted.400">{uploadStats.upload}/{uploadStats.total} Orders Uploaded</Text>
      </Box>
      <Box w="90%" mt={16}>
        {error && <Text color="red.500">Failed To Upload</Text>}
        <Button size="sm" borderColor="#024580" borderWidth="2" borderRadius={10} variant="outline" onPress={uploaded}>
          <Text color="#024580">{error ? "RE-UPLOAD" : "UPLOAD"}</Text>
        </Button>
      </Box>
    </Container>
  )
}

export default UploadScreen;

const styles = StyleSheet.create({
  box: {

    width: "110%",
    height: "36%",
    backgroundColor: "#024580",
    transform: [
      { rotate: "-8deg" },
      { translateY: -30 },
      { translateX: 0 }
    ],
    justifyContent: "center",
    alignItems: "center",
  },
  boxOne: {
    width: "80%",
    transform: [
      { rotate: "8deg" },
    ],

  },
  boxTwo: {
    transform: [
      { rotate: "8deg" },
    ],
  }
});

// position: "absolute",
// top: 0,
// bottom: 0,
// right: 0,
// left: 0,
// width: "100%",
// height: "100%",
// background: "#2c3e50",
// transform: 'skewY(-6deg)',
// transformOrigin: "top left",