<template>
  <div class="flex items-center gap-2 flex-shrink-0">
    <!-- Dark Mode Toggle -->
    <div class="block">
      <DarkMode />
    </div>

    <!-- Notifications -->
    <button
      class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative lg:mr-4"
    >
      <Bell class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>

    <!-- Logout -->
    <button
      @click="$emit('logout')"
      class="hidden lg:flex p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
      title="Logout"
    >
      <LogOut
        class="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Bell, LogOut } from 'lucide-vue-next'
import DarkMode from '@/components/darkMode.vue'

defineEmits<{
  logout: []
}>()
</script>
