<!-- filepath: /home/nako/dev/genesis/enki/src/pages/class/index.vue -->
<template>
  <Dashboard>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Class Management</h1>
        <button
          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          @click="showCreateModal = true"
        >
          Add Class
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 flex gap-4">
        <SearchInput v-model="searchQuery" placeholder="Search classes..." class="flex-1" />
      </div>

      <!-- Classes Table -->
      <div class="bg-white dark:bg-neutral-900 rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="text-gray-500">Loading classes...</div>
        </div>
        <div v-else-if="error" class="p-8 text-center text-red-500">Error loading classes</div>
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Students
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Created At
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="classItem in classes" :key="classItem.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium">{{ classItem.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ classItem.student_count || 0 }} students
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(classItem.created_at).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    class="text-orange-600 hover:text-orange-900 mr-3"
                    @click="editClass(classItem)"
                  >
                    Edit
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900"
                    @click="deleteClass(classItem.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Class Modal -->
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Create New Class</h2>
          <form @submit.prevent="createClass">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Class Name</label>
              <input
                v-model="newClass.name"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter class name"
              />
            </div>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {{ creating ? 'Creating...' : 'Create Class' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
import SearchInput from '@/components/SearchInput.vue'
import { useAuth } from '@/stores/useAuth'

const searchQuery = ref('')
const showCreateModal = ref(false)
const creating = ref(false)
const newClass = ref({
  name: '',
  school_id: useAuth().get()?.payload.user.school_id || '',
})
const auth = useAuth()

// Fetch classes
const {
  data,
  isFetching: loading,
  error,
  execute: refetch,
} = useApi('/api/v1/class?school_id=' + auth.get()?.payload.user.school_id).json()
const classes = computed(() => data.value?.data || [])

async function createClass() {
  creating.value = true
  try {
    const { data } = await useApi('/api/v1/class', {
      method: 'POST',
      body: JSON.stringify(newClass.value),
    }).json()

    if (data.value.code !== 200) {
      console.error('Error creating class:', data.value.message)
      return
    }
    showCreateModal.value = false
    newClass.value.name = ''
    refetch() // Refresh the classes list
  } catch (error) {
    console.error('Error creating class:', error)
  } finally {
    creating.value = false
  }
}

function editClass(classItem: any) {
  // TODO: Implement edit functionality
  console.log('Edit class:', classItem)
}

async function deleteClass(classId: string) {
  if (confirm('Are you sure you want to delete this class?')) {
    // TODO: Implement delete functionality
    console.log('Delete class:', classId)
  }
}
</script>
