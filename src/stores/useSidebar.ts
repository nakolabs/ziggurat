import { readonly, ref } from 'vue'

const sidebarOpen = ref(true)

export const useSidebar = () => {
  const initializeSidebar = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarOpen')
      if (savedState !== null) {
        sidebarOpen.value = JSON.parse(savedState)
      }
    }
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen.value))
    }
  }

  const setSidebarOpen = (value: boolean) => {
    sidebarOpen.value = value
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen.value))
    }
  }

  return {
    sidebarOpen: readonly(sidebarOpen),
    initializeSidebar,
    toggleSidebar,
    setSidebarOpen,
  }
}
