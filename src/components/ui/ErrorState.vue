<template>
  <div class="flex items-center justify-center py-20">
    <div class="text-center">
      <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle class="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load teacher</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Unable to fetch teacher details. Please try again.</p>
      <button
        @click="$emit('retry')"
        class="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AlertTriangle } from 'lucide-vue-next'

defineEmits<{
  retry: []
}>()
</script>
