import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";

const url = 'https://app.dispatch.inc/api';
// const url = 'http://verifiedproperties.com/app/api';
const getToken = async () => AsyncStorage.getItem('token');

// const Api = axios.create({
//   baseURL: 'https://app.dispatch.inc/api',
//   headers: {
//     'content-type': 'application/json',
//     'Accept': 'application/json',
//     'Accept': 'multipart/form-data'
//   }
// });

export const api = {
  post: async (api, body) => {
    return await axios(url + api, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Content-Type": "multipart/form-data"
      },
      data: body
    })
  },
  postFiles: async (api, body) => {
    const token = await getToken()
    return await axios(url + api, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
      data: body
    })
  },
  postAuth: async (api, body) => {
    const token = await getToken();
    return await axios(url + api, {
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
      data: body
    })
  },
  get: async (api) => {
    const token = await getToken()
    return await axios(url + api, {
      method: 'GET',
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
    })
  },
}


// const apiInstance = axios.create({
//   baseURL: 'https://app.dispatch.inc/api',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'multipart/form-data'
//   }
// });
// apiInstance.interceptors.request.use(async config => {
//   const token = await getToken();
//   console.log('token check:::', token)
//   if (token) {
//     console.log('Request token', token);
//     config.headers['Authorization'] = 'Bearer ' + token;
//   }

//   return config;
// }, error => {
//   Promise.reject(error);
// });

// export const get = (api) => apiInstance.get(api);
// export const post = (api, data) => apiInstance.post(api, data);


// apiInstance.interceptors.response.use((config) => {
//   console.log('wwwwwwwwwww', config)
//   return config
// }, async (error) => {

//   const originalRequest = error.config;
//   if (error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
//     originalRequest.isRetry = true;
//     StackActions.replace('Upload');
//     console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', error.response.status === 401, StackActions);
//   }
//   throw error;
// })