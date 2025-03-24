<script setup lang="ts">
import * as api from '@/api';
import router from '@/router';
import { useStatusStore } from '@/stores/status';
const statusStore = useStatusStore()
const notify = useNotification()
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const params = reactive({
  password: ''
})

const loginRequesting = ref(false)

const login = async () => {
  loginRequesting.value = true
  const {data} = await api.login(params)
  loginRequesting.value = false
  if (data.error) {
    notify.error({
      title: t("login_failed"),
      description: t("error." + data.error.code),
      duration: 1800,
    })
  } else {
    notify.success({
      title: t("login_success"),
      duration: 1800,
    })
    statusStore.token = data.token
    statusStore.isLogin = true
    router.push(router.currentRoute.value.query.redirect as string||'/')
  }
}

</script>

<template>
  <div class="center">
    <n-card>
      <n-form ref="formRef" :model="params" size="large">
        <n-form-item path="password">
          <n-input-group>
            <n-input v-model:value="params.password" type="password" show-password-on="click" :placeholder="$t('loginForm.password.placeholder')"/>
            <n-button :loading="loginRequesting" type="primary" @click="login">{{ $t("login") }}</n-button>
          </n-input-group>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
  
<style lang="scss" scoped>
.n-card {
  max-width: 600px;
  margin: 0 auto;
  animation: fade-slide-in 0.5s ease-out;
}
</style>