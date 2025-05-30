<template>
  <BaseModal
    title="Invite Student"
    :loading="loading"
    :error="error"
    :success="success"
    submit-text="Send Invitation"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <template #content>
      <!-- Email Input -->
      <div class="mb-4">
        <label
          for="email"
          class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          :value="email"
          @input="$emit('update:email', ($event.target as HTMLInputElement)?.value)"
          placeholder="Enter student's email address"
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          required
        />
      </div>

      <!-- Grade Selection -->
      <div class="mb-4">
        <label
          for="grade"
          class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          Grade
        </label>
        <select
          id="grade"
          :value="grade"
          @change="$emit('update:grade', ($event.target as HTMLSelectElement)?.value)"
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          required
        >
          <option value="">Select Grade</option>
          <option value="1">Grade 1</option>
          <option value="2">Grade 2</option>
          <option value="3">Grade 3</option>
          <option value="4">Grade 4</option>
          <option value="5">Grade 5</option>
          <option value="6">Grade 6</option>
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
          <option value="9">Grade 9</option>
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from './BaseModal.vue'

interface Props {
  loading?: boolean
  error?: string
  success?: string
  email?: string
  grade?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'update:email', value: string): void
  (e: 'update:grade', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
