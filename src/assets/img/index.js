import { Image } from 'native-base';
import React from 'react';

const Index = ({ img, width = 100, height = 200 }) => {
  const items = [
    require('./confirm.png'),
    require('./empty.png'),
    require('./gallery.png'),
  ];
  return (
    <>
      <Image
        source={items[img]}
      />
    </>
  )
}

export default Index