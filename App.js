/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'react-native-gesture-handler';
import {
  SafeAreaView,
  ScrollView,

  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// import { Routes } from './src/routes';


import AuthScreen from './src/views/AuthScreen';
import { Box, Button, HStack, Icon, IconButton, NativeBaseProvider, StatusBar } from 'native-base';
import HomeScreen from './src/views/HomeScreen';
import UploadScreen from './src/views/UploadScreen';
import DetailScreen from './src/views/DetailScreen';

import GalleryScreen from './src/views/DetailScreen/GalleryScreen';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/store';
import SplashScreen from './src/views/SplashScreen';
import Navigation from './src/navigation';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const config = {
    dependencies: {
      "linear-gradient": require("react-native-linear-gradient").default,
    },
  };


  // const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#024580" hidden={false} />
      <NativeBaseProvider config={config} >
        <Navigation />
      </NativeBaseProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
