<script setup lang="ts">
const { prefix, name } = defineProps({
  name: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: 'icon'
  },
  color: {
    type: String,
    default: '#333'
  }
})
const symbolId = computed(() => `#${prefix}-${name}`)
</script>

<template>
  <svg aria-hidden="true">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>