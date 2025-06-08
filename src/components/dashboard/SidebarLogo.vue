<template>
  <div
    :class="[
      'flex items-center border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 transition-all duration-500 ease-in-out',
      collapsed ? 'p-4 gap-3 lg:gap-0 lg:justify-center' : 'gap-3 p-6',
    ]"
  >
    <img
      :src="Logo"
      alt="Logo"
      :class="[
        'flex-shrink-0 transition-all duration-500 ease-in-out',
        collapsed ? 'w-8 h-8 rounded-md' : 'w-8 h-8 rounded-lg',
      ]"
    />
    <Transition
      enter-active-class="transition-all duration-500 ease-in-out delay-100"
      leave-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="opacity-0 translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-4"
    >
      <span
        :class="[
          'font-bold text-xl text-neutral-900 dark:text-white whitespace-nowrap',
          collapsed ? 'lg:hidden' : 'lg:block' ,
        ]"
      >
        Genesis
      </span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/logo.png'

interface Props {
  collapsed: boolean
}

defineProps<Props>()
</script>
