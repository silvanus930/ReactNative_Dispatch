import { Box, Center, Container, HStack, Image, Stack, Text, Heading, VStack, Input, Button } from 'native-base';
import React from 'react';

const Confirmation = () => {

  return (
    <Box alignItems="center">
      <Image source={require('../assets/img/confirm.png')} />
      <Box mt={8} ml={-12}>
        <Text fontSize={22} fontWeight="light" >Success!</Text>
        <Text fontSize={18} fontWeight="light" >Your account has been created!</Text>
      </Box>
    </Box>
  )
}

export default Confirmation
