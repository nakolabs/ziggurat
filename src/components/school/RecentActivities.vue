<template>
  <div>
    <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Recent Activities</h3>
    <div class="space-y-3">
      <div 
        v-for="activity in activities" 
        :key="activity.id" 
        class="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="activity.iconBg">
          <component :is="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-neutral-900 dark:text-white">{{ activity.title }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ activity.description }} • {{ activity.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Activity {
  id: number
  title: string
  description: string
  time: string
  icon: any
  iconColor: string
  iconBg: string
}

interface Props {
  activities: Activity[]
}

defineProps<Props>()
</script>
