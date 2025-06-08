<template>
  <div>
    <label class="block text-sm text-neutral-500 dark:text-neutral-400 mb-1">
      {{ label }}
      <span v-if="required && isEdit" class="text-red-500">*</span>
    </label>
    
    <!-- Edit Mode -->
    <template v-if="isEdit">
      <input
        v-if="type === 'text' || type === 'email' || type === 'tel' || type === 'url'"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :required="required"
        class="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
      
      <select
        v-else-if="type === 'select'"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <textarea
        v-else-if="type === 'textarea'"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        :placeholder="placeholder"
        :rows="rows || 3"
        class="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      ></textarea>
    </template>
    
    <!-- View Mode -->
    <template v-else>
      <p v-if="!isLink" class="text-neutral-700 dark:text-neutral-300">
        {{ value || '-' }}
      </p>
      <p v-else-if="value" class="text-orange-500 hover:text-orange-600 dark:text-orange-400 text-sm">
        <a :href="value" target="_blank">{{ value }}</a>
      </p>
      <p v-else class="text-neutral-700 dark:text-neutral-300">-</p>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  label: string
  value?: string
  modelValue?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea'
  placeholder?: string
  isEdit: boolean
  required?: boolean
  isLink?: boolean
  options?: Option[]
  rows?: number
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
