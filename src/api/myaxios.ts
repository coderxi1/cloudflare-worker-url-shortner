import { useStatusStore } from '@/stores/status';
import axios from 'axios';

const statusStore = useStatusStore()

const myaxios = axios.create({
  baseURL: '/',
  timeout: 5000,
});

myaxios.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = statusStore.token
    return config;
  },
  Promise.reject
);

myaxios.interceptors.response.use(
  (response) => {
    if (response.data.error?.code == 401) {
      statusStore.token = ""
      statusStore.isLogin = false
    }
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      statusStore.token = ""
      statusStore.isLogin = false
    }
    return Promise.reject(error);
  }
);

export default myaxios