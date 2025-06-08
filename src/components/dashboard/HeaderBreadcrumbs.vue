<template>
  <div class="hidden lg:block ml-2 flex-1 min-w-0 overflow-hidden">
    <!-- Modern Breadcrumb Design -->
    <div v-if="breadcrumbs.length > 1" class="flex items-center min-w-0">
      <nav class="flex items-center min-w-0" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-1 min-w-0">
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
            <li class="flex items-center min-w-0">
              <!-- Breadcrumb Item -->
              <router-link
                v-if="index < breadcrumbs.length - 1"
                :to="crumb.path"
                class="group flex items-center px-2 py-1 rounded-md text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 min-w-0"
              >
                <span class="truncate">{{ crumb.name }}</span>
              </router-link>
              
              <!-- Current Page -->
              <span
                v-else
                class="flex items-center px-2 py-1 text-sm font-semibold text-neutral-900 dark:text-white min-w-0"
                aria-current="page"
              >
                <span class="truncate">{{ crumb.name }}</span>
              </span>
              
              <!-- Separator -->
              <svg
                v-if="index < breadcrumbs.length - 1"
                class="flex-shrink-0 mx-2 h-3 w-3 text-neutral-300 dark:text-neutral-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
            </li>
          </template>
        </ol>
      </nav>
    </div>
    
    <!-- Single Page Title -->
    <h1
      v-else
      class="text-lg font-semibold text-neutral-900 dark:text-white truncate"
    >
      {{ breadcrumbs[0]?.name || 'Dashboard' }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import type { Breadcrumb } from '@/composables/useNavigation'

interface Props {
  breadcrumbs: Breadcrumb[]
}

defineProps<Props>()
</script>
