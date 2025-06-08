<template>
  <nav class="flex-1 overflow-y-auto overflow-x-hidden">
    <div
      :class="[
        'transition-all duration-500 ease-in-out',
        collapsed ? 'px-2 py-6' : 'px-4 py-6',
      ]"
    >
      <ul class="space-y-2">
        <li v-for="item in items" :key="item.name">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center text-sm font-medium transition-all duration-500 ease-in-out relative group',
              collapsed
                ? 'lg:justify-center px-4 py-3 gap-3 lg:gap-0'
                : 'gap-3 px-3 py-2.5',
              isRouteActive(item)
                ? collapsed
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-md'
                  : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-lg'
                : collapsed
                  ? 'text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  : 'text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800',
            ]"
            :title="collapsed ? item.name : ''"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 flex-shrink-0 transition-transform duration-300 ease-in-out"
            />
            <Transition
              enter-active-class="transition-all duration-500 ease-in-out"
              leave-active-class="transition-all duration-500 ease-in-out"
              enter-from-class="opacity-0 translate-x-4"
              enter-to-class="opacity-100 translate-x-0"
              leave-from-class="opacity-100 translate-x-0"
              leave-to-class="opacity-0 translate-x-4"
            >
              <span
                class="whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {{ item.name }}
              </span>
            </Transition>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavigationItem } from '@/composables/useNavigation'

interface Props {
  items: NavigationItem[]
  collapsed: boolean
  isRouteActive: (item: NavigationItem) => boolean
}

defineProps<Props>()
</script>
