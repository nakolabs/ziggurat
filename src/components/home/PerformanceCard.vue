<template>
  <div class="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-all duration-200">
    <div class="flex items-center gap-3">
      <div :class="iconContainerClasses">
        <component :is="iconComponent" :class="iconClasses" />
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ title }}</p>
          <span class="text-lg font-bold text-gray-900 dark:text-white">{{ value }}</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Server, Zap, Users, HardDrive } from 'lucide-vue-next'

interface Props {
  title: string
  value: string
  description: string
  color: string
  icon: string
}

const props = defineProps<Props>()

const iconMap = {
  server: Server,
  zap: Zap,
  users: Users,
  'hard-drive': HardDrive
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap] || Server)

const iconContainerClasses = computed(() => {
  const baseClasses = 'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0'
  const colorMap = {
    green: 'bg-green-100 dark:bg-green-900/30',
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    orange: 'bg-orange-100 dark:bg-orange-900/30'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'bg-gray-100 dark:bg-neutral-800'
  return `${baseClasses} ${colorClass}`
})

const iconClasses = computed(() => {
  const baseClasses = 'w-4 h-4'
  const colorMap = {
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'text-gray-600 dark:text-gray-400'
  return `${baseClasses} ${colorClass}`
})
</script>
