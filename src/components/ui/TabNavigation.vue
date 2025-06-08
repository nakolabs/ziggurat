<template>
  <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-1">
    <div class="flex space-x-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('update:modelValue', tab.id)"
        :class="[
          modelValue === tab.id 
            ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white' 
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
          'px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2'
        ]"
      >
        <component :is="getIconComponent(tab.icon)" class="w-4 h-4" />
        {{ tab.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { User, Book, School, Settings } from 'lucide-vue-next'

interface Tab {
  id: string
  name: string
  icon: string
}

defineProps<{
  modelValue: string
  tabs: Tab[]
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const getIconComponent = (iconName: string) => {
  const iconMap = {
    user: User,
    book: Book,
    class: School,
    cog: Settings,
  }
  return iconMap[iconName] || User
}
</script>
