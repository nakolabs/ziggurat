<template>
  <button
    @click="$emit('click')"
    :class="[
      'p-4 rounded-lg text-left transition-colors group',
      bgColor,
      hoverColor
    ]"
  >
    <div :class="['flex items-center gap-2 font-medium mb-1', iconColor]">
      <component
        :is="icon"
        class="w-4 h-4 group-hover:scale-110 transition-transform"
        :class="{ 'group-hover:rotate-45': rotateOnHover }"
      />
      {{ title }}
    </div>
    <div :class="['text-sm', descriptionColor]">{{ description }}</div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: any
  iconColor: string
  bgColor: string
  hoverColor: string
  title: string
  description: string
  rotateOnHover?: boolean
}

const props = defineProps<Props>()

const descriptionColor = computed(() => {
  // Extract base color from iconColor
  const colorMatch = props.iconColor.match(/(blue|green|gray|purple|orange|emerald)-/)
  if (colorMatch) {
    const color = colorMatch[1]
    return `text-${color}-500 dark:text-${color}-300`
  }
  return 'text-gray-500 dark:text-gray-300'
})

defineEmits<{
  click: []
}>()
</script>
