<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click="handleBackdropClick"
  >
    <div
      ref="modalContent"
      :class="[
        'bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-lg w-full p-8 relative',
        modalClass || 'max-w-md',
      ]"
    >
      <button
        class="absolute top-3 right-3 text-neutral-400 hover:text-orange-500"
        @click="$emit('close')"
      >
        <X />
      </button>

      <!-- Header Section -->
      <div class="mb-6">
        <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
        <p v-if="description" class="text-neutral-500">{{ description }}</p>
      </div>

      <!-- Form Section -->
      <form @submit.prevent="$emit('submit')">
        <!-- Custom content slot -->
        <div :class="contentClass">
          <slot name="content">
            <!-- Default input fields if no custom content provided -->
            <div v-for="field in fields" :key="field.key" class="mb-4">
              <label class="block mb-1 text-sm font-medium">{{ field.label }}</label>
              <input
                :value="field.value"
                @input="
                  $emit('update:field', {
                    key: field.key,
                    value: ($event.target as HTMLInputElement).value,
                  })
                "
                :type="field.type || 'text'"
                :placeholder="field.placeholder"
                :required="field.required"
                class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
                :class="{ 'border-red-500': field.error }"
              />
              <div v-if="field.error" class="text-xs text-red-400 mt-1">{{ field.error }}</div>
            </div>
          </slot>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="error" class="text-xs text-red-400 mb-2">{{ error }}</div>
        <div v-if="success" class="text-xs text-green-400 mb-2">{{ success }}</div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2">
          <slot name="actions" :loading="loading">
            <!-- Default buttons -->
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-neutral-700 text-white"
              @click="$emit('close')"
              :disabled="loading"
            >
              {{ cancelText || 'Cancel' }}
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
              {{ submitText || 'Submit' }}
            </button>
          </slot>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ref } from 'vue'

interface FieldConfig {
  key: string
  label: string
  value: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
}

const modalContent = ref<HTMLElement>()

const handleBackdropClick = (event: MouseEvent) => {
  // Only close if clicking on the backdrop, not the modal content
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

defineProps<{
  title: string
  description?: string
  fields?: FieldConfig[]
  loading?: boolean
  error?: string
  success?: string
  cancelText?: string
  submitText?: string
  modalClass?: string
  contentClass?: string
}>()

const emit = defineEmits(['close', 'submit', 'update:field'])
</script>
