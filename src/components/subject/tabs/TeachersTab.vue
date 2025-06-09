<template>
  <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Teachers ({{ teachers.length }})</h3>
      <button class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
        <Plus class="w-4 h-4" />
        Assign Teacher
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="teachersLoading" class="flex items-center justify-center py-12">
      <div class="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>

    <!-- Teachers List -->
    <div v-else-if="teachers.length > 0" class="space-y-3">
      <div
        v-for="teacher in teachers"
        :key="teacher.id"
        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400 font-medium text-sm">
              {{ teacher.name?.charAt(0) || 'T' }}
            </span>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ teacher.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.email }}</p>
          </div>
        </div>
        <button class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UserX class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No teachers assigned</h4>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Start by assigning teachers to this subject</p>
      <button class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
        <Plus class="w-4 h-4" />
        Assign Teacher
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, UserX, Plus } from 'lucide-vue-next'

defineProps<{
  subject: any
  teachers: any[]
  classes: any[]
  students: any[]
  teachersLoading?: boolean
  classesLoading?: boolean
  studentsLoading?: boolean
}>()

defineEmits<{
  'update-subject': []
}>()
</script>
