<script lang="ts" setup>
import Sidenav from '@/components/sidenav.vue'
import DarkMode from '@/components/darkMode.vue'
import Container from '@/components/container.vue'
import {
  Bell,
  User,
  Search,
  Menu,
  Home,
  Building,
  Users,
  GraduationCap,
  BookOpen,
  School,
  HelpCircle,
  FileText,
} from 'lucide-vue-next'
import { ref, onMounted, nextTick } from 'vue'
import { useAuth } from '@/stores/useAuth.ts'
import { useSidebar } from '@/stores/useSidebar.ts'
import Logo from '@/assets/logo.png'

const auth = useAuth()
const { sidebarOpen, initializeSidebar, toggleSidebar } = useSidebar()

// Initialize sidebar state from localStorage
onMounted(() => {
  initializeSidebar()
})

const items = [
  {
    name: 'Home',
    path: '/home',
    icon: Home,
  },
  {
    name: 'Schools',
    path: '/school',
    icon: Building,
  },
  {
    name: 'Teachers',
    path: '/teacher',
    icon: Users,
  },
  {
    name: 'Students',
    path: '/student',
    icon: GraduationCap,
  },
  {
    name: 'Subjects',
    path: '/subject',
    icon: BookOpen,
  },
  {
    name: 'Classes',
    path: '/class',
    icon: School,
  },
  {
    name: 'Questions',
    path: '/question',
    icon: HelpCircle,
  },
  {
    name: 'Exams',
    path: '/exam',
    icon: FileText,
  },
]

const logout = () => {
  auth.logout()
}
</script>

<template>
  <Container>
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <aside
        :class="[
          'border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out overflow-hidden',
          sidebarOpen ? 'w-64' : 'w-20',
        ]"
      >
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div
            :class="[
              'flex items-center w-full py-6',
              sidebarOpen ? 'justify-start px-6' : 'justify-center px-2',
            ]"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <img :src="Logo" alt="Hero" class="w-8" />
              </div>
              <span v-if="sidebarOpen" class="font-bold text-xl whitespace-nowrap"> Genesis </span>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4 py-4 space-y-1">
            <router-link
              v-for="item in items"
              :key="`${item.path}-${sidebarOpen}`"
              :to="item.path"
              :class="[
                'flex items-center rounded-lg transition-colors duration-200 group',
                sidebarOpen ? 'px-3 py-2.5' : 'justify-center py-2.5',
              ]"
              class="hover:bg-neutral-100 dark:hover:bg-neutral-800"
              active-class="bg-orange-500/10 text-orange-400"
            >
              <component
                :is="item.icon"
                :class="['flex-shrink-0', sidebarOpen ? 'w-5 h-5 mr-3' : 'w-5 h-5']"
              />
              <span v-if="sidebarOpen" class="font-medium whitespace-nowrap">{{ item.name }}</span>
            </router-link>
          </nav>

          <!-- User Profile -->
          <div class="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center">
                <User class="w-4 h-4" />
              </div>
              <div v-if="sidebarOpen" class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">
                  {{ auth.get()?.payload.user.email }}
                </p>
                <p class="text-xs truncate">
                  {{ auth.get()?.payload.user.email }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Header -->
        <header class="border-b border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center justify-between px-6 py-4">
            <div class="flex items-center space-x-4">
              <button @click="toggleSidebar" class="p-2 rounded-lg transition-colors">
                <Menu class="w-5 h-5" />
              </button>
            </div>

            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 transition-colors">
                <Bell class="w-5 h-5" />
                <span class="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>

              <!-- Dark Mode Toggle -->
              <DarkMode />

              <!-- Logout Button -->
              <button
                @click="logout"
                class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-auto">
          <slot />
        </main>
      </div>
    </div>
  </Container>
</template>

<style scoped></style>
