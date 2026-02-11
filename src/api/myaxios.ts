import axios from 'axios';
import { useStatusStore } from '@/stores/status';
import { createDiscreteApi } from "naive-ui";
import { theme } from '@/theme';
import router from '@/router';


const statusStore = useStatusStore()
const notify = createDiscreteApi(["notification"],{configProviderProps: computed(() => ({theme: theme.value}))}).notification;

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

const handleError = (code:number,e?: Error) => {
  if (code == 401) {
    statusStore.token = ""
    statusStore.isLogin = false
    const msg = (() => {
      switch (statusStore.siteLang) {
        case "zh-CN" : return {title:"请求失败",description: "未登录/登录已过期"}
        case "zh-TW" : return {title:"請求失敗",description: "未登入/登入已過期"}
        case "en" : return {title:"Request Failed",description: "Not Logged In/Session Expired"}
        case "ja-JP" : return {title:"リクエストに失敗しました",description: "未ログイン/ログイン期限切れ"}
      }
    })();
    const {title, description} = msg
    notify.error({title, description,duration:1800})
    router.push("/login?redirect="+router.currentRoute.value.fullPath)
  } else if (!code) {
    notify.error({title:'Error',description:e?.message})
  }
}

myaxios.interceptors.response.use(
  (response) => {
    response.data.error?.code && handleError(response.data.error?.code || -1)
    return response
  },
  (error) => {
    handleError(error.response.status,error)
    return Promise.reject(error);
  }
);

export default myaxios