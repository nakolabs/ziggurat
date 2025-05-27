<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Invite Teachers</h3>
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

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"> Email Addresses </label>
          <textarea
            v-model="emailsText"
            rows="4"
            placeholder="Enter email addresses, one per line"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">Enter one email address per line</p>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Inviting...' : 'Send Invitations' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'

const emit = defineEmits<{
  close: []
  success: []
}>()

const auth = useAuth()
const emailsText = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  const emails = emailsText.value
    .split('\n')
    .map((email) => email.trim())
    .filter((email) => email)

  if (!emails.length) {
    alert('Please enter at least one email address')
    return
  }

  isSubmitting.value = true

  try {
    const schoolId = auth.get()?.payload.user.school_id
    await useApi('/api/v1/teacher/invite')
      .post({
        emails,
        school_id: schoolId,
      })
      .json()

    emit('success')
  } catch (error) {
    console.error('Failed to invite teachers:', error)
    alert('Failed to send invitations. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
