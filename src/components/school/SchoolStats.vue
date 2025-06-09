<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div
      v-for="stat in stats"
      :key="stat.key"
      class="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="stat.iconBg">
          <component :is="stat.icon" class="w-4 h-4" :class="stat.iconColor" />
        </div>
        <div>
          <p class="text-xl font-semibold text-neutral-900 dark:text-white">{{ stat.value }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SchoolStatistics } from '@/types/school'
import { Users, GraduationCap, BookOpen, FileText } from 'lucide-vue-next'

interface Props {
  data: SchoolStatistics
}

const props = defineProps<Props>()

const stats = [
  {
    key: 'teachers',
    label: 'Teachers',
    value: props.data.teacher_count,
    icon: Users,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    key: 'students',
    label: 'Students',
    value: props.data.student_count,
    icon: GraduationCap,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    key: 'classes',
    label: 'Classes',
    value: props.data.class_count,
    icon: BookOpen,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    key: 'subjects',
    label: 'Subjects',
    value: props.data.subject_count,
    icon: FileText,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
  },
]
</script>
