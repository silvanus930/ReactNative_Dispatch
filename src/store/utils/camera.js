import { format, formatDistance, subDays } from "date-fns";
import RNFS from 'react-native-fs';


export const findFileName = (files, fileName) => {
  return files.find(file => file.name === fileName);
}

export const findPhotos = async (order) => {
  try {
    return await RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${order.id}/media`);
    
  } catch (error) {
    return 'error'
  }
}


export const checkExpirePhotos = async () => {
  const count = 0;
  const files = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}`);
  files.map((item) => {
    const time = formatDistance(new Date(item.mtime), new Date(), { addSuffix: true })
    if (time === '3 days ago') {
      RNFS.unlink(item.path);
      count++;
    }
  })
  return count;
}

export const fileName = () => format(new Date(), "MM-dd-yyyy-hh:mm-a")

export const deleteImages = (data, arr) => {
  data.map(async (item) => {
    if (arr.includes(item.name)) {
      await RNFS.unlink(item.path)
    }
  })
}

export const startDate = (orderDetails) => {
  const date = orderDetails?.start_date?.replace(' ', 'T')
  const startTime = new Date(date).getTime();
  const endTime = new Date().getTime();
  return startTime <= endTime;
}