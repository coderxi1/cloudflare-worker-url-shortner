<script setup lang="ts">
import GlobalProvider from '@/components/GlobalProvider.vue'
import SiteNav from './components/SiteNav.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <GlobalProvider>
    <SiteNav />
    <div class="main-container">
      <RouterView />
    </div>
  </GlobalProvider>
</template>

<style>
.main-container{
  padding-top: 100px;
  height: calc(100vh - 100px);
  max-height: 100vh;
  max-width: 100vw;
}
</style>