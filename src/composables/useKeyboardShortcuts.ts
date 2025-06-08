import { onMounted, onUnmounted, ref } from 'vue'

export function useKeyboardShortcuts() {
  const showQuickSearch = ref(false)

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      showQuickSearch.value = true
    }
    if (e.key === 'Escape') {
      showQuickSearch.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    showQuickSearch,
  }
}
