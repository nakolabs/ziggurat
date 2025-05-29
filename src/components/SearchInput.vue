<template>
  <div class="relative">
    <svg
      class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      :value="modelValue"
      @input="onInput"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-neutral-400"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue', 'input'])

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('input', value)
}
</script>
