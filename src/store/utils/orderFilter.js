import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { api } from '../servies/api';
import { findPhotos } from './camera';

export const ordersFilter = orders => {
  let arr = [];
  const data = orders.filter(order => {
    if (order.status === '0' || order.status === '3') {
      return order;
    }
    if (order.status === '4') {
      arr.push(order);
    }
  });
  return { openOrders: data, completeOrders: arr };
};

export const createFormData = (photo, body = {}) => {
  const data = new FormData();
  let arr = [];

  // for (let index = 0; index < photo.length; index++) {
  //   const item = photo[index];
  //   console.log(item);
  //   const file = item.name.split('.')
  //   const obj = {
  //     uri: `file://${item.path}`,
  //     name: item.name,
  //     type: `image/${file[1]}`,
  //     size: item.size,
  //   };
  //   console.log(obj);
  //   // arr.push(obj);
  //   data.append('files[]', obj);
  // }
  photo.map(item => {
    const file = item.name.split('.')
    const obj = {
      uri: `file://${item.path}`,
      name: item.name,
      type: `image/${file[1]}`,
      size: item.size,
    };
    // arr.push(obj);
    data.append('files[]', obj);
  });

  // data.append('files[]', arr);
  // data.append('files[]', {
  //   uri: `file://${photo[0].path}`,
  //   name: photo[0].name,
  //   type: `image/${photo[0].name.split('.')[1]}`,
  //   size: photo[0].size,
  // });
  // .append('files[]', fs.createReadStream('/C:/Users/Mhass/Downloads/icons8-great-britain-96.png'))

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  return data;
};

export const totalImage = async () => {
  const files = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}`);
  let count = 0;
  for (let i = 0; i < files.length; i++) {
    const folder = await RNFS.readDir(`${RNFS.ExternalDirectoryPath}/${files[i].name}/media`);
    count += folder.length;
  }
  return count;
}

export const attachmentNames = (array) => {
  let arr = [];
  array?.map((item) => {
    arr.push(item.file.split('/')[2]);
    return arr;
  });
  return arr;
}

export const createOrderQueue = async (item, comment) => {
  return new Promise(async (resolve, reject) => {
    // await AsyncStorage.removeItem('uploadQueue');
    const orders = await AsyncStorage.getItem('uploadQueue');
    (!orders) && await AsyncStorage.setItem('uploadQueue', JSON.stringify([]));
    let uploadQueue = orders ? JSON.parse(orders) : [];
    if (!(uploadQueue.find(({ order }) => order.id === item.id))) {
      uploadQueue.push({ orderStatus: "2", order: item, comment: comment });
      AsyncStorage.setItem('uploadQueue', JSON.stringify(uploadQueue));
      resolve();
    }
  })
}

export const getQueueOrders = async (images) => {
  const get = await AsyncStorage.getItem('uploadQueue');
  if (get) {
    const orders = JSON.parse(get);
    return {
      upload: orders.reduce((acc, { orderStatus }) => acc + (orderStatus !== "2" ? 1 : 0), 0),
      total: orders.length,
    }

  } else {
    return {
      upload: 0,
      total: 0
    }
  }

}

export const queueOrderStatus = async (order) => {
  return new Promise(async (resolve, reject) => {
    const orders = await AsyncStorage.getItem('uploadQueue');
    let uploadQueue = JSON.parse(orders);
    const objIndex = uploadQueue.findIndex((obj => obj.order.id == order.id));
    uploadQueue[objIndex].orderStatus = "4"
    // uploadQueue.push({ ...order, orderStatus: "4"  });
    AsyncStorage.setItem('uploadQueue', JSON.stringify(uploadQueue));
    resolve();
  })
}

export const queueDelete = () => {
  setTimeout(async () => {
    const orders = await AsyncStorage.getItem('uploadQueue');
    let uploadQueue = JSON.parse(orders);
    const arr = uploadQueue.filter(item => item.orderStatus !== "4");
    AsyncStorage.setItem('uploadQueue', JSON.stringify(arr));
  }, 2000);
}

export const uploadOrders = () => {
  return new Promise(async (resolve, reject) => {
    const get = await AsyncStorage.getItem('uploadQueue');
    const orders = JSON.parse(get);
    if (Array.isArray(orders)) {
      orders.forEach(async (elem) => {
        // for (let i = 0; i < orders.length; i++) {
        // const elem = orders[i];
        if (elem.orderStatus === "2") {
          const images = await findPhotos(elem.order);

          const form = createFormData(images, { workorder_id: elem.order.id });

          try {

            const res = await api.postFiles('/work_orders/add_attachment.php', form);

            if (res.status === 200) {
              await api.postAuth('/work_orders/comment.php', elem.comment);
              const changeStatus = await api.get(`/work_orders/change_status.php/?id=${elem.order.id}`);
              
              if (changeStatus.status === 200) {
                RNFS.unlink(`${RNFS.ExternalDirectoryPath}/${elem.order.id}`);
                queueOrderStatus(elem.order).then(() => resolve()).then(() => queueDelete())
              }
            }
          } catch (error) {
            reject();
            
          }
        }
        // }
      })

    }
  });
}
