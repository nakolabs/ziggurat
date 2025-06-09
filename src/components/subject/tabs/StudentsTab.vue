<template>
  <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Students ({{ students.length }})</h3>
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search students..."
          class="pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="studentsLoading" class="flex items-center justify-center py-12">
      <div class="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>

    <!-- Students List -->
    <div v-else-if="filteredStudents.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="student in filteredStudents"
        :key="student.id"
        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400 font-medium text-sm">
              {{ student.name?.charAt(0) || 'S' }}
            </span>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ student.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ student.class_name || 'No class' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <GraduationCap class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ searchQuery ? 'No students found' : 'No students enrolled' }}
      </h4>
      <p class="text-gray-500 dark:text-gray-400">
        {{ searchQuery 
          ? 'Try adjusting your search terms' 
          : 'Students will appear when enrolled in classes' 
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, GraduationCap } from 'lucide-vue-next'

const props = defineProps<{
  subject: any
  teachers: any[]
  classes: any[]
  students: any[]
  teachersLoading?: boolean
  classesLoading?: boolean
  studentsLoading?: boolean
}>()

defineEmits<{
  'update-subject': []
}>()

const searchQuery = ref('')

const filteredStudents = computed(() => {
  if (!searchQuery.value) return props.students
  
  return props.students.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
