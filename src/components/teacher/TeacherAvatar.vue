<template>
  <div class="relative">
    <div class="w-32 h-32 rounded-3xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-lg overflow-hidden">
      <img 
        v-if="teacher.avatar" 
        :src="teacher.avatar" 
        :alt="teacher.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <span class="text-3xl font-bold text-white">
          {{ teacher.name?.charAt(0)?.toUpperCase() || 'T' }}
        </span>
      </div>
    </div>
    
    <!-- Status Indicator -->
    <div 
      class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-neutral-900 flex items-center justify-center"
      :class="teacher.is_verified ? 'bg-green-500' : 'bg-yellow-500'"
    >
      <svg v-if="teacher.is_verified" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Teacher } from '@/types/teacher'

defineProps<{
  teacher: Teacher
}>()
</script>
