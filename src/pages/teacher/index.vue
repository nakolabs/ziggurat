<template>
  <Dashboard>
    <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Page Title with Action Button -->
        <div class="flex items-center justify-between mb-8">
          <div></div>
          <button
            @click="showInviteModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
          >
            <CirclePlus class="w-4 h-4" />
            Add Teacher
          </button>
        </div>

        <!-- Clean Statistics Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ data?.meta?.pagination?.total_data || 0 }}
                </p>
              </div>
              <Users class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Verified</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ verifiedTeachers }}
                </p>
              </div>
              <UserCheck class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ pendingTeachers }}
                </p>
              </div>
              <Clock class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Active</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ activeTeachers }}
                </p>
              </div>
              <TrendingUp class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <!-- Enhanced Search and Filters -->
        <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6 mb-6">
          <div class="space-y-4">
            <!-- Search Row -->
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="teacher-search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search teachers by name or email..."
                  class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                  @keyup.enter="handleSearch"
                />
              </div>
              <button
                id="search-button"
                @click="handleSearch"
                class="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Search class="w-4 h-4" />
                Search
              </button>
            </div>

            <!-- Filters Row -->
            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Status Filter -->
              <div class="flex-1">
                <select
                  id="status-filter"
                  v-model="verificationFilter"
                  @change="handleFilterChange"
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                >
                  <option value="">All Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>

              <!-- Subject Filter -->
              <div class="flex-1">
                <select
                  id="subject-filter"
                  v-model="subjectFilter"
                  @change="handleFilterChange"
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                >
                  <option value="">All Subjects</option>
                  <option 
                    v-for="subject in availableSubjects" 
                    :key="subject.id" 
                    :value="subject.id"
                  >
                    {{ subject.name }}
                  </option>
                </select>
              </div>

              <!-- Class Filter -->
              <div class="flex-1">
                <select
                  id="class-filter"
                  v-model="classFilter"
                  @change="handleFilterChange"
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                >
                  <option value="">All Classes</option>
                  <option 
                    v-for="classItem in availableClasses" 
                    :key="classItem.id" 
                    :value="classItem.id"
                  >
                    {{ classItem.name }}
                  </option>
                </select>
              </div>

              <!-- Clear Filters Button -->
              <button
                v-if="hasActiveFilters"
                id="clear-filters-button"
                @click="clearFilters"
                class="px-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <X class="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Clean Data Table -->
        <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
          <DataTable
            :data="data?.data || []"
            :columns="teacherColumns"
            :loading="isFetching"
            :show-actions="false"
            :clickable-rows="true"
            :show-pagination="true"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalItems"
            :page-size="pageSize"
            loading-text="Loading teachers..."
            empty-text="No teachers found"
            @row-click="handleRowClick"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          >
            <!-- Clean Teacher Cell -->
            <template #cell-teacher="{ item }">
              <div class="flex items-center gap-3 py-2">
                <div class="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                  <span class="text-gray-600 dark:text-gray-400 font-medium text-xs">
                    {{ item.name?.charAt(0) || 'T' }}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.email }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Simplified Status Badge -->
            <template #cell-is_verified="{ value }">
              <span 
                :class="value ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'" 
                class="px-2 py-1 text-xs font-medium rounded-md"
              >
                {{ value ? 'Verified' : 'Pending' }}
              </span>
            </template>

            <!-- Clean Date Display -->
            <template #cell-created_at="{ value }">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(value) }}
              </span>
            </template>

            <!-- Subject Cell -->
            <template #cell-subjects="{ item }">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-if="!item.subjects || item.subjects.length === 0"
                  class="text-xs text-gray-400 dark:text-gray-500"
                >
                  No subjects assigned
                </span>
                <span 
                  v-else
                  v-for="subject in item.subjects.slice(0, 2)" 
                  :key="subject.id"
                  class="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md"
                >
                  {{ subject.name }}
                </span>
                <span 
                  v-if="item.subjects && item.subjects.length > 2"
                  class="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 rounded-md"
                >
                  +{{ item.subjects.length - 2 }}
                </span>
              </div>
            </template>

            <!-- Class Cell -->
            <template #cell-classes="{ item }">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-if="!item.classes || item.classes.length === 0"
                  class="text-xs text-gray-400 dark:text-gray-500"
                >
                  No classes assigned
                </span>
                <span 
                  v-else
                  v-for="classItem in item.classes.slice(0, 2)" 
                  :key="classItem.id"
                  class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-md"
                >
                  {{ classItem.name }}
                </span>
                <span 
                  v-if="item.classes && item.classes.length > 2"
                  class="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 rounded-md"
                >
                  +{{ item.classes.length - 2 }}
                </span>
              </div>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Invite Teacher Modal -->
      <InviteTeacherModal
        v-if="showInviteModal"
        :loading="inviteLoading"
        :error="inviteErrorMsg"
        :success="inviteSuccessMsg"
        :email="inviteForm.email"
        :name="inviteForm.name"
        :subject-ids="inviteForm.subjectIds"
        :class-ids="inviteForm.classIds"
        @update:email="inviteForm.email = $event"
        @update:name="inviteForm.name = $event"
        @update:subject-ids="inviteForm.subjectIds = $event"
        @update:class-ids="inviteForm.classIds = $event"
        @close="closeInviteModal"
        @submit="inviteTeacher"
      />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
