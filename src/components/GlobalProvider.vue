<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useStatusStore } from '@/stores/status';
const statusStore = useStatusStore();
// theme
import { theme, themeOverrides, switchTheme } from '@/theme'
watch(() => useStatusStore().theme, switchTheme,{immediate: true})
// i18n
import { useI18n } from 'vue-i18n';
import { zhCN, enUS, jaJP, type NLocale } from 'naive-ui'

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