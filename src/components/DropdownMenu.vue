<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
      :class="triggerClass"
    >
      <MoreVertical class="w-4 h-4" />
    </button>

    <!-- Portal-like dropdown with fixed positioning -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="menuRef"
          class="fixed z-[9999] w-48 rounded-md bg-white dark:bg-neutral-800 py-1 shadow-lg focus:outline-none"
          :class="menuClass"
          :style="dropdownStyle"
        >
          <button
            v-for="action in actions"
            :key="action.key"
            @click="handleAction(action)"
            class="flex w-full items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            :class="action.class"
          >
            <component :is="action.icon" class="mr-3 h-4 w-4" />
            {{ action.label }}
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { MoreVertical } from 'lucide-vue-next'
import type { DropdownAction } from '@/types/table'

interface Props {
  actions: DropdownAction[]
  item: any
  triggerClass?: string
  menuClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  triggerClass: '',
  menuClass: '',
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const dropdownStyle = ref({})

const emit = defineEmits<{
  'dropdown-open': []
  'dropdown-close': []
}>()

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('dropdown-open')
    nextTick(() => {
      calculatePosition()
    })
  } else {
    emit('dropdown-close')
  }
}

function calculatePosition() {
  if (!dropdownRef.value) return

  const triggerRect = dropdownRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const menuWidth = 192 // w-48 = 12rem = 192px
  const menuHeight = props.actions.length * 40 + 8 // Approximate height

  // Calculate horizontal position
  let left = triggerRect.right - menuWidth // Align right edge of menu with right edge of trigger

  // Ensure menu doesn't go off the left edge
  if (left < 8) {
    left = triggerRect.left // Align left edge of menu with left edge of trigger
  }

  // Ensure menu doesn't go off the right edge
  if (left + menuWidth > viewportWidth - 8) {
    left = viewportWidth - menuWidth - 8
  }

  // Calculate vertical position
  let top = triggerRect.bottom + 8 // Position below trigger with 8px gap

  // If menu would go off bottom, position above trigger
  if (top + menuHeight > viewportHeight - 8) {
    top = triggerRect.top - menuHeight - 8
  }

  // Ensure menu doesn't go off the top
  if (top < 8) {
    top = 8
  }

  dropdownStyle.value = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    zIndex: 9999,
  }
}

function handleAction(action: DropdownAction) {
  action.handler(props.item)
  isOpen.value = false
  emit('dropdown-close')
}

function handleClickOutside(event: Event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    if (isOpen.value) {
      emit('dropdown-close')
    }
    isOpen.value = false
  }
}

function handleScroll() {
  if (isOpen.value) {
    calculatePosition()
  }
}

function handleResize() {
  if (isOpen.value) {
    emit('dropdown-close')
    isOpen.value = false
  }
}

// Reset position when dropdown closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    dropdownStyle.value = {}
    emit('dropdown-close')
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
})
</script>
