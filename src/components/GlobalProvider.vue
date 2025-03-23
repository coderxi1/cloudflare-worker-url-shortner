<script setup lang="ts">
import { useStatusStore } from '@/stores/status';
const statusStore = useStatusStore();
// theme
import { lightThemeOverrides, darkThemeOverrides} from '@/theme'
import { lightTheme, darkTheme, type GlobalTheme, type GlobalThemeOverrides } from 'naive-ui'
const theme = ref<GlobalTheme|null>()
const themeOverrides = ref<GlobalThemeOverrides>()
watch(() => statusStore.theme, (themeTo) => {
  if (themeTo == 'auto') {
    themeTo = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  if (themeTo == 'light') {
    theme.value = lightTheme
    themeOverrides.value = lightThemeOverrides
  } else {
    theme.value = darkTheme
    themeOverrides.value = darkThemeOverrides
  }
  document.documentElement.className = themeTo
},{immediate: true})
// i18n
import { useI18n } from 'vue-i18n';
import { zhCN, enUS, jaJP, type NLocale } from 'naive-ui'
import { useRoute } from 'vue-router';
const locale = ref<NLocale>(zhCN)
const { locale: i18nLocale, t } = useI18n()
watch(() => statusStore.siteLang, (lang) => {
  i18nLocale.value = lang
  locale.value = lang == 'zh-CN' ? zhCN : lang == 'en' ? enUS : jaJP
  document.documentElement.lang = lang
},{immediate: true})

// i18n title
const route = useRoute()
const setTitle = () => {
  const subtitle = route?.meta?.subtitle as string
  if (subtitle) {
    document.title = t(subtitle) + ' - ' + t('title')
  } else {
    document.title = t('title')
  }
}
watch(()=>statusStore.siteLang,setTitle)
watch(()=>route.path,setTitle,{immediate: true})
</script>

<template>
  <n-config-provider :theme="theme" :locale="locale" :theme-overrides="themeOverrides">
    <n-global-style />
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <slot></slot>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
  </n-config-provider>
</template>