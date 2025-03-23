<script setup lang="ts">
import { useStatusStore } from "@/stores/status";
import { i18nSelectOptions } from '@/lang/i18n.config';
import { useI18n } from "vue-i18n";
import type { SelectOption } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
const { t } = useI18n()
const statusStore = useStatusStore();
const openUrl = (url:string) => window.open(url) 
const router = useRouter()
const notify = useNotification()
const dialog = useDialog()

const switchTheme = () => {
  const themeList = ["light", "dark", "auto"];
  statusStore.theme = themeList[(themeList.indexOf(statusStore.theme) + 1) % themeList.length] as "light" | "dark" | "auto";
};

const menuSelectOptions: SelectOption[] = [
  { label: t("logout"), key: "logout" }
]
const menuSelectActions = {
  login() {
    router.push("/login")
  },
  logout() {
    dialog.warning({
      title: t("logout"),
      content: t("logout_confirm"),
      positiveText: t("enter"),
      onPositiveClick: async () => {
        statusStore.token = ""
        statusStore.isLogin = false
        notify.success({title:t("logout_finish"),duration: 1800})
        await router.push("/login")
      }
    })
  }
}
</script>

<template>
  <nav id="nav">
    <div class="nav-content">
      <span class="title"></span>
      <n-flex>

        <n-button :focusable="false" size="large" quaternary circle @click="router.push('/')">
          <template #icon><SvgIcon name="home"/></template>
        </n-button>

        <n-button :focusable="false" size="large" quaternary circle @click="openUrl('https://github.com/coderxi1/cloudflare-worker-url-shortner')">
          <template #icon><SvgIcon name="github"/></template>
        </n-button>

        <n-button :key="statusStore.theme" :focusable="false" size="large" quaternary circle @click="switchTheme">
          <template #icon><SvgIcon :name="statusStore.theme+'-mode'"/></template>
        </n-button>
        
        <n-popselect v-model:value="statusStore.siteLang" :options="i18nSelectOptions" trigger="hover">
          <n-button :focusable="false" size="large" quaternary circle>
            <template #icon><SvgIcon name="language" /> </template>
          </n-button>
        </n-popselect>

        <n-button v-if="!statusStore.isLogin" :disabled="useRoute().path=='/login'" @click="menuSelectActions.login" :focusable="false" size="small" style="margin: 6px 0;">{{ $t("login") }}</n-button>
        <n-dropdown v-else :options="menuSelectOptions" trigger="hover" @select="(key:string)=>(menuSelectActions as any)[key]()">
          <n-button :focusable="false" size="large" quaternary circle>
            <template #icon><SvgIcon v-if="!statusStore.isLogin" name="menu" /> <SvgIcon v-else name="account" /></template>
          </n-button>
        </n-dropdown>
        
      </n-flex>
    </div>
  </nav>

</template>

<style lang="scss">
nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  .nav-content {
    display: flex;
    align-items: center;
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px;
    transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    .title {
      flex: 1;
    }
  }
}
</style>