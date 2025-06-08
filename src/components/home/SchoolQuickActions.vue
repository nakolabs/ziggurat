<template>
  <section>
    <div class="flex items-center gap-2 mb-6">
      <Zap class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickActionButton
        @click="$router.push('/exam')"
        icon-color="text-purple-600 dark:text-purple-400"
        bg-color="bg-purple-50 dark:bg-purple-950/50"
        hover-color="hover:bg-purple-100 dark:hover:bg-purple-950/70"
        :icon="FileText"
        title="Create Exam"
        description="New assessment"
      />
      <QuickActionButton
        @click="$router.push('/teacher')"
        icon-color="text-blue-600 dark:text-blue-400"
        bg-color="bg-blue-50 dark:bg-blue-950/50"
        hover-color="hover:bg-blue-100 dark:hover:bg-blue-950/70"
        :icon="UserPlus"
        title="Add Teacher"
        description="New staff member"
      />
      <QuickActionButton
        @click="$router.push('/class')"
        icon-color="text-green-600 dark:text-green-400"
        bg-color="bg-green-50 dark:bg-green-950/50"
        hover-color="hover:bg-green-100 dark:hover:bg-green-950/70"
        :icon="Calendar"
        title="Manage Classes"
        description="Schedule & rooms"
      />
      <QuickActionButton
        @click="$router.push('/reports')"
        icon-color="text-orange-600 dark:text-orange-400"
        bg-color="bg-orange-50 dark:bg-orange-950/50"
        hover-color="hover:bg-orange-100 dark:hover:bg-orange-950/70"
        :icon="BarChart3"
        title="View Reports"
        description="Analytics & insights"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { FileText, UserPlus, Calendar, BarChart3, Zap } from 'lucide-vue-next'
import QuickActionButton from './QuickActionButton.vue'
</script>
