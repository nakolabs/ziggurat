<template>
  <div class="space-y-6">
    <!-- Quick Stats -->
    <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overview</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
              <Book class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span class="font-medium text-gray-900 dark:text-white">Subjects</span>
          </div>
          <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ subjects?.length || 0 }}</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
              <School class="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span class="font-medium text-gray-900 dark:text-white">Classes</span>
          </div>
          <span class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ classes?.length || 0 }}</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
              <Users class="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span class="font-medium text-gray-900 dark:text-white">Students</span>
          </div>
          <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ totalStudents }}</span>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Phone class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
      </div>

      <div class="space-y-3">
        <div v-if="teacher?.email" class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
          <Mail class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ teacher.email }}</span>
        </div>
        <div v-if="teacher?.phone" class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
          <Phone class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ teacher.phone }}</span>
        </div>
        <div v-if="!teacher?.email && !teacher?.phone" class="text-center py-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">No contact information</p>
        </div>
      </div>
    </div>

    <!-- School Information -->
    <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
          <Building2 class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">School</h3>
      </div>

      <!-- School Loading -->
      <div v-if="schoolLoading" class="flex items-center justify-center py-6">
        <div class="text-center">
          <div class="w-5 h-5 border-2 border-gray-300 border-t-gray-900 dark:border-neutral-600 dark:border-t-white rounded-full animate-spin mx-auto mb-2"></div>
          <p class="text-xs text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>

      <!-- School Error -->
      <div v-else-if="schoolError" class="text-center py-6">
        <div class="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
          <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400">Failed to load</p>
      </div>

      <!-- School Info -->
      <div v-else-if="school" class="space-y-3">
        <div class="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
          <div class="font-medium text-gray-900 dark:text-white text-sm">{{ school.name }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ school.address || 'No address' }}</div>
        </div>
      </div>

      <!-- No School -->
      <div v-else class="text-center py-6">
        <div class="w-8 h-8 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-2">
          <Building2 class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">No school assigned</p>
      </div>
    </div>

    <!-- Recent Activity atau Quick Actions yang simpel -->
    <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div class="space-y-2">
        <button class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-3">
          <Mail class="w-4 h-4 text-gray-400" />
          <span>Send Message</span>
        </button>
        <button class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-3">
          <FileText class="w-4 h-4 text-gray-400" />
          <span>Generate Report</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { 
  Book, 
  School, 
  Building2, 
  AlertCircle, 
  Mail, 
  Phone, 
  Users, 
  FileText
} from 'lucide-vue-next'

const props = defineProps<{
  subjects: any[]
  classes: any[]
  school: any
  schoolLoading: boolean
  schoolError: any
  teacher?: any
}>()

// Computed properties for additional stats
const totalStudents = computed(() => {
  return props.classes?.reduce((total, classItem) => {
    return total + (classItem.student_count || 0)
  }, 0) || 0
})
</script>
