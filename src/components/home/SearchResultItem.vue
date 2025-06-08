<template>
  <div
    @click="$emit('click')"
    @mouseenter="$emit('hover')"
    :class="[
      'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150',
      isSelected 
        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
        : 'hover:bg-gray-50 dark:hover:bg-neutral-800 border border-transparent'
    ]"
  >
    <div :class="[
      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
      isSelected 
        ? 'bg-blue-100 dark:bg-blue-900/30' 
        : 'bg-gray-100 dark:bg-neutral-800'
    ]">
      <component 
        :is="item.icon" 
        :class="[
          'w-5 h-5',
          isSelected 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-600 dark:text-gray-400'
        ]" 
      />
    </div>
    
    <div class="flex-1 min-w-0">
      <p :class="[
        'font-semibold text-sm truncate',
        isSelected 
          ? 'text-blue-900 dark:text-blue-100' 
          : 'text-gray-900 dark:text-white'
      ]">
        {{ item.title }}
      </p>
      <p :class="[
        'text-xs truncate mt-0.5',
        isSelected 
          ? 'text-blue-700 dark:text-blue-300' 
          : 'text-gray-500 dark:text-gray-400'
      ]">
        {{ item.description }}
      </p>
    </div>
    
    <div v-if="isSelected" class="flex-shrink-0">
      <kbd class="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
        ↵
      </kbd>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SearchItem {
  id: string
  title: string
  description: string
  icon: any
  category: string
  path: string
  keywords: string[]
}

interface Props {
  item: SearchItem
  isSelected: boolean
}

interface Emits {
  (e: 'click'): void
  (e: 'hover'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
