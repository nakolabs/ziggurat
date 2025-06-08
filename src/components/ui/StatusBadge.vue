<template>
  <span 
    :class="statusClasses"
    class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full"
  >
    <div class="w-2 h-2 rounded-full" :class="dotClass"></div>
    {{ statusText }}
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  isVerified: boolean
}>()

const statusClasses = computed(() =>
  props.isVerified 
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
)

const dotClass = computed(() =>
  props.isVerified ? 'bg-green-500' : 'bg-yellow-500'
)

const statusText = computed(() =>
  props.isVerified ? 'Verified Teacher' : 'Pending Verification'
)
</script>
