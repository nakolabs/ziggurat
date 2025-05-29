<template>
  <Dashboard>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Subject Management</h1>
        <button
          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          @click="showCreateModal = true"
        >
          Add Subject
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 flex gap-4">
        <SearchInput v-model="searchQuery" placeholder="Search subjects..." class="flex-1" />
      </div>

      <!-- Subjects Table -->
      <div class="bg-white dark:bg-neutral-900 rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="text-gray-500">Loading subjects...</div>
        </div>
        <div v-else-if="error" class="p-8 text-center text-red-500">Error loading subjects</div>
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
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
              <tr v-for="subject in subjects" :key="subject.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium">{{ subject.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(subject.created_at).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    class="text-orange-600 hover:text-orange-900 mr-3"
                    @click="editSubject(subject)"
                  >
                    Edit
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900"
                    @click="deleteSubject(subject.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Subject Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Add New Subject</h2>
        <form @submit.prevent="createSubject">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Subject Name</label>
            <input
              v-model="newSubject.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700"
              placeholder="Enter subject name"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
            >
              {{ creating ? 'Creating...' : 'Create' }}
            </button>
          </div>
        </form>
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

const schoolID = useAuth().get()?.payload.user.school_id || ''
const searchQuery = ref('')
const showCreateModal = ref(false)

// Fetch subjects
const {
  data,
  isFetching: loading,
  error,
  execute: refetch,
} = useApi('/api/v1/subject?school_id=' + schoolID).json()
const subjects = computed(() => data.value?.data || [])

const newSubject = ref({
  name: '',
  school_id: schoolID,
})
const creating = ref(false)

function editSubject(subject: any) {
  // TODO: Implement edit functionality
  console.log('Edit subject:', subject)
}

async function deleteSubject(subjectId: string) {
  if (confirm('Are you sure you want to delete this subject?')) {
    // TODO: Implement delete functionality
    console.log('Delete subject:', subjectId)
  }
}

function closeCreateModal() {
  showCreateModal.value = false
  newSubject.value.name = ''
}

async function createSubject() {
  if (!newSubject.value.name.trim()) return

  creating.value = true
  try {
    const { data } = await useApi('/api/v1/subject', {
      method: 'POST',
      body: JSON.stringify(newSubject.value),
    }).json()
    // await post(newSubject.value).json()

    if (data.value.code !== 200) {
      console.error('Error creating subject:', data.value.message)
      alert('Failed to create subject: ' + data.value.message)
      return
    }

    // Refresh the subjects list
    await refetch()

    // Close modal and reset form
    closeCreateModal()
  } catch (error) {
    console.error('Failed to create subject:', error)
    alert('Failed to create subject. Please try again.')
  } finally {
    creating.value = false
  }
}
</script>
