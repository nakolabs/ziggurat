<template>
  <div class="space-y-6">
    <!-- Quick Actions -->
    <div>
      <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 lg:grid-cols-1 gap-3">
        <button
          v-for="action in quickActions"
          :key="action.route"
          @click="$emit('navigate', action.route)"
          class="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-left"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="action.iconBg">
            <component :is="action.icon" class="w-4 h-4" :class="action.iconColor" />
          </div>
          <div>
            <p class="text-sm font-medium text-neutral-900 dark:text-white">{{ action.title }}</p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ action.description }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div>
      <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Performance</h3>
      <div class="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
        <div
          v-for="metric in performanceMetrics"
          :key="metric.label"
          class="flex items-center justify-between"
        >
          <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ metric.label }}</span>
          <span class="text-sm font-medium text-neutral-900 dark:text-white">{{ metric.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Users, GraduationCap, BookOpen, FileText } from 'lucide-vue-next'
import type { SchoolStatistics } from '@/types/school'

interface Props {
  stats: SchoolStatistics
  school?: any
}

const props = defineProps<Props>()

defineEmits<{
  navigate: [route: string]
}>()

const quickActions = [
  {
    route: '/teacher',
    title: 'Teachers',
    description: 'Manage staff',
    icon: Users,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    route: '/student',
    title: 'Students',
    description: 'Manage students',
    icon: GraduationCap,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30'
  },
  {
    route: '/class',
    title: 'Classes',
    description: 'Manage classes',
    icon: BookOpen,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30'
  },
  {
    route: '/subject',
    title: 'Subjects',
    description: 'Manage subjects',
    icon: FileText,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30'
  }
]

const performanceMetrics = computed(() => [
  {
    label: 'Teacher Ratio',
    value: `1:${props.stats.teacher_ratio ?? 'N/A'}`
  },
  {
    label: 'Avg. Class Size',
    value: props.stats.avg_class_size ?? 'N/A'
  },
  {
    label: 'Academic Year',
    value: '2024/2025'
  },
  {
    label: 'Created At',
    value: formatDate(props.school?.created_at)
  },
  {
    label: 'Last Updated',
    value: props.school?.updated_at && props.school.updated_at !== 0 
      ? formatDate(props.school.updated_at) 
      : '-'
  }
])

const formatDate = (timestamp: number | string) => {
  if (!timestamp || timestamp === 0) return '-'
  
  const date = typeof timestamp === 'string' ? new Date(parseInt(timestamp)) : new Date(timestamp)
  
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
