<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Teacher Details</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <p class="mt-1 text-sm text-gray-900">{{ teacher.name || 'Not set' }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-sm text-gray-900">{{ teacher.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <span :class="getStatusClass(teacher.is_verified)">
            {{ teacher.is_verified ? 'Verified' : 'Pending Verification' }}
          </span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Joined</label>
          <p class="mt-1 text-sm text-gray-900">{{ formatDate(teacher.created_at) }}</p>
        </div>

        <div v-if="teacher.updated_at">
          <label class="block text-sm font-medium text-gray-700">Last Updated</label>
          <p class="mt-1 text-sm text-gray-900">{{ formatDate(teacher.updated_at) }}</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Teacher } from '@/types/response'

defineProps<{
  teacher: Teacher
}>()

defineEmits<{
  close: []
  updated: []
}>()

const getStatusClass = (isVerified: boolean) => {
  return isVerified
    ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
    : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
