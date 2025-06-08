<template>
  <div
    :class="[
      'bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-in-out',
      collapsed 
        ? 'w-10 h-10 rounded-md' 
        : 'w-10 h-10 rounded-lg'
    ]"
  >
    <User class="w-5 h-5 text-white" />
  </div>
</template>

<script setup lang="ts">
import { User } from 'lucide-vue-next'

interface Props {
  collapsed?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsed: false
})
</script>
