<template>
  <div class="bg-white dark:bg-neutral-900 rounded-lg p-3 border border-gray-100 dark:border-neutral-800">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div :class="iconClasses">
          <component :is="iconComponent" class="w-3 h-3" />
        </div>
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ label }}</span>
      </div>
      <span class="text-sm font-bold text-gray-900 dark:text-white">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileText, Award, Clock, UserPlus } from 'lucide-vue-next'

interface Props {
  label: string
  value: string
  icon: string
  color: string
}

const props = defineProps<Props>()

const iconMap = {
  'file-text': FileText,
  award: Award,
  clock: Clock,
  'user-plus': UserPlus
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap] || FileText)

const iconClasses = computed(() => {
  const baseClasses = 'w-6 h-6 rounded-md flex items-center justify-center'
  const colorMap = {
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600'
  return `${baseClasses} ${colorClass}`
})
</script>
