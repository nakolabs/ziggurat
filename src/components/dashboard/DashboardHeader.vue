<template>
  <header
    class="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800"
  >
    <div class="flex items-center px-4 lg:px-6 py-4 min-w-0">
      <!-- Left Section: Fixed width container for controls + breadcrumbs -->
      <div class="flex items-center min-w-0 w-1/3 pr-4">
        <HeaderControls
          :sidebar-collapsed="sidebarCollapsed"
          @toggle-sidebar="$emit('toggleSidebar')"
          @toggle-sidebar-collapse="$emit('toggleSidebarCollapse')"
        />
        <HeaderBreadcrumbs :breadcrumbs="breadcrumbs" />
      </div>

      <!-- Center Section: Fixed width for search (always centered) -->
      <div class="flex justify-center w-1/3">
        <HeaderSearch @open-search="$emit('openSearch')" />
      </div>

      <!-- Right Section: Fixed width for actions -->
      <div class="flex justify-end w-1/3 pl-4">
        <HeaderActions @logout="$emit('logout')" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Breadcrumb } from '@/composables/useNavigation'
import HeaderControls from './HeaderControls.vue'
import HeaderBreadcrumbs from './HeaderBreadcrumbs.vue'
import HeaderSearch from './HeaderSearch.vue'
import HeaderActions from './HeaderActions.vue'

interface Props {
  sidebarCollapsed: boolean
  breadcrumbs: Breadcrumb[]
}

defineProps<Props>()
defineEmits<{
  toggleSidebar: []
  toggleSidebarCollapse: []
  openSearch: []
  logout: []
}>()
</script>
