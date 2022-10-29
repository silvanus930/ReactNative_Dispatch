import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Box, Spinner } from 'native-base';

const Loader = () => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Spinner size="sm" />
    </Box>
  )
}

export default Loader;