<template>
  <div>
    <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
      <span v-if="optional" class="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
    </label>
    
    <div class="relative">
      <div v-if="$slots.icon" class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <slot name="icon" />
      </div>
      
      <input
        v-if="type !== 'select' && type !== 'textarea'"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        :type="type"
        :required="required"
        :placeholder="placeholder"
        :class="[inputClasses, $slots.icon ? 'pl-10' : 'pl-3']"
      />
      
      <select
        v-else-if="type === 'select'"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        @blur="$emit('blur')"
        :required="required"
        :class="[inputClasses, $slots.icon ? 'pl-10' : 'pl-3']"
      >
        <option value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      
      <div v-if="type === 'textarea'" class="relative">
        <div v-if="$slots.icon" class="absolute left-3 top-3 z-10">
          <slot name="icon" />
        </div>
        <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          :rows="rows || 3"
          :placeholder="placeholder"
          :class="[inputClasses, 'resize-none', $slots.icon ? 'pl-10' : 'pl-3']"
        ></textarea>
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  label: string
  type?: string
  required?: boolean
  optional?: boolean
  placeholder?: string
  error?: string
  options?: Option[]
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  optional: false
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const inputClasses = computed(() => [
  'w-full py-2 text-sm border rounded-lg transition-colors bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500',
  props.error 
    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-200 dark:border-neutral-700'
])
</script>
