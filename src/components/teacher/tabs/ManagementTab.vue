<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Assign Subject Section -->
      <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Plus class="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Assign Subject</h2>
        </div>

        <form @submit.prevent="$emit('assign-subject')" class="space-y-4">
          <div>
            <label for="subject-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Subject
            </label>
            <select
              id="subject-select"
              v-model="assignmentState.selectedSubjectId.value"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              required
            >
              <option value="" disabled>Choose a subject</option>
              <option v-for="subject in availableSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>

          <!-- Subject Success/Error Messages -->
          <div v-if="assignmentState.assignSubjectError.value" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex items-center gap-2">
              <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400" />
              <span class="text-sm text-red-600 dark:text-red-400">{{ assignmentState.assignSubjectError.value }}</span>
            </div>
          </div>

          <div v-if="assignmentState.assignSubjectSuccess.value" class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-sm text-green-600 dark:text-green-400">Subject assigned successfully!</span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="assignmentState.assigningSubject.value || !assignmentState.selectedSubjectId.value"
            class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-neutral-700 text-white disabled:text-gray-500 disabled:dark:text-neutral-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <div v-if="assignmentState.assigningSubject.value" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <Plus v-else class="w-4 h-4" />
            {{ assignmentState.assigningSubject.value ? 'Assigning...' : 'Assign Subject' }}
          </button>
        </form>
      </div>

      <!-- Assign Class Section -->
      <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Plus class="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Assign Class</h2>
        </div>

        <form @submit.prevent="$emit('assign-class')" class="space-y-4">
          <div>
            <label for="class-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Class
            </label>
            <select
              id="class-select"
              v-model="assignmentState.selectedClassId.value"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              required
            >
              <option value="" disabled>Choose a class</option>
              <option v-for="classItem in availableClasses" :key="classItem.id" :value="classItem.id">
                {{ classItem.name }}
              </option>
            </select>
          </div>

          <!-- Class Success/Error Messages -->
          <div v-if="assignmentState.assignClassError.value" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex items-center gap-2">
              <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400" />
              <span class="text-sm text-red-600 dark:text-red-400">{{ assignmentState.assignClassError.value }}</span>
            </div>
          </div>

          <div v-if="assignmentState.assignClassSuccess.value" class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-sm text-green-600 dark:text-green-400">Class assigned successfully!</span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="assignmentState.assigningClass.value || !assignmentState.selectedClassId.value"
            class="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:dark:bg-neutral-700 text-white disabled:text-gray-500 disabled:dark:text-neutral-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <div v-if="assignmentState.assigningClass.value" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <Plus v-else class="w-4 h-4" />
            {{ assignmentState.assigningClass.value ? 'Assigning...' : 'Assign Class' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Plus, AlertCircle, CheckCircle } from 'lucide-vue-next'

defineProps<{
  availableSubjects: any[]
  availableClasses: any[]
  assignmentState: any
}>()

defineEmits<{
  'assign-subject': []
  'assign-class': []
}>()
</script>
