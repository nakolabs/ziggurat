<template>
  <div class="mb-8">
    <!-- School Information Header -->
    <div class="flex items-start gap-6">
      <!-- Logo Section -->
      <div class="relative group/logo flex-shrink-0">
        <div class="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-white dark:border-neutral-700 shadow-lg">
          <img 
            v-if="schoolData?.logo" 
            :src="schoolData.logo" 
            :alt="schoolData?.name + ' logo'" 
            class="w-full h-full object-cover" 
          />
          <div 
            v-else 
            class="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 flex items-center justify-center"
          >
            <span class="text-orange-600 dark:text-orange-400 font-bold text-2xl">
              {{ schoolData?.name?.charAt(0) || 'S' }}
            </span>
          </div>
        </div>
        
        <!-- Logo Edit Button -->
        <button
          @click="$emit('editLogo')"
          class="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md opacity-0 group-hover/logo:opacity-100"
          title="Edit Logo"
        >
         <Camera class="w-4 h-4" />
        </button>
      </div>
      
      <!-- School Details -->
      <div class="flex-1 min-w-0">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
          {{ schoolData?.name || 'School Name' }}
        </h1>
        <div class="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <span class="inline-flex items-center px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-medium border border-orange-200 dark:border-orange-800">
            {{ formatLevel(schoolData?.level) }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Created {{ formatDate(new Date(schoolData?.created_at), 'YYYY-MM-DD') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { Camera } from 'lucide-vue-next';

interface Props {
  schoolData?: any
  formatLevel: (level: string) => string
}

defineProps<Props>()

defineEmits<{
  editLogo: []
}>()
</script>
