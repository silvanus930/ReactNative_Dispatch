import { View, Text } from 'react-native'
import React from 'react';
import { useSelector } from 'react-redux';

const AppRating = () => {
  const { installDate, appRated, remindMeDate } = useSelector((state) => state.appRating);
  if (appRated) {
    return false;
  }

  const sevenDaysAfterInstall =
    new Date(installDate).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    (!remindMeDate && sevenDaysAfterInstall) ||
    (remindMeDate && new Date(remindMeDate).getTime() < Date.now())
  );
}

export default AppRating