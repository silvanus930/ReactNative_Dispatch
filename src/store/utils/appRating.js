export const selectShouldShowRatingDialog = (state) => {
  const { installDate, appRated, remindMeDate } = state.appRating;

  if (appRated) {
    return false;
  }

  const sevenDaysAfterInstall =
    new Date(installDate).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000;
  // console.log('remindMeDate', (!remindMeDate && sevenDaysAfterInstall));
  // console.log('sevenDaysAfterInstall', remindMeDate, sevenDaysAfterInstall, remindMeDate, new Date(remindMeDate).getTime() < Date.now(), (!remindMeDate && sevenDaysAfterInstall) ||
  //   (remindMeDate && new Date(remindMeDate).getTime() < Date.now()))
  return (
    (!remindMeDate && sevenDaysAfterInstall) ||
    (remindMeDate && new Date(remindMeDate).getTime() < Date.now())
  );
};