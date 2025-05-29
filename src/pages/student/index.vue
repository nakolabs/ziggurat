<template>
  <Dashboard>
    <main class="p-6 overflow-auto">
      <!-- Add Student Button -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Students</h1>
        <button
          @click="showAddModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Student
        </button>
      </div>

      <div class="overflow-x-auto">
        <div v-if="isFetching">Loading....</div>
        <table v-else class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead class="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th class="px-4 py-2 border-b">Name</th>
              <th class="px-4 py-2 border-b">Email</th>
              <th class="px-4 py-2 border-b">Verified</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="user in data?.data" :key="user.id">
              <td class="px-4 py-2 border-b">{{ user.name }}</td>
              <td class="px-4 py-2 border-b">{{ user.email }}</td>
              <td class="px-4 py-2 border-b">{{ user.is_verified }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Student Modal -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg w-96 max-w-90vw">
          <h2 class="text-xl font-bold mb-4">Add New Student</h2>
          <form @submit.prevent="addStudent">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="newStudent.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isAdding"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ isAdding ? 'Adding...' : 'Add Student' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
import { useAuth } from '@/stores/useAuth.ts'
import { ref } from 'vue'

const auth = useAuth()

const { data, isFetching, execute } = useApi(
  '/api/v1/student?school_id=' + auth.get()?.payload.user.school_id,
).json()

// Add student functionality
const showAddModal = ref(false)
const isAdding = ref(false)
const newStudent = ref({
  email: '',
})

const addStudent = async () => {
  isAdding.value = true
  try {
    await useApi('/api/v1/student/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emails: [newStudent.value.email],
        school_id: auth.get()?.payload.user.school_id,
      }),
    }).json()

    // Refresh the student list
    await execute()
    closeModal()
  } catch (error) {
    console.error('Error adding student:', error)
  } finally {
    isAdding.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  newStudent.value = {
    name: '',
    email: '',
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
