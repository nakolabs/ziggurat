<template>
  <div class="flex items-start gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
    <div :class="iconContainerClasses">
      <component :is="iconComponent" :class="iconClasses" />
    </div>
    
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white mb-1 leading-relaxed">
        {{ title }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ time }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  UserPlus, 
  FileCheck, 
  Calendar, 
  Package,
  Building,
  ShieldCheck,
  Database,
  Shield,
  Server,
  FileText,
  GraduationCap,
  BookOpen
} from 'lucide-vue-next'

interface Props {
  title: string
  time: string
  type: string
  color: string
}

const props = defineProps<Props>()

const iconMap = {
  'user-plus': UserPlus,
  'file-check': FileCheck,
  calendar: Calendar,
  package: Package,
  building: Building,
  'shield-check': ShieldCheck,
  database: Database,
  shield: Shield,
  server: Server,
  'file-text': FileText,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen
}

const iconComponent = computed(() => iconMap[props.type as keyof typeof iconMap] || UserPlus)

const iconContainerClasses = computed(() => {
  const baseClasses = 'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm'
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    green: 'bg-green-100 dark:bg-green-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    orange: 'bg-orange-100 dark:bg-orange-900/30'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'bg-gray-100 dark:bg-neutral-800'
  return `${baseClasses} ${colorClass}`
})

const iconClasses = computed(() => {
  const baseClasses = 'w-5 h-5'
  const colorMap = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'text-gray-600 dark:text-gray-400'
  return `${baseClasses} ${colorClass}`
})
</script>
