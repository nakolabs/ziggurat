<template>
  <div class="w-full max-w-md">
    <button
      @click="$emit('openSearch')"
      class="w-full flex items-center gap-3 px-4 py-2.5 text-left bg-gray-100/80 dark:bg-neutral-800/80 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl border border-gray-200/50 dark:border-neutral-700/50 transition-all duration-200 group min-w-0"
    >
      <Search
        class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0"
      />
      <span
        class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors truncate"
      >
        Search anything...
      </span>
      <div class="flex items-center gap-1 flex-shrink-0 ml-auto">
        <kbd
          class="px-1.5 py-0.5 bg-gray-100/80 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded text-xs text-gray-500 dark:text-gray-400 font-mono"
        >
          ⌘/
        </kbd>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

defineEmits<{
  openSearch: []
}>()
</script>
