<script setup lang="ts">
import { useRoute } from 'vue-router'
const { path } = useRoute()
</script>

<template>
  <div class="center">
    <n-card :title="$t('notfound.title')">
      <p v-html="$t('notfound.tips',{path})"></p>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.n-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>