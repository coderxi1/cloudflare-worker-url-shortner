<script setup lang="ts">
import * as api from '@/api';
import { useStatusStore } from '@/stores/status';
const statusStore = useStatusStore();
const notify = useNotification()
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const dialog = useDialog()

import type { SaveUrlRequestParams } from '../../types/request';
import { NCode } from 'naive-ui';
const params: SaveUrlRequestParams = reactive({
  url: '',
  key: '',
  expireDay: 1,
  options: {
    responseMode: 'redirect',
    proxyOptions: {
      method: 'GET',
      headers: {},
      body: '',
      allowOrigin: true
    },
  },
})

const proxyOptionsHeaders = ref<{ key: string, value: string }[]>([{ key: '', value: '' }]);
watch(() => proxyOptionsHeaders, (headers) => {
  params.options.proxyOptions.headers = {}
  headers.value.forEach(({key,value}) => { key && (params.options.proxyOptions.headers![key] = value) })
},{deep:true})

const saveUrlRequesting = ref(false)
const saveUrl = async () => {
  saveUrlRequesting.value = true
  const {data} = await api.saveUrl(params)
  if (data.error) {
    notify.error({
      title: t("saveUrlForm.failed"),
      description: t("error." + data.error.code),
      duration: 2000,
    })
  } else {
    dialog.success({
      title: t("saveUrlForm.success"),
      content: () => h('div', {}, [
        h('p', {}, t("saveUrlForm.success_tip")),
        h('code', {innerText:`${location.origin}/${data.key}`})
      ]),
      positiveText: t("enter")
    })
  }
  saveUrlRequesting.value = false
}
</script>

<template>
<CenterLayout>
  <n-card>
    <h1 style="line-height: 0; font-size: 1.25rem; text-align: center;">{{ $t("title") }}</h1>
    <n-form :model="params" size="large">
      <div v-if="!statusStore.isLogin">
        <n-form-item prop="url">
          <n-input-group>
            <n-input v-model:value="params.url" :placeholder="$t('saveUrlForm.url.placeholder')"></n-input>
            <n-button type="primary" @click="saveUrl">{{ $t('saveUrlForm.submit') }}</n-button>
          </n-input-group>
        </n-form-item>
      </div>
      <div v-else>
        <n-form-item prop="url">
          <n-input v-model:value="params.url" :placeholder="$t('saveUrlForm.url.placeholder')"></n-input>
        </n-form-item>
        <n-form-item :label="$t('saveUrlForm.key.label')" prop="key">
          <n-input v-model:value="params.key" :placeholder="$t('saveUrlForm.key.placeholder')"></n-input>
        </n-form-item>
        <n-form-item :label="$t('saveUrlForm.expireDay.label')" path="expireDay">
          <n-radio-group v-model:value="params.expireDay" name="expireDay" style="width: 100%;">
            <n-space justify="space-between">
              <n-radio :value=1>{{ $t('saveUrlForm.expireDay.value-1') }}</n-radio>
              <n-radio :value=7>{{ $t('saveUrlForm.expireDay.value-day', { day: 7 }) }}</n-radio>
              <n-radio :value=30>{{ $t('saveUrlForm.expireDay.value-day', { day: 30 }) }}</n-radio>
              <n-radio :value=-1>{{ $t('saveUrlForm.expireDay.value-forever') }}</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item :label="$t('saveUrlForm.options.responseMode.label')" prop="params.options.responseMode" path="responseMode">
          <n-radio-group v-model:value="params.options.responseMode" name="mode" style="width: 100%;">
            <n-radio-button value='redirect'>{{ $t('saveUrlForm.options.responseMode.value-redirect') }}</n-radio-button>
            <n-radio-button value='manual'>{{ $t('saveUrlForm.options.responseMode.value-manual') }}</n-radio-button>
            <n-radio-button value='proxy'>{{ $t('saveUrlForm.options.responseMode.value-proxy') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-collapse-transition :show="params.options.responseMode=='proxy'">
        <n-form-item :label="$t('saveUrlForm.options.proxyOptions.label')" prop="params.options.proxyOptions" path="proxyOptions">
          <table style="width: 100%;">
            <tbody>
              <tr>
                <td style="width: 6em; max-width: 6em;">{{ $t('saveUrlForm.options.proxyOptions.method.label') }}</td>
                <td><n-select v-model:value="params.options.proxyOptions.method" filterable :options="['GET', 'POST', 'PUT', 'DELETE', 'HEAD'].map(method => ({ label: method, value: method }))"></n-select></td>
              </tr>
              <tr>
                <td>{{ $t('saveUrlForm.options.proxyOptions.url.label') }}</td>
                <td><n-input :value="params.url" :placeholder="params.url" disabled></n-input></td>
              </tr>
              <tr style="vertical-align: top;">
                <td>{{ $t('saveUrlForm.options.proxyOptions.headers.label') }}</td>
                <td>
                  <n-dynamic-input v-model:value="proxyOptionsHeaders" preset="pair"
                    :key-placeholder="$t('saveUrlForm.options.proxyOptions.headers.key-placeholder')"
                    :value-placeholder="$t('saveUrlForm.options.proxyOptions.headers.value-placeholder')" />
                </td>
              </tr>
              <tr style="vertical-align: top;">
                <td>{{ $t('saveUrlForm.options.proxyOptions.body.label') }}</td>
                <td><n-input type="textarea" v-model="params.options.proxyOptions.body"></n-input></td>
              </tr>
              <tr>
                <td>{{ $t('saveUrlForm.options.proxyOptions.allowOrigin.label') }}</td>
                <td><n-switch v-model:value="params.options.proxyOptions.allowOrigin"></n-switch></td>
              </tr>
            </tbody>
          </table>
        </n-form-item>
        </n-collapse-transition>
        <n-button type="primary" size="large" style="width: 100%;" @click="saveUrl" :loading="saveUrlRequesting">{{ $t('saveUrlForm.submit') }}</n-button>
      </div>
    </n-form>
  </n-card>
</CenterLayout>
</template>

<style lang="scss" scoped>
.n-card {
  max-width: 600px;
  margin: 0 auto;
  animation: fade-slide-in 0.5s ease-out;
}
</style>