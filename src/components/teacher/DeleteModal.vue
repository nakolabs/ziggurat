<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
        @click="$emit('cancel')"
      ></div>

      <!-- Modal -->
      <div class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-neutral-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div class="sm:flex sm:items-start">
          <!-- Warning Icon -->
          <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>

          <!-- Content -->
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Delete Teacher
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete <span class="font-medium text-gray-900 dark:text-white">{{ teacherName }}</span>? 
                This action cannot be undone and will remove all associated assignments.
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            @click="$emit('confirm')"
            :disabled="deleting"
            class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
          >
            <div v-if="deleting" class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <Trash2 v-else class="w-4 h-4 mr-2" />
            {{ deleting ? 'Deleting...' : 'Delete Teacher' }}
          </button>
          <button
            @click="$emit('cancel')"
            :disabled="deleting"
            class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AlertTriangle, Trash2 } from 'lucide-vue-next'

defineProps<{
  teacherName?: string
  deleting: boolean
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>
