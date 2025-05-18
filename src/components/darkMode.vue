<script lang="ts" setup>

import {Moon, Sun} from "lucide-vue-next";
import {useDark, useToggle} from "@vueuse/core";

const isDark = useDark({
  attribute: 'class',
})

const toggleDark = useToggle(isDark)
</script>

<template>
  <button
      class="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
      @click="toggleDark()"
  >
    <component :is="isDark.valueOf() ? Moon : Sun" class="w-6 h-6 text-neutral-500 dark:text-neutral-400"/>
  </button>
</template>

<style scoped>

</style>


