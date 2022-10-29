import {
  Box,
  Text,
} from 'native-base';
import React from 'react';
import {EmptyGallery, EmptyImg} from '../assets/svg';

const Empty = ({type, title}) => {
  return (
    <Box alignItems="center" justifyContent="center">
      {type === 'gallery' ? <EmptyGallery /> : <EmptyImg />}
      <Box mt={8}>
        <Text fontSize={18} fontWeight="light">
          {title}
        </Text>
      </Box>
    </Box>
  );
};

export default Empty;
