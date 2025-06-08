<template>
  <section>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <Clock class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
      </div>
      <button
        class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
      >
        View all
        <ChevronRight class="w-3 h-3" />
      </button>
    </div>
    <div class="space-y-3">
      <div class="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
        <div
          class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5"
        >
          <UserPlus class="w-3 h-3 text-white" />
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            Sarah Johnson joined Mathematics department
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
        </div>
      </div>
      <div class="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
        <div
          class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5"
        >
          <Check class="w-3 h-3 text-white" />
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            Grade 10 Mathematics exam completed
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">4 hours ago</div>
        </div>
      </div>
      <div class="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
        <div
          class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-0.5"
        >
          <Upload class="w-3 h-3 text-white" />
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            New learning materials uploaded
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">2 days ago</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Clock, ChevronRight, UserPlus, Check, Upload } from 'lucide-vue-next'
</script>
