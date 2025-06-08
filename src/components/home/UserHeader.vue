<template>
  <header class="border-b border-gray-100 dark:border-neutral-800 px-6 py-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between">
        <!-- User Info -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white font-medium text-lg">
              {{ userInitial }}
            </span>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ userName }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              {{ currentDate }}
            </p>
          </div>
        </div>

        <!-- Status -->
        <div v-if="isLoading" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span>Loading school...</span>
        </div>
        <div
          v-else-if="schoolData"
          class="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full"
        >
          <Building class="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <div class="text-sm">
            <div class="font-medium text-orange-700 dark:text-orange-400">
              {{ schoolData.name.toUpperCase() }}
            </div>
          </div>
        </div>
        <div
          v-else-if="isAdmin"
          class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>System Online</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Building } from 'lucide-vue-next'

interface Props {
  userInfo?: any
  schoolData?: any
  isLoading: boolean
  isAdmin: boolean
  currentDate: string
}

const props = defineProps<Props>()

const userInitial = computed(() => props.userInfo?.email?.charAt(0).toUpperCase() || 'U')
const userName = computed(() => props.userInfo?.email?.split('@')[0] || 'User')
</script>
