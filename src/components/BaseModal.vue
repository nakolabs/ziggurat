<template>
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div 
      :class="[
        'bg-white dark:bg-neutral-900 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden',
        modalClass
      ]"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
              {{ title }}
            </h3>
            <p v-if="description" class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {{ description }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            :disabled="loading"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div :class="['px-6 py-4', contentClass]">
        <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {{ error }}
        </div>
        
        <div v-if="success" class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
          {{ success }}
        </div>

        <slot name="content">
          <form @submit.prevent="$emit('submit')" class="space-y-4">
            <div v-for="field in fields" :key="field.key" class="space-y-2">
              <label :for="`field-${field.key}`" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              
              <input
                v-if="field.type !== 'textarea' && field.type !== 'select'"
                :id="`field-${field.key}`"
                :type="field.type || 'text'"
                :value="field.value"
                :placeholder="field.placeholder"
                :required="field.required"
                @input="$emit('update:field', { key: field.key, value: ($event.target as HTMLInputElement).value })"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />
              
              <textarea
                v-else-if="field.type === 'textarea'"
                :id="`field-${field.key}`"
                :value="field.value"
                :placeholder="field.placeholder"
                :required="field.required"
                :rows="field.rows || 3"
                @input="$emit('update:field', { key: field.key, value: ($event.target as HTMLTextAreaElement).value })"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none"
              ></textarea>
              
              <select
                v-else-if="field.type === 'select'"
                :id="`field-${field.key}`"
                :value="field.value"
                :required="field.required"
                @change="$emit('update:field', { key: field.key, value: ($event.target as HTMLSelectElement).value })"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </form>
        </slot>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            :disabled="loading"
          >
            {{ cancelText || 'Cancel' }}
          </button>
          
          <button
            v-if="submitText"
            @click="$emit('submit')"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ loading ? 'Processing...' : submitText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface Field {
  key: string
  label: string
  value: any
  type?: string
  placeholder?: string
  required?: boolean
  rows?: number
  options?: { value: string; label: string }[]
}

interface Props {
  title: string
  description?: string
  fields?: Field[]
  loading?: boolean
  error?: string
  success?: string
  submitText?: string
  cancelText?: string
  modalClass?: string
  contentClass?: string
}

defineProps<Props>()

defineEmits<{
  close: []
  submit: []
  'update:field': [{ key: string; value: any }]
}>()
</script>
