<template>
  <Dashboard>
    <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Page Title with Action Button -->
        <div class="flex items-center justify-between mb-8">
          <div></div>
          <button
            @click="router.push('/school/create')"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
          >
            <CirclePlus class="w-4 h-4" />
            Add School
          </button>
        </div>

        <!-- Clean Statistics Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ totalSchools }}
                </p>
              </div>
              <Building class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Students</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ totalStudents.toLocaleString() }}
                </p>
              </div>
              <Users class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Teachers</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ totalTeachers.toLocaleString() }}
                </p>
              </div>
              <GraduationCap class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Active</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ activeSchools }}
                </p>
              </div>
              <TrendingUp class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <!-- Minimalist Search and Filters -->
        <div
          class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6 mb-6"
        >
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search schools..."
                  class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                  @input="onSearchInput"
                />
              </div>
            </div>
            <div class="flex gap-3">
              <select
                v-model="levelFilter"
                @change="handleFilterChange"
                class="px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              >
                <option value="">All Levels</option>
                <option value="elementary">Elementary</option>
                <option value="junior">Junior High</option>
                <option value="senior">Senior High</option>
                <option value="college">University</option>
              </select>
              <select
                v-model="statusFilter"
                @change="handleFilterChange"
                class="px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Clean Data Table -->
        <div
          class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
        >
          <DataTable
            :data="filteredData"
            :columns="columns"
            :loading="isFetching"
            :show-actions="false"
            :clickable-rows="true"
            :show-pagination="true"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalItems"
            :page-size="pageSize"
            :sort-by="sortBy"
            :sort-order="sortOrder"
            loading-text="Loading schools..."
            empty-text="No schools found"
            @row-click="handleRowClick"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
            @sort="handleSort"
          >
            <!-- Clean School Cell -->
            <template #cell-school="{ item }">
              <div class="flex items-center gap-3 py-2">
                <div
                  class="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0"
                >
                  <img
                    v-if="item.logo"
                    :src="item.logo"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-gray-600 dark:text-gray-400 font-medium text-xs">
                    {{ item.name?.charAt(0) || 'S' }}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.city || 'Location not specified' }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Simplified Level Badge -->
            <template #cell-level="{ value }">
              <span :class="getLevelColor(value)" class="px-2 py-1 text-xs font-medium rounded-md">
                {{ formatLevel(value) }}
              </span>
            </template>

            <!-- Clean Stats Display -->
            <template #cell-stats="{ item }">
              <div class="text-xs">
                <div class="text-gray-900 dark:text-white font-medium mb-0.5">
                  {{ (item.student_count || 0).toLocaleString() }} students
                </div>
                <div class="text-gray-500 dark:text-gray-400">
                  {{ item.teacher_count || 0 }} teachers
                </div>
              </div>
            </template>

            <!-- Minimal Status Indicator -->
            <template #cell-status="{ value }">
              <div class="flex items-center gap-2">
                <div :class="getStatusDotColor(value)" class="w-1.5 h-1.5 rounded-full"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">{{
                  formatStatus(value)
                }}</span>
              </div>
            </template>

            <!-- Clean Date Format -->
            <template #cell-created_at="{ value }">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(value) }}
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
import DataTable from '@/components/DataTable.vue'
import {
  CirclePlus,
  Search,
  Building,
  Users,
  GraduationCap,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MapPin,
} from 'lucide-vue-next'
import type { TableColumn, DropdownAction } from '@/types/table'
import { useRouter } from 'vue-router'
import type { ListSchoolResponse, School } from '@/types/school'
import { MoreVertical } from 'lucide-vue-next'

const router = useRouter()

// Search and filter states
const searchQuery = ref('')
const levelFilter = ref('')
const statusFilter = ref('')

// Pagination states
const currentPage = ref(1)
const pageSize = ref(10)
const sortBy = ref('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Computed API URL with pagination parameters
const apiUrl = computed(() => {
  const params = new URLSearchParams({
    page_num: currentPage.value.toString(),
    page_size: pageSize.value.toString(),
    order_by: sortBy.value,
    order: sortOrder.value,
    search_by: 'name',
  })

  if (searchQuery.value) {
    params.append('search', searchQuery.value)
  }

  if (levelFilter.value) {
    params.append('level', levelFilter.value)
  }

  if (statusFilter.value) {
    params.append('status', statusFilter.value)
  }

  return `/api/v1/school?${params.toString()}`
})

const { data, isFetching, execute: refetch } = useApi<ListSchoolResponse>(apiUrl).json()

// Table columns with simplified design
const columns: TableColumn[] = [
  {
    key: 'school',
    title: 'School',
    width: '300px',
  },
  {
    key: 'level',
    title: 'Level',
    width: '150px',
  },
  {
    key: 'stats',
    title: 'Stats',
    width: '180px',
  },
  {
    key: 'status',
    title: 'Status',
    width: '120px',
  },
  {
    key: 'created_at',
    title: 'Created',
    width: '120px',
  },
]

// Computed properties for filtering and statistics
const filteredData = computed(() => {
  return data.value?.data || []
})

const totalPages = computed(() => {
  return data.value?.meta?.pagination?.total_page || 1
})

const totalItems = computed(() => {
  return data.value?.meta?.pagination?.total_data || 0
})

const totalSchools = computed(() => totalItems.value)
const totalStudents = computed(
  () => data.value?.data?.reduce((sum, school) => sum + (school.student_count || 0), 0) || 0,
)
const totalTeachers = computed(
  () => data.value?.data?.reduce((sum, school) => sum + (school.teacher_count || 0), 0) || 0,
)
const activeSchools = computed(
  () => data.value?.data?.filter((school) => (school.status || 'active') === 'active').length || 0,
)

// Search with debounce
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const onSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refetch()
  }, 300)
}

const handleFilterChange = () => {
  currentPage.value = 1
  refetch()
}

const handleSort = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key
  sortOrder.value = order
  currentPage.value = 1
  refetch()
}

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page
  refetch()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // Reset to first page when changing page size
  refetch()
}

// Row click handler
const handleRowClick = (school: any) => {
  router.push(`/school/${school.id}`)
}

// Utility functions
const formatLevel = (level: string) => {
  if (!level) return 'Unknown'

  const levelMap: Record<string, string> = {
    elementary: 'Elementary',
    junior: 'Junior High',
    senior: 'Senior High',
    college: 'University',
  }

  return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1)
}

const getLevelColor = (level: string) => {
  const colorMap: Record<string, string> = {
    elementary: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    junior: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    senior: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    college: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  }

  return colorMap[level] || 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
}

const formatStatus = (status: string) => {
  return (status || 'active').charAt(0).toUpperCase() + (status || 'active').slice(1)
}

const getStatusDotColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'bg-green-500',
    inactive: 'bg-red-500',
    pending: 'bg-yellow-500',
  }

  return colorMap[status || 'active'] || 'bg-gray-500'
}

const formatDate = (timestamp: string | number) => {
  if (!timestamp) return 'Unknown'

  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Menu state
const openMenuId = ref<string | null>(null)

const toggleMenu = (schoolId: string) => {
  openMenuId.value = openMenuId.value === schoolId ? null : schoolId
}

// Close menu when clicking outside
const closeMenu = () => {
  openMenuId.value = null
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
/* Minimal custom styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