import InviteTeacherModal from '@/components/InviteTeacherModal.vue'
import SearchInput from '@/components/forms/SearchInput.vue'
import DataTable from '@/components/DataTable.vue'
import { useAuth } from '@/stores/useAuth.ts'
import type { ListTeacherResponse, Teacher } from '@/types/teacher'
import type { TableColumn, DropdownAction } from '@/types/table'
import { UserPlus, Eye, Edit, Trash2, Circle, CirclePlus, Search, Users, UserCheck, Clock, TrendingUp, X } from 'lucide-vue-next'

const auth = useAuth()
const router = useRouter()

// Reactive state
const searchQuery = ref('')
const verificationFilter = ref('')
const subjectFilter = ref('')
const classFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showInviteModal = ref(false)

// Fetch available subjects and classes for filters
const schoolId = auth.get()?.payload.user.school_id

const { data: subjectsData } = useApi(`/api/v1/subject?school_id=${schoolId}`).json()
const { data: classesData } = useApi(`/api/v1/class?school_id=${schoolId}`).json()

const availableSubjects = computed(() => subjectsData.value?.data || [])
const availableClasses = computed(() => classesData.value?.data || [])

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return verificationFilter.value || subjectFilter.value || classFilter.value
})

// Clear all filters
const clearFilters = () => {
  verificationFilter.value = ''
  subjectFilter.value = ''
  classFilter.value = ''
  searchQuery.value = ''
  currentPage.value = 1
  refetch()
}

// Computed URL for API call
const apiUrl = computed(() => {
  const params = new URLSearchParams({
    school_id: auth.get()?.payload.user.school_id || '',
    page: currentPage.value.toString(),
    limit: pageSize.value.toString(),
  })

  params.append('search_by', 'name')
  params.append('search_by', 'email')

  if (searchQuery.value) {
    params.append('search', searchQuery.value)
  }

  if (verificationFilter.value) {
    params.append('is_verified', verificationFilter.value)
  }

  if (subjectFilter.value) {
    params.append('subject_id', subjectFilter.value)
  }

  if (classFilter.value) {
    params.append('class_id', classFilter.value)
  }

  return `/api/v1/teacher?${params.toString()}`
})

// API call
const { data, isFetching, error, execute: refetch } = useApi(apiUrl).json<ListTeacherResponse>()

// Enhanced search handler
const handleSearch = () => {
  currentPage.value = 1
  refetch()
}

// Methods
const handleFilterChange = () => {
  currentPage.value = 1
  refetch()
}

// Modal state and form
const inviteForm = ref({ 
  email: '', 
  name: '',
  subjectIds: [] as string[],
  classIds: [] as string[]
})
const inviteLoading = ref(false)
const inviteErrorMsg = ref('')
const inviteSuccessMsg = ref('')

function closeInviteModal() {
  showInviteModal.value = false
  inviteForm.value = { 
    email: '', 
    name: '',
    subjectIds: [],
    classIds: []
  }
  inviteErrorMsg.value = ''
  inviteSuccessMsg.value = ''
}

async function inviteTeacher() {
  inviteErrorMsg.value = ''
  inviteSuccessMsg.value = ''
  if (
    !inviteForm.value.email.trim() ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inviteForm.value.email)
  ) {
    inviteErrorMsg.value = !inviteForm.value.email.trim()
      ? 'Email is required'
      : 'Invalid email address'
    return
  }

  inviteLoading.value = true
  try {
    const school_id = auth.get()?.payload.user.school_id
    const { data } = await useApi('/api/v1/teacher/invite', {
      method: 'POST',
      body: JSON.stringify({
        school_id,
        teachers: [{
          email: inviteForm.value.email,
          name: inviteForm.value.name,
          subject_ids: inviteForm.value.subjectIds,
          class_ids: inviteForm.value.classIds,
        }],
      }),
    }).json()

    if (data.value.code !== 200) {
      inviteErrorMsg.value = data.value.message || 'Failed to send invite'
    } else {
      inviteSuccessMsg.value = 'Invitation sent!'
      setTimeout(() => {
        closeInviteModal()
        refetch()
      }, 1000)
    }
  } catch (e) {
    inviteErrorMsg.value = 'Network error'
  } finally {
    inviteLoading.value = false
  }
}

// Computed properties for statistics
const verifiedTeachers = computed(() => 
  data.value?.data?.filter(teacher => teacher.is_verified).length || 0
)

const pendingTeachers = computed(() => 
  data.value?.data?.filter(teacher => !teacher.is_verified).length || 0
)

const activeTeachers = computed(() => 
  data.value?.data?.length || 0
)

const totalPages = computed(() => {
  return data.value?.meta?.pagination?.total_page || 1
})

const totalItems = computed(() => {
  return data.value?.meta?.pagination?.total_data || 0
})

// Pagination and sorting handlers
const handlePageChange = (page: number) => {
  currentPage.value = page
  refetch()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  refetch()
}

// Row click handler - navigate to teacher detail
const handleRowClick = (teacher: Teacher) => {
  router.push(`/teacher/${teacher.id}`)
}

const formatDate = (timestamp: number | string) => {
  if (!timestamp) return '-'
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp)
  
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Updated table columns to include both subjects and classes
const teacherColumns: TableColumn[] = [
  {
    key: 'teacher',
    title: 'Teacher',
    width: '250px',
  },
  {
    key: 'subjects',
    title: 'Subject',
    width: '180px',
  },
  {
    key: 'classes',
    title: 'Class',
    width: '150px',
  },
  {
    key: 'is_verified',
    title: 'Status',
    width: '110px',
  },
  {
    key: 'created_at',
    title: 'Joined',
    width: '110px',
  },
]
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
