<template>
  <div class="group bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-300 cursor-pointer">
    <div class="flex items-start gap-4">
      <div class="w-14 h-14 bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
        <span class="text-white font-bold text-lg">{{ school.name.charAt(0) }}</span>
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ school.name }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {{ school.location }}
        </p>
        
        <div class="flex items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full" />
            <span class="text-gray-700 dark:text-gray-300 font-medium">
              {{ school.studentCount.toLocaleString() }} students
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-emerald-500 rounded-full" />
            <span class="text-gray-700 dark:text-gray-300 font-medium">
              {{ school.teacherCount }} teachers
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface School {
  id: number
  name: string
  location: string
  studentCount: number
  teacherCount: number
}

interface Props {
  school: School
}

defineProps<Props>()
</script>
