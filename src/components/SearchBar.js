import { View, Text } from 'react-native'
import React from 'react'
import { Icon, Input, VStack, IconButton, Box } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SearchIcon } from '../assets/svg';

const SearchBar = ({ searchFilter }) => {
  return (
    <Box bg="#fff" borderRadius="6">
      <Input placeholder="Search.." variant="filled" size="sm" width="100%" py="0" px="1" borderWidth="0"
        onChangeText={(text) => searchFilter(text)}
        onClear={(text) => searchFilter('')}
        InputLeftElement={
          <IconButton
            variant="outline"
            size="xs"
            py="0"
            borderWidth="0"
            icon={
              <Icon as={<SearchIcon width="14" height="14" />} color="#FFFFFF" />
            }
          />} />
    </Box>
  )
}

export default SearchBar