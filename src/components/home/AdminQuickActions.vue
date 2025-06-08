<template>
  <section>
    <div class="flex items-center gap-2 mb-6">
      <Zap class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickActionButton
        @click="$router.push('/school')"
        icon-color="text-blue-600 dark:text-blue-400"
        bg-color="bg-blue-50 dark:bg-blue-950/50"
        hover-color="hover:bg-blue-100 dark:hover:bg-blue-950/70"
        :icon="Plus"
        title="Add School"
        description="Register new institution"
      />
      <QuickActionButton
        @click="$router.push('/reports')"
        icon-color="text-green-600 dark:text-green-400"
        bg-color="bg-green-50 dark:bg-green-950/50"
        hover-color="hover:bg-green-100 dark:hover:bg-green-950/70"
        :icon="BarChart3"
        title="View Reports"
        description="Platform analytics"
      />
      <QuickActionButton
        @click="$router.push('/settings')"
        icon-color="text-gray-600 dark:text-gray-400"
        bg-color="bg-gray-50 dark:bg-neutral-800"
        hover-color="hover:bg-gray-100 dark:hover:bg-neutral-700"
        :icon="Settings"
        title="Settings"
        description="Global configuration"
      />
      <QuickActionButton
        @click="$router.push('/users')"
        icon-color="text-purple-600 dark:text-purple-400"
        bg-color="bg-purple-50 dark:bg-purple-950/50"
        hover-color="hover:bg-purple-100 dark:hover:bg-purple-950/70"
        :icon="UserPlus"
        title="Manage Users"
        description="User administration"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Plus, BarChart3, Settings, UserPlus, Zap } from 'lucide-vue-next'
import QuickActionButton from './QuickActionButton.vue'
</script>
