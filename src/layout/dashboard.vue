<template>
  <Container>
    <div class="flex min-h-screen bg-gray-50 dark:bg-neutral-950">
      <!-- Sidebar -->
      <DashboardSidebar
        :sidebar-open="sidebarOpen"
        :sidebar-collapsed="sidebarCollapsed"
        :navigation-items="navigationItems"
        :is-route-active="isRouteActive"
        @logout="logout"
      />

      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        @click="toggleSidebar"
      />

      <!-- Main Content -->
      <main
        :class="[
          'flex-1 transition-all duration-500 ease-in-out',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64',
        ]"
      >
        <!-- Header -->
        <DashboardHeader
          :sidebar-collapsed="sidebarCollapsed"
          :breadcrumbs="breadcrumbs"
          @toggle-sidebar="toggleSidebar"
          @toggle-sidebar-collapse="toggleSidebarCollapse"
          @open-search="showQuickSearch = true"
          @logout="logout"
        />

        <!-- Content -->
        <div class="min-h-[calc(100vh-73px)]">
          <slot />
        </div>
      </main>

      <!-- Quick Search Modal -->
      <QuickSearch :is-open="showQuickSearch" @close="showQuickSearch = false" />
    </div>
  </Container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/stores/useAuth'
import { useSidebar } from '@/composables/useSidebar'
import { useNavigation } from '@/composables/useNavigation'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

// Components
import Container from '@/components/container.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import QuickSearch from '@/components/home/QuickSearch.vue'

// Composables
const auth = useAuth()
const { sidebarOpen, sidebarCollapsed, initializeSidebar, toggleSidebar, toggleSidebarCollapse } = useSidebar()
const { navigationItems, isRouteActive, breadcrumbs } = useNavigation()
const { showQuickSearch } = useKeyboardShortcuts()

// Initialize
onMounted(() => {
  initializeSidebar()
})

// Actions
const logout = () => {
  auth.logout()
}
</script>
