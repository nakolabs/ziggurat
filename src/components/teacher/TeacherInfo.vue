<template>
  <div class="flex-1 space-y-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ teacher.name || 'Unnamed Teacher' }}
      </h1>
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <span class="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Mail class="w-4 h-4" />
          {{ teacher.email }}
        </span>
        <span v-if="teacher.phone" class="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Phone class="w-4 h-4" />
          {{ teacher.phone }}
        </span>
        <StatusBadge :is-verified="teacher.is_verified" />
      </div>
    </div>
    
    <!-- Bio -->
    <div v-if="teacher.bio" class="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4">
      <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{{ teacher.bio }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Mail, Phone } from 'lucide-vue-next'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import type { Teacher } from '@/types/teacher'

defineProps<{
  teacher: Teacher
}>()
</script>
