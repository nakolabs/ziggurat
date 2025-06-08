<template>
  <div class="space-y-6">
    <!-- Academic Performance -->
    <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
          <Trophy class="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Academic Performance</h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ student.gpa || '0.0' }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">GPA</div>
        </div>
        <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ student.attendance_rate || '0' }}%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Attendance</div>
        </div>
        <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ student.completed_exams || '0' }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Exams</div>
        </div>
        <div class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ student.assignments || '0' }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Assignments</div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Activity class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
      </div>

      <div class="space-y-3">
        <div class="text-center py-8">
          <Activity class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recent Activities</h3>
          <p class="text-gray-600 dark:text-gray-400">Student activities will appear here once they start participating.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Trophy, Activity } from 'lucide-vue-next'

defineProps<{
  student: any
}>()
</script>
