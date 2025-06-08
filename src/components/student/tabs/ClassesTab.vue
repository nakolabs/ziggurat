<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <School class="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Enrolled Classes</h2>
        </div>
      </div>

      <!-- Classes List -->
      <div v-if="classes && classes.length > 0" class="space-y-4">
        <div
          v-for="classItem in classes"
          :key="classItem.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <BookOpen class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">{{ classItem.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ classItem.description || 'No description' }}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <School class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Classes Enrolled</h3>
        <p class="text-gray-600 dark:text-gray-400">This student is not enrolled in any classes yet.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { School, BookOpen } from 'lucide-vue-next'

defineProps<{
  student: any
  classes?: any[]
}>()
</script>
