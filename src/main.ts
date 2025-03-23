import '@/assets/main.scss'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import piniaPersistedState from "pinia-plugin-persistedstate";

import i18n from '@/lang/i18n.config';

const pinia = createPinia()
  .use(piniaPersistedState);

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)

app.mount('#app')
