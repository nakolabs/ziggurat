<template>
  <div class="space-y-6">
    <!-- Quick Actions -->
    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div class="space-y-2">
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg transition-colors">
          <UserPlus class="w-4 h-4 text-gray-400" />
          <span class="text-sm">Assign Teacher</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg transition-colors">
          <Users class="w-4 h-4 text-gray-400" />
          <span class="text-sm">Manage Classes</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg transition-colors">
          <FileText class="w-4 h-4 text-gray-400" />
          <span class="text-sm">Generate Report</span>
        </button>
      </div>
    </div>

    <!-- School Information -->
    <div v-if="school" class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">School</h3>
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
          <Building class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <p class="font-medium text-gray-900 dark:text-white">{{ school.name }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ school.level }} School</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building, UserPlus, Users, FileText } from 'lucide-vue-next'

defineProps<{
  subject: any
  teachers: any[]
  classes: any[]
  students: any[]
  school?: any
  schoolLoading?: boolean
  schoolError?: any
}>()
</script>
