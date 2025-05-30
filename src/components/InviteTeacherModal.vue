<template>
  <BaseModal
    title="Invite Teacher"
    description="Enter the teacher's email to send an invite."
    :loading="loading"
    :error="error"
    :success="success"
    submit-text="Invite"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <template #content>
      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">Email</label>
        <input
          :value="email"
          @input="$emit('update:email', ($event.target as HTMLInputElement).value)"
          type="email"
          class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
          :class="{ 'border-red-500': error }"
          placeholder="Teacher's email"
          required
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'

defineProps<{
  loading: boolean
  error: string
  success: string
  email: string
}>()
defineEmits(['close', 'submit', 'update:email'])
</script>
