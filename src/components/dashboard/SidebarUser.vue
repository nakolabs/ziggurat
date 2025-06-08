<template>
  <div>
    <!-- Mobile User Section -->
    <button
      @click="$emit('logout')"
      class="lg:hidden p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group flex flex-row items-center gap-3 px-6 py-4 text-sm font-medium w-full"
      title="Logout"
    >
      <LogOut
        class="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
      />
      Logout
    </button>
    <div class="lg:hidden p-4 border-t border-neutral-200 dark:border-neutral-800 w-full">
      <UserInfo :collapsed="false" />
    </div>

    <!-- Desktop User Section -->
    <div
      :class="[
        'hidden lg:block border-t border-neutral-200 dark:border-neutral-800 flex-shrink-0 transition-all duration-500 ease-in-out',
        collapsed ? 'p-2' : 'p-4',
      ]"
    >
      <UserInfo :collapsed="collapsed" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import UserInfo from './UserInfo.vue'

interface Props {
  collapsed: boolean
}

defineProps<Props>()
defineEmits<{
  logout: []
}>()
</script>
