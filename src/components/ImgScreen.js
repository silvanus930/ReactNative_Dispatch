import { View } from 'react-native'
import React from 'react'
import { Box, Text } from 'native-base';
import Img from '../assets/img';

export const ConfirmScreen = () => {
  return (
    <Box alignItems="center" >
      <Img img="0" width="200" height="200" />
      <Box mt={8} ml={-12}>
        <Text fontSize={22} fontWeight="light" >Success!</Text>
        <Text fontSize={18} fontWeight="light" >Your account has been created!</Text>
      </Box>
    </Box>
  )
}
export const ImgScreen = ({ img, text }) => {
  return (
    <>
      <Img img={img} />
      <Box mt={8} >
        <Text fontSize={18} fontWeight="light" >{text}</Text>
      </Box>
    </>
  )
}

