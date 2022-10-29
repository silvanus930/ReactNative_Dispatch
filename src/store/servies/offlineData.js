import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetDatas = async type => {
  if (type === 'openOrders') {
    return await AsyncStorage.getItem('openOrders');
  }
  if (type === 'completeOrders') {
    return await AsyncStorage.getItem('completeOrders');
  }
  if (type === 'userInfo') {
    return await AsyncStorage.getItem('userInfo');
  }
}