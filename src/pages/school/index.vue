<template>
  <Dashboard>
    <main class="p-6 overflow-auto">
      <!-- Create School Button -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Schools</h1>
        <button
          @click="showModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create School
        </button>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Create New School</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form @submit.prevent="createSchool">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input
                v-model="formData.level"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex gap-3 justify-end">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isCreating"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ isCreating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div v-if="isFetching">Loading....</div>
        <table v-else class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead class="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th class="px-4 py-2 border-b">Name</th>
              <th class="px-4 py-2 border-b">Level</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="user in data?.data" :key="user.id">
              <td class="px-4 py-2 border-b">{{ user.name }}</td>
              <td class="px-4 py-2 border-b">{{ user.level }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'

const { data, isFetching, execute: refresh } = useApi('/api/v1/school').json()

const showModal = ref(false)
const formData = ref({
  name: '',
  level: '',
})

const isCreating = ref(false)

const closeModal = () => {
  showModal.value = false
  formData.value = { name: '', level: '' }
}

const createSchool = async () => {
  isCreating.value = true
  try {
    await useApi('/api/v1/school').post(formData.value).json()
    closeModal()
    await refresh()
  } catch (error) {
    console.error('Failed to create school:', error)
  } finally {
    isCreating.value = false
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
