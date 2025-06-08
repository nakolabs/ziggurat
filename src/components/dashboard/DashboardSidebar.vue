<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-40 h-screen transition-all duration-500 ease-in-out',
      'bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800',
      'shadow-lg lg:shadow-none flex flex-col overflow-hidden',
      sidebarOpen ? '' : '-translate-x-full lg:translate-x-0',
      sidebarCollapsed ? 'lg:w-16 w-64' : 'lg:w-64 w-64',
    ]"
  >
    <!-- Logo Section -->
    <SidebarLogo :collapsed="sidebarCollapsed" />

    <!-- Navigation -->
    <SidebarNavigation 
      :items="navigationItems" 
      :collapsed="sidebarCollapsed"
      :is-route-active="isRouteActive"
    />

    <!-- User Section -->
    <SidebarUser :collapsed="sidebarCollapsed" @logout="$emit('logout')" />
  </aside>
</template>

<script setup lang="ts">
import type { NavigationItem } from '@/composables/useNavigation'
import SidebarLogo from './SidebarLogo.vue'
import SidebarNavigation from './SidebarNavigation.vue'
import SidebarUser from './SidebarUser.vue'

interface Props {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  navigationItems: NavigationItem[]
  isRouteActive: (item: NavigationItem) => boolean
}

defineProps<Props>()
defineEmits<{
  logout: []
}>()
</script>
