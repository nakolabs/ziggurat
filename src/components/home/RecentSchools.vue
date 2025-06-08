<template>
  <section>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <Building class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Schools</h2>
      </div>
      <button
        class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
      >
        View all
        <ChevronRight class="w-3 h-3" />
      </button>
    </div>
    <div
      class="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800"
    >
      <div
        v-for="(school, index) in schools.slice(0, 4)"
        :key="school.id"
        class="p-4 border-b border-gray-100 dark:border-neutral-800 last:border-b-0"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
            >
              <Building class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">{{ school.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <MapPin class="w-3 h-3" />
                {{ school.location }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ school.studentCount.toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">students</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Building, ChevronRight, MapPin } from 'lucide-vue-next'

interface School {
  id: number
  name: string
  location: string
  studentCount: number
  teacherCount: number
}

interface Props {
  schools: School[]
}

defineProps<Props>()
</script>
