<template>
  <button 
    @click="$emit('click')" 
    class="w-full text-left p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:shadow-md transition-all duration-200 group"
  >
    <div class="flex items-start gap-3">
      <div :class="iconContainerClasses">
        <component :is="iconComponent" :class="iconClasses" />
      </div>
      
      <div class="flex-1">
        <p class="font-semibold text-gray-900 dark:text-white text-sm mb-1">
          {{ title }}
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  UserPlus, 
  FilePlus, 
  BookPlus, 
  Calendar 
} from 'lucide-vue-next'

interface Props {
  title: string
  description: string
  icon: string
  color: string
}

interface Emits {
  (e: 'click'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const iconMap = {
  'user-plus': UserPlus,
  'file-plus': FilePlus,
  'book-plus': BookPlus,
  calendar: Calendar
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap] || UserPlus)

const iconContainerClasses = computed(() => {
  const baseClasses = 'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200'
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
    orange: 'bg-orange-100 dark:bg-orange-900/30'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'bg-gray-100 dark:bg-neutral-800'
  return `${baseClasses} ${colorClass}`
})

const iconClasses = computed(() => {
  const baseClasses = 'w-5 h-5'
  const colorMap = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    orange: 'text-orange-600 dark:text-orange-400'
  }
  const colorClass = colorMap[props.color as keyof typeof colorMap] || 'text-gray-600 dark:text-gray-400'
  return `${baseClasses} ${colorClass}`
})
</script>
