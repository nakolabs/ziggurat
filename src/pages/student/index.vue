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
            Add Student
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
                  {{ data?.meta?.pagination?.total_data || 0 }}
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
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Verified</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ verifiedStudents }}
                </p>
              </div>
              <UserCheck class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ pendingStudents }}
                </p>
              </div>
              <Clock class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Active</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ activeStudents }}
                </p>
              </div>
              <TrendingUp class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <!-- Enhanced Search and Filters -->
        <div
          class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6 mb-6"
        >
          <div class="space-y-4">
            <!-- Search Row -->
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  id="student-search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search students by name or email..."
                  class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                  @keyup.enter="handleSearch"
                />
              </div>
            </div>

            <!-- Filter Row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- Grade Filter -->
              <div class="flex-1">
                <select
                  id="grade-filter"
                  v-model="gradeFilter"
                  @change="handleFilterChange"
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                >
                  <option value="">All Grades</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <!-- Verification Filter -->
              <div class="flex-1">
                <select
                  id="verification-filter"
                  v-model="verificationFilter"
                  @change="handleFilterChange"
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                >
                  <option value="">All Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
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
        <div
          class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
        >
          <DataTable
            :data="data?.data || []"
            :columns="studentColumns"
            :loading="isFetching"
            :show-actions="false"
            :clickable-rows="true"
            :show-pagination="true"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalItems"
            :page-size="pageSize"
            loading-text="Loading students..."
            empty-text="No students found"
            @row-click="handleRowClick"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          >
            <!-- Clean Student Cell -->
            <template #cell-student="{ item }">
              <div class="flex items-center gap-3 py-2">
                <div
                  class="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-gray-600 dark:text-gray-400 font-medium text-xs">
                    {{ item.name?.charAt(0) || 'S' }}
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
                :class="
                  value
                    ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                "
                class="px-2 py-1 text-xs font-medium rounded-md"
              >
                {{ value ? 'Verified' : 'Pending' }}
              </span>
            </template>

            <!-- Clean Grade Display -->
            <template #cell-grade="{ value }">
              <span
                class="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md"
              >
                Grade {{ value }}
              </span>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Invite Student Modal -->
      <InviteStudentModal
        v-if="showInviteModal"
        :loading="inviteLoading"
        :error="inviteErrorMsg"
        :success="inviteSuccessMsg"
        :email="inviteForm.email"
        :grade="inviteForm.grade"
        @update:email="inviteForm.email = $event"
        @update:grade="inviteForm.grade = $event"
        @close="closeInviteModal"
        @submit="inviteStudent"
      />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
import InviteStudentModal from '@/components/InviteStudentModal.vue'
import SearchInput from '@/components/forms/SearchInput.vue'
import DataTable from '@/components/DataTable.vue'
import { useAuth } from '@/stores/useAuth.ts'
import type { TableColumn, DropdownAction } from '@/types/table'
import {
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Award,
  SquarePlus,
  CirclePlus,
  Search,
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  X,
} from 'lucide-vue-next'

const auth = useAuth()
const router = useRouter()

// Reactive state
const searchQuery = ref('')
const gradeFilter = ref('')
const verificationFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showInviteModal = ref(false)

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return gradeFilter.value || verificationFilter.value
})

// Clear all filters
const clearFilters = () => {
  gradeFilter.value = ''
  verificationFilter.value = ''
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

  if (gradeFilter.value) {
    params.append('grade', gradeFilter.value)
  }

  if (verificationFilter.value) {
    params.append('is_verified', verificationFilter.value)
  }

  return `/api/v1/student?${params.toString()}`
})

// API call
const { data, isFetching, error, execute: refetch } = useApi(apiUrl).json()

// Enhanced search handler
const handleSearch = () => {
  currentPage.value = 1
  refetch()
}

// Debounce logic for search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
function onSearchInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refetch()
  }, 500)
}

// Methods
const handleFilterChange = () => {
  currentPage.value = 1
  refetch()
}

// Computed statistics
const verifiedStudents = computed(
  () => data.value?.data?.filter((student) => student.is_verified).length || 0,
)

const pendingStudents = computed(
  () => data.value?.data?.filter((student) => !student.is_verified).length || 0,
)

const activeStudents = computed(() => data.value?.data?.length || 0)

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

// Row click handler - navigate to student detail
const handleRowClick = (student: any) => {
 router.push('/student/' + student.id)
}

// Modal state and form
const inviteForm = ref({ email: '', grade: '' })
const inviteLoading = ref(false)
const inviteErrorMsg = ref('')
const inviteSuccessMsg = ref('')

function closeInviteModal() {
  showInviteModal.value = false
  inviteForm.value = { email: '', grade: '' }
  inviteErrorMsg.value = ''
  inviteSuccessMsg.value = ''
}

async function inviteStudent() {
  inviteErrorMsg.value = ''
  inviteSuccessMsg.value = ''

  if (!inviteForm.value.email.trim() || !inviteForm.value.grade) {
    inviteErrorMsg.value = 'Email and grade are required'
    return
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inviteForm.value.email)) {
    inviteErrorMsg.value = 'Invalid email address'
    return
  }

  inviteLoading.value = true
  try {
    const school_id = auth.get()?.payload.user.school_id
    const { data } = await useApi('/api/v1/student/invite', {
      method: 'POST',
      body: JSON.stringify({
        school_id,
        emails: [inviteForm.value.email.trim()],
        grade: inviteForm.value.grade,
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

watch(apiUrl, () => {
  if (!searchTimeout) {
    refetch()
  }
})

// Updated table columns to match teacher page style
const studentColumns: TableColumn[] = [
  {
    key: 'student',
    title: 'Student',
    width: '250px',
  },
  {
    key: 'grade',
    title: 'Grade',
    width: '100px',
  },
  {
    key: 'is_verified',
    title: 'Status',
    width: '110px',
  },
]

const studentDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Profile',
    icon: Eye,
    handler: (student: any) => viewStudent(student),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    handler: (student: any) => editStudent(student),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'exams',
    label: 'View Exams',
    icon: BookOpen,
    handler: (student: any) => viewStudentExams(student),
    class: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'results',
    label: 'View Results',
    icon: Award,
    handler: (student: any) => viewStudentResults(student),
    class: 'text-orange-600 dark:text-orange-400',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    handler: (student: any) => deleteStudent(student.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

function viewStudent(student: any) {
  // TODO: Implement view functionality
  console.log('View student:', student)
}

function editStudent(student: any) {
  // TODO: Implement edit functionality
  console.log('Edit student:', student)
}

function viewStudentExams(student: any) {
  // TODO: Implement exam view functionality
  console.log('View exams for student:', student)
}

function viewStudentResults(student: any) {
  // TODO: Implement results view functionality
  console.log('View results for student:', student)
}

async function deleteStudent(studentId: string) {
  if (confirm('Are you sure you want to delete this student?')) {
    try {
      // TODO: Implement delete API call
      console.log('Delete student:', studentId)
    } catch (error) {
      console.error('Failed to delete student:', error)
    }
  }
}
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
