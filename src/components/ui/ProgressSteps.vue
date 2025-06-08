<template>
  <div class="flex items-center justify-between max-w-md mx-auto mb-8">
    <!-- Step 1 -->
    <div class="flex items-center">
      <div :class="[
        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300',
        currentStep >= 1 
          ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
      ]">
        <Check v-if="currentStep > 1" class="w-4 h-4" />
        <span v-else>1</span>
      </div>
      <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Details</span>
    </div>
    
    <!-- Progress Line -->
    <div :class="[
      'flex-1 h-1 mx-4 rounded-full transition-all duration-500',
      currentStep > 1 ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-700'
    ]"></div>
    
    <!-- Step 2 -->
    <div class="flex items-center">
      <div :class="[
        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300',
        currentStep >= 2 
          ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
      ]">
        2
      </div>
      <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Review</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

interface Props {
  currentStep: number
}

defineProps<Props>()
</script>
