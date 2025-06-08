<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm p-4"
        @click="closeSearch"
      >
        <div class="flex items-start justify-center min-h-screen pt-12 lg:pt-16">
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="isOpen"
              class="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden mx-auto"
              @click.stop
            >
              <!-- Search Input -->
              <div class="relative border-b border-gray-200 dark:border-neutral-800">
                <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search anything..."
                  class="w-full pl-12 pr-12 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none text-base lg:text-lg"
                  @keydown.esc="closeSearch"
                  @keydown.down="navigateDown"
                  @keydown.up="navigateUp"
                  @keydown.enter="selectResult"
                />
                <button
                  @click="closeSearch"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X class="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <!-- Search Results -->
              <div class="max-h-80 lg:max-h-96 overflow-y-auto">
                <!-- No Results -->
                <div
                  v-if="searchQuery && filteredResults.length === 0"
                  class="p-6 lg:p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  <FileSearch class="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 opacity-50" />
                  <p class="text-base lg:text-lg font-medium mb-1">No results found</p>
                  <p class="text-sm">Try searching for something else</p>
                </div>

                <!-- Recent/Suggestions (when no search query) -->
                <div v-else-if="!searchQuery" class="p-4">
                  <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Quick Actions
                  </h3>
                  <div class="space-y-1">
                    <SearchResultItem
                      v-for="(item, index) in quickActions"
                      :key="item.id"
                      :item="item"
                      :is-selected="selectedIndex === index"
                      @click="selectItem(item)"
                      @hover="selectedIndex = index"
                    />
                  </div>
                </div>

                <!-- Search Results -->
                <div v-else class="p-4">
                  <div v-for="(category, categoryName) in groupedResults" :key="categoryName" class="mb-6 last:mb-0">
                    <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      {{ categoryName }}
                    </h3>
                    <div class="space-y-1">
                      <SearchResultItem
                        v-for="(item, index) in category"
                        :key="item.id"
                        :item="item"
                        :is-selected="selectedIndex === getGlobalIndex(categoryName, index)"
                        @click="selectItem(item)"
                        @hover="selectedIndex = getGlobalIndex(categoryName, index)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-gray-200 dark:border-neutral-800 px-4 py-3 bg-gray-50 dark:bg-neutral-800/50">
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-2 lg:gap-4">
                    <div class="flex items-center gap-1">
                      <kbd class="px-1.5 py-0.5 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded text-xs">↵</kbd>
                      <span class="hidden sm:inline">to select</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <kbd class="px-1.5 py-0.5 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded text-xs">↑↓</kbd>
                      <span class="hidden sm:inline">to navigate</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded text-xs">esc</kbd>
                    <span class="hidden sm:inline">to close</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, 
  X, 
  FileSearch,
  Users,
  GraduationCap,
  BookOpen,
  School,
  FileText,
  UserPlus,
  Building,
  HelpCircle,
  Settings
} from 'lucide-vue-next'
import SearchResultItem from './SearchResultItem.vue'

interface SearchItem {
  id: string
  title: string
  description: string
  icon: any
  category: string
  path: string
  keywords: string[]
}

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const selectedIndex = ref(0)

// Search data
const searchItems: SearchItem[] = [
  {
    id: 'teachers',
    title: 'Teachers',
    description: 'Manage teaching staff',
    icon: Users,
    category: 'People',
    path: '/teacher',
    keywords: ['teacher', 'staff', 'educator', 'instructor']
  },
  {
    id: 'students',
    title: 'Students',
    description: 'Manage student records',
    icon: GraduationCap,
    category: 'People',
    path: '/student',
    keywords: ['student', 'pupil', 'learner', 'enrollment']
  },
  {
    id: 'subjects',
    title: 'Subjects',
    description: 'Manage course subjects',
    icon: BookOpen,
    category: 'Academic',
    path: '/subject',
    keywords: ['subject', 'course', 'curriculum', 'lesson']
  },
  {
    id: 'classes',
    title: 'Classes',
    description: 'Manage class schedules',
    icon: School,
    category: 'Academic',
    path: '/class',
    keywords: ['class', 'schedule', 'timetable', 'room']
  },
  {
    id: 'exams',
    title: 'Exams',
    description: 'Create and manage exams',
    icon: FileText,
    category: 'Academic',
    path: '/exam',
    keywords: ['exam', 'test', 'assessment', 'quiz', 'evaluation']
  },
  {
    id: 'questions',
    title: 'Questions',
    description: 'Manage exam questions',
    icon: HelpCircle,
    category: 'Academic',
    path: '/question',
    keywords: ['question', 'quiz', 'mcq', 'essay', 'problem']
  },
  {
    id: 'ppdb',
    title: 'PPDB',
    description: 'Student registration system',
    icon: UserPlus,
    category: 'Registration',
    path: '/ppdb',
    keywords: ['ppdb', 'registration', 'admission', 'enrollment']
  },
  {
    id: 'schools',
    title: 'Schools',
    description: 'Manage school settings',
    icon: Building,
    category: 'System',
    path: '/school',
    keywords: ['school', 'institution', 'settings', 'profile']
  },
  {
    id: 'school-profile',
    title: 'School Profile',
    description: 'Edit school information',
    icon: Settings,
    category: 'System',
    path: '/school/profile',
    keywords: ['profile', 'settings', 'information', 'details']
  }
]

const quickActions = computed(() => [
  searchItems[0], // Teachers
  searchItems[1], // Students  
  searchItems[4], // Exams
  searchItems[2], // Subjects
])

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return searchItems.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.keywords.some(keyword => keyword.includes(query))
  )
})

const groupedResults = computed(() => {
  const groups: Record<string, SearchItem[]> = {}
  
  filteredResults.value.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
  })
  
  return groups
})

const allResults = computed(() => {
  return searchQuery.value ? filteredResults.value : quickActions.value
})

const getGlobalIndex = (categoryName: string, localIndex: number): number => {
  let globalIndex = 0
  const categories = Object.keys(groupedResults.value)
  
  for (const category of categories) {
    if (category === categoryName) {
      return globalIndex + localIndex
    }
    globalIndex += groupedResults.value[category].length
  }
  
  return localIndex
}

const closeSearch = () => {
  emit('close')
  searchQuery.value = ''
  selectedIndex.value = 0
}

const selectItem = (item: SearchItem) => {
  router.push(item.path)
  closeSearch()
}

const selectResult = () => {
  const results = allResults.value
  if (results[selectedIndex.value]) {
    selectItem(results[selectedIndex.value])
  }
}

const navigateDown = () => {
  const maxIndex = allResults.value.length - 1
  selectedIndex.value = selectedIndex.value < maxIndex ? selectedIndex.value + 1 : 0
}

const navigateUp = () => {
  const maxIndex = allResults.value.length - 1
  selectedIndex.value = selectedIndex.value > 0 ? selectedIndex.value - 1 : maxIndex
}

// Focus input when opened
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})

// Reset state when closed
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = ''
    selectedIndex.value = 0
  }
})

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    if (!props.isOpen) {
      emit('close') // This will be handled by parent to open
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
