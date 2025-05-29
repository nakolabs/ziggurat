<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-neutral-900 rounded-lg shadow-lg w-full max-w-md p-8 relative">
      <button
        class="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200"
        @click="$emit('close')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h2 class="text-xl font-bold mb-2">Invite Teacher</h2>
      <p class="mb-6 text-neutral-400">Enter the teacher's email to send an invite.</p>
      <form @submit.prevent="$emit('submit')">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input
            :value="email"
            @input="$emit('update:email', ($event.target as HTMLInputElement).value)"
            type="email"
            class="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white"
            :class="{ 'border-red-500': error }"
            placeholder="Teacher's email"
            required
          />
          <div v-if="error" class="text-xs text-red-400 mt-1">{{ error }}</div>
        </div>
        <div v-if="success" class="text-xs text-green-400 mb-2">{{ success }}</div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-neutral-700 text-white"
            @click="$emit('close')"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            ></span>
            Invite
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
  error: string
  success: string
  email: string
}>()
defineEmits(['close', 'submit', 'update:email'])
</script>
