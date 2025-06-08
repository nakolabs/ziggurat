<template>
  <!-- Expanded State -->
  <Transition
    enter-active-class="transition-all duration-400 ease-in-out delay-200"
    leave-active-class="transition-all duration-200 ease-in-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="!collapsed" class="flex items-center gap-3">
      <UserAvatar />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-neutral-900 dark:text-white truncate">
          {{ userDisplayName }}
        </p>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate capitalize">
          {{ userRole }}
        </p>
      </div>
    </div>
  </Transition>

  <!-- Collapsed State -->
  <Transition
    enter-active-class="transition-all duration-400 ease-in-out delay-200"
    leave-active-class="transition-all duration-200 ease-in-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="collapsed" class="flex justify-center">
      <div class="group relative">
        <UserAvatar :collapsed="true" />
        <!-- Tooltip -->
        <div
          class="absolute left-full ml-3 px-3 py-2 bg-neutral-900 dark:bg-neutral-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out whitespace-nowrap z-[60] pointer-events-none"
        >
          <div class="text-center">
            <p class="font-medium">{{ userDisplayName }}</p>
            <p class="text-xs opacity-75 capitalize">{{ userRole }}</p>
          </div>
          <div
            class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-neutral-900 dark:bg-neutral-700 rotate-45"
          ></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/stores/useAuth'
import UserAvatar from './UserAvatar.vue'

interface Props {
  collapsed: boolean
}

defineProps<Props>()

const auth = useAuth()

const userDisplayName = computed(() => {
  return auth.get()?.payload.user.email?.split('@')[0] || 'User'
})

const userRole = computed(() => {
  return auth.get()?.payload.user.user_role || ''
})
</script>
