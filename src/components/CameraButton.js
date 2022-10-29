import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Box, Button, Modal, Text } from 'native-base'
import { useState } from 'react'
import { startDate } from '../store/utils/camera'

const CameraButton = ({ navigation, details }) => {
  const [open, setOpen] = useState(false);
  const cameraOpen = () => {
    if (!(startDate(details))) {
      setOpen(true);
      return;
    }
    navigation.navigate('Camera');
  }
  return (
    <>
      <Box position="absolute" top="1/2" right='-32' style={styles.camera} >
        <Button variant="solid" colorScheme="green" borderBottomLeftRadius="0" borderBottomRightRadius="0" borderTopLeftRadius="12" borderTopRightRadius="12" bg="green.800" size="sm" onPress={cameraOpen}   >
          <Text color="muted.200" fontSize={14} fontWeight="500" textAlign="center" px={2}> CAMERA</Text>
        </Button>
      </Box>
      <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
        <Modal.Content maxWidth="350" {...styles['center']}>
          <Modal.Body>
            This order is outside of the window start date
          </Modal.Body>
          <Button variant="ghost" colorScheme="blueGray" onPress={() => {
            setOpen(false)
          }}>
            Ok
          </Button>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default CameraButton;


const styles = StyleSheet.create({
  camera: {
    transform: [
      { rotate: "270deg" },
    ],
  }
})