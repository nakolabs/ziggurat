<template>
  <div class="fixed bottom-6 right-6 z-50 lg:absolute lg:top-0 lg:right-0 lg:bottom-auto">
    <button
      @click="$emit('toggle')"
      :class="[
        'w-14 h-14 lg:w-auto lg:h-auto lg:px-4 lg:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full lg:rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2',
        isEditMode ? 'bg-neutral-500 hover:bg-neutral-600' : ''
      ]"
      :title="isEditMode ? 'Cancel Edit' : 'Edit School Information'"
    >
      <!-- Mobile: Icon only -->
      <svg class="w-6 h-6 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          v-if="!isEditMode"
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
        />
        <path 
          v-else
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M6 18L18 6M6 6l12 12" 
        />
      </svg>
      <!-- Desktop: Icon + Text -->
      <span class="hidden lg:inline">
        {{ isEditMode ? 'Cancel' : 'Edit School' }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isEditMode: boolean
}

defineProps<Props>()

defineEmits<{
  toggle: []
}>()
</script>
