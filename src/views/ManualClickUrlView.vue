<script setup lang="ts">
import { useRoute } from 'vue-router'
const { query } = useRoute()
const url : string = (query.url||'')?.toString()
const host = new URL(url).host
const jumpUrl = (url:string) => location.href = url
</script>

<template>
  <CenterLayout>
    <n-card :title="$t('manualClickUrl.title',{host})">
      <p v-html="$t('manualClickUrl.tips',{url})"></p>
      <p style="margin-top:2rem;text-align:right;">
        <n-button @click="jumpUrl(url)">{{ $t('manualClickUrl.continue') }}</n-button>
      </p>
    </n-card>
  </CenterLayout>
</template>

<style lang="scss" scoped>
.n-card {
  max-width: 600px;
  margin: 0 auto;
}

</style>

<style>
a {
  color: #0078F9;
  text-decoration: none;
}

.n-button:active * {
  color: #0078F9;
  transition: color .2s;
}
</style>