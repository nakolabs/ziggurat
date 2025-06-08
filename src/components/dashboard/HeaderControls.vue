<template>
  <div class="flex items-center gap-2 flex-shrink-0">
    <!-- Mobile Menu Button -->
    <button
      @click="$emit('toggleSidebar')"
      class="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
    >
      <Menu class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
    </button>

    <!-- Desktop Sidebar Toggle -->
    <button
      @click="$emit('toggleSidebarCollapse')"
      class="hidden lg:flex p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <Menu class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

interface Props {
  sidebarCollapsed: boolean
}

defineProps<Props>()
defineEmits<{
  toggleSidebar: []
  toggleSidebarCollapse: []
}>()
</script>
