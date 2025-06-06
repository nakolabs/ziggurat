<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">
          {{ mode === 'edit' ? 'Edit PPDB Program' : 'Create New PPDB Program' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            Program Name
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Enter PPDB program name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            Description
          </label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            class="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
            placeholder="Enter program description"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              Start Date
            </label>
            <input
              v-model="form.start_date"
              type="date"
              required
              class="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              End Date
            </label>
            <input
              v-model="form.end_date"
              type="date"
              required
              class="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            Maximum Registrants
          </label>
          <input
            v-model.number="form.max_registrants"
            type="number"
            required
            min="1"
            class="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Maximum number of registrants"
          />
        </div>

        <div
          class="flex justify-end space-x-3 pt-6 border-t border-neutral-200 dark:border-neutral-700"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <div
              v-if="loading"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ loading ? 'Saving...' : mode === 'edit' ? 'Update Program' : 'Create Program' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '@/stores/useAuth'

const props = defineProps<{
  mode: 'create' | 'edit'
  ppdb?: any
  loading: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const auth = useAuth()

const form = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  max_registrants: 100,
  school_id: auth.schoolId(),
})

// Initialize form with PPDB data if editing
watch(
  () => props.ppdb,
  (newPPDB) => {
    if (newPPDB && props.mode === 'edit') {
      form.value = {
        name: newPPDB.name || '',
        description: newPPDB.description || '',
        start_date: newPPDB.start_date
          ? new Date(newPPDB.start_date).toISOString().split('T')[0]
          : '',
        end_date: newPPDB.end_date ? new Date(newPPDB.end_date).toISOString().split('T')[0] : '',
        max_registrants: newPPDB.max_registrants || 100,
        school_id: auth.schoolId(),
      }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>
