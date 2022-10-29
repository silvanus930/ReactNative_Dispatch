import { Text, View } from 'react-native'
import React from 'react';
import Lightbox from 'react-native-lightbox';
import { Image } from 'native-base';

const LightboxView = ({ navigation }) => {
  
  return (
    <Lightbox style={{ flex: 1, borderWidth: 2, justifyContent: 'center' }} underlayColor="white" backgroundColor="red"  >
      <Image
        style={{ height: '100%', width: '100%'}}
        source={{ uri: 'http://knittingisawesome.com/wp-content/uploads/2012/12/cat-wearing-a-reindeer-hat1.jpg' }}
      />
    </Lightbox>
  )
}

export default LightboxView;