<template>
  <div class="space-y-1">
    <label class="block text-sm font-medium ">{{ label }}</label>
    <input
        :type="type"
        :value="modelValue"
        class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg  focus:border-2 focus:outline-none"
        @input="$emit('update:modelValue', $event.target?.value)"
    />
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  label: String,
  type: {type: String, default: 'text'},
  modelValue: String,
  error: String,
})
defineEmits(['update:modelValue'])
</script>
