<template>
  <div class="flex items-center justify-center py-20">
    <div class="text-center">
      <div class="w-8 h-8 border-3 border-gray-300 border-t-gray-900 dark:border-neutral-600 dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  message: string
}>()
</script>
