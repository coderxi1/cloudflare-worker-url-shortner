<script setup lang="ts">
import GlobalProvider from '@/components/GlobalProvider.vue'
import SiteNav from './components/SiteNav.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <GlobalProvider>
    <SiteNav />
    <RouterView />
  </GlobalProvider>
</template>