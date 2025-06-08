<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <School class="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Assigned Classes</h2>
        </div>
        
        <!-- Add Class Button - only show when there are classes OR when form is not shown -->
        <button
          v-if="!showAddForm && availableClasses.length > 0 && classes.length > 0"
          @click="showAddForm = true"
          class="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Add Class
        </button>
      </div>

      <!-- Add Class Form -->
      <div v-if="showAddForm" class="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div class="flex items-center gap-3 mb-3">
          <Plus class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 class="font-medium text-gray-900 dark:text-white">Add New Class</h3>
        </div>
        
        <form @submit.prevent="handleAssignClass" class="space-y-4">
          <div>
            <select
              v-model="selectedClassId"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              required
            >
              <option value="" disabled>Choose a class</option>
              <option v-for="classItem in availableClasses" :key="classItem.id" :value="classItem.id">
                {{ classItem.name }}
              </option>
            </select>
          </div>

          <!-- Success/Error Messages -->
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

          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="assignmentState.assigningClass.value || !selectedClassId"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:dark:bg-neutral-700 text-white disabled:text-gray-500 disabled:dark:text-neutral-400 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <div v-if="assignmentState.assigningClass.value" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <Plus v-else class="w-4 h-4" />
              {{ assignmentState.assigningClass.value ? 'Adding...' : 'Add Class' }}
            </button>
            <button
              type="button"
              @click="cancelAdd"
              :disabled="assignmentState.assigningClass.value"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Classes List -->
      <div v-if="classes && classes.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="classItem in classes"
          :key="classItem.id"
          class="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg border border-gray-100 dark:border-neutral-700 group hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <School class="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white text-sm">{{ classItem.name }}</div>
            </div>
          </div>
          <button
            @click="$emit('unassign-class', classItem.id)"
            :disabled="assignmentState.unassigningClass === classItem.id"
            class="opacity-0 group-hover:opacity-100 w-6 h-6 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md flex items-center justify-center transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove class"
          >
            <div v-if="assignmentState.unassigningClass === classItem.id" class="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <X v-else class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- No Classes -->
      <div v-else-if="availableClasses.length > 0" class="text-center py-8">
        <div class="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
          <School class="w-6 h-6 text-gray-400" />
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">No classes assigned yet</p>
        <button
          @click="showAddForm = true"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto text-sm"
        >
          <Plus class="w-4 h-4" />
          Add First Class
        </button>
      </div>

      <!-- No Available Classes -->
      <div v-else class="text-center py-8">
        <div class="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
          <School class="w-6 h-6 text-gray-400" />
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">All classes have been assigned</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { School, X, Plus, AlertCircle, CheckCircle } from 'lucide-vue-next'

const props = defineProps<{
  classes: any[]
  availableClasses: any[]
  assignmentState: any
}>()

const emit = defineEmits<{
  'unassign-class': [id: string]
  'assign-class': []
}>()

const showAddForm = ref(false)
const selectedClassId = ref('')

const handleAssignClass = () => {
  if (selectedClassId.value) {
    props.assignmentState.selectedClassId.value = selectedClassId.value
    emit('assign-class')
  }
}

const cancelAdd = () => {
  showAddForm.value = false
  selectedClassId.value = ''
  props.assignmentState.assignClassError.value = ''
}
</script>
