<template>
  <div class="flex flex-col items-center justify-center py-24">
    <div class="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center mb-4">
      <Building class="w-6 h-6 text-neutral-400" />
    </div>
    <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-2">School not found</h3>
    <p class="text-neutral-500 dark:text-neutral-400 text-center text-sm mb-4">The school you're looking for doesn't exist or has been removed.</p>
    <button
      @click="$emit('back')"
      class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
    >
      Back to Schools
    </button>
  </div>
</template>

<script setup lang="ts">
import { Building } from 'lucide-vue-next'

defineEmits<{
  back: []
}>()
</script>
