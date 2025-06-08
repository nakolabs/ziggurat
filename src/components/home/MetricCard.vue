<template>
  <div class="group relative bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-300 cursor-pointer">
    <!-- Background Pattern -->
    <div 
      class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
      :class="backgroundClasses"
    />
    
    <!-- Content -->
    <div class="relative">
      <div class="flex items-start justify-between mb-4">
        <div :class="iconContainerClasses">
          <component :is="iconComponent" :class="iconClasses" />
        </div>
        
        <span v-if="trend" :class="trendClasses">
          {{ trend }}
        </span>
      </div>
      
      <div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {{ value }}
        </div>
        <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
          {{ label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Building, 
  Users, 
  GraduationCap, 
  Activity, 
  BookOpen, 
  CheckCircle 
} from 'lucide-vue-next'

interface Props {
  value: string | number
  label: string
  trend?: string
  isNegative?: boolean
  icon: string
  color: string
}

const props = withDefaults(defineProps<Props>(), {
  isNegative: false
})

const iconMap = {
  building: Building,
  users: Users,
  'graduation-cap': GraduationCap,
  activity: Activity,
  'book-open': BookOpen,
  'check-circle': CheckCircle
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap] || Building)

const backgroundClasses = computed(() => {
  const colorMap = {
    blue: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
    emerald: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20',
    purple: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
    orange: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'
  }
  return colorMap[props.color as keyof typeof colorMap] || 'bg-gray-50 dark:bg-neutral-800/20'
})

const iconContainerClasses = computed(() => {
  const baseClasses = 'w-12 h-12 rounded-xl flex items-center justify-center shadow-sm'
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    orange: 'bg-orange-100 dark:bg-orange-900/30'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'bg-gray-100 dark:bg-neutral-800'
  return `${baseClasses} ${colorClass}`
})

const iconClasses = computed(() => {
  const baseClasses = 'w-6 h-6'
  const colorMap = {
    blue: 'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'text-gray-600 dark:text-gray-400'
  return `${baseClasses} ${colorClass}`
})

const trendClasses = computed(() => {
  const baseClasses = 'text-xs font-semibold px-2.5 py-1 rounded-full'
  const trendClass = props.isNegative 
    ? 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
    : 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
  return `${baseClasses} ${trendClass}`
})
</script>
