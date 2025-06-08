import { readonly, ref } from 'vue'

const sidebarOpen = ref(true)
const sidebarCollapsed = ref(false) // New state for desktop collapse

export const useSidebar = () => {
  const initializeSidebar = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarOpen')
      const savedCollapsed = localStorage.getItem('sidebarCollapsed')
      
      if (savedState !== null) {
        sidebarOpen.value = JSON.parse(savedState)
      }
      if (savedCollapsed !== null) {
        sidebarCollapsed.value = JSON.parse(savedCollapsed)
      }
    }
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen.value))
    }
  }

  const toggleSidebarCollapse = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed.value))
    }
  }

  const setSidebarOpen = (value: boolean) => {
    sidebarOpen.value = value
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen.value))
    }
  }

  const setSidebarCollapsed = (value: boolean) => {
    sidebarCollapsed.value = value
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed.value))
    }
  }

  return {
    sidebarOpen: readonly(sidebarOpen),
    sidebarCollapsed: readonly(sidebarCollapsed),
    initializeSidebar,
    toggleSidebar,
    toggleSidebarCollapse,
    setSidebarOpen,
    setSidebarCollapsed,
  }
}
