<script lang="ts" setup>
import {Moon, Sun} from "lucide-vue-next";
import {useDark, useToggle} from "@vueuse/core";
import { useSidebar } from '@/composables/useSidebar'

const isDark = useDark({
  attribute: 'class',
})

const toggleDark = useToggle(isDark)
const { sidebarCollapsed } = useSidebar()
</script>

<template>
  <button
    :class="[
      'p-2 transition-all duration-500 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
      sidebarCollapsed ? 'rounded-md' : 'rounded-lg'
    ]"
    @click="toggleDark()"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <component 
      :is="isDark.valueOf() ? Sun : Moon" 
      class="w-5 h-5 text-neutral-500 dark:text-neutral-400 transition-transform duration-300 ease-in-out"
    />
  </button>
</template>

<style scoped>

</style>


