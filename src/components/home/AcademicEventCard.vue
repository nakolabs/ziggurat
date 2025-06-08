<template>
  <div class="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-all duration-200">
    <div class="flex items-start gap-3">
      <div :class="typeIconClasses">
        <component :is="typeIcon" class="w-3 h-3" />
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{{ title }}</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{{ description }}</p>
        <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">In {{ date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileText, Users, Calendar } from 'lucide-vue-next'

interface Props {
  title: string
  description: string
  date: string
  type: 'exam' | 'meeting' | 'event'
}

const props = defineProps<Props>()

const typeIcon = computed(() => {
  const iconMap = {
    exam: FileText,
    meeting: Users,
    event: Calendar
  }
  return iconMap[props.type]
})

const typeIconClasses = computed(() => {
  const baseClasses = 'w-6 h-6 rounded-md flex items-center justify-center mt-1 flex-shrink-0'
  const typeMap = {
    exam: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    meeting: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    event: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  }
  return `${baseClasses} ${typeMap[props.type]}`
})
</script>
