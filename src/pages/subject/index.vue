<template>
  <Dashboard>
    <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Page Title with Action Button -->
        <div class="flex items-center justify-between mb-8">
          <div></div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
          >
            <CirclePlus class="w-4 h-4" />
            Add Subject
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
                  {{ totalItems }}
                </p>
              </div>
              <Book class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Active</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ totalItems }}
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
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Recent</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ recentSubjects }}
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
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Growth</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">+12%</p>
              </div>
              <TrendingUp class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <!-- Enhanced Search and Filters -->
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
                  placeholder="Search subjects by name..."
                  class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <div class="flex gap-3">
              <select
                v-model="categoryFilter"
                @change="handleFilterChange"
                class="px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              >
                <option value="">All Categories</option>
                <option value="science">Science</option>
                <option value="math">Mathematics</option>
                <option value="language">Language</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Clean Data Table -->
        <div
          class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
        >
          <DataTable
            :data="subjects"
            :columns="subjectColumns"
            :loading="loading"
            :show-actions="false"
            :clickable-rows="true"
            :show-pagination="true"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalItems"
            :page-size="pageSize"
            @row-click="(subject) => router.push('/subject/' + subject.id)"
            loading-text="Loading subjects..."
            empty-text="No subjects found"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          >
            <!-- Clean Subject Cell -->
            <template #cell-name="{ item }">
              <div class="flex items-center gap-3 py-2">
                <div
                  class="w-8 h-8 rounded-lg overflow-hidden bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0"
                >
                  <Book class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Subject</div>
                </div>
              </div>
            </template>

            <template #cell-teachers="{ item }">
              <div class="flex flex-wrap gap-1">
                <span
                  v-if="!item.teachers || item.classes.teachers === 0"
                  class="text-xs text-gray-400 dark:text-gray-500"
                >
                  No teacher assigned
                </span>
                <span
                  v-else
                  v-for="teacherItem in item.teachers.slice(0, 2)"
                  :key="teacherItem.id"
                  class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-md"
                >
                  {{ teacherItem.name }}
                </span>
                <span
                  v-if="item.teachers && item.classes.teachers > 2"
                  class="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 rounded-md"
                >
                  +{{ item.classes.length - 2 }}
                </span>
              </div>
            </template>

            <!-- Clean Date Display -->
            <template #cell-created_at="{ value }">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(value) }}
              </span>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Create Subject Modal -->
      <BaseModal
        v-if="showCreateModal"
        title="Add New Subject"
        description="Create a new subject for your school"
        submit-text="Create Subject"
        :loading="creating"
        :fields="modalFields"
        @close="closeCreateModal"
        @submit="createSubject"
        @update:field="updateField"
      />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import {
  Edit,
  Trash2,
  Eye,
  CirclePlus,
  Search,
  Book,
  UserCheck,
  Clock,
  TrendingUp,
} from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import SearchInput from '@/components/forms/SearchInput.vue'
import DataTable from '@/components/DataTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useApi } from '@/stores/useApi.ts'
import { useAuth } from '@/stores/useAuth'
import type { TableColumn, DropdownAction } from '@/types/table'
import { useRouter } from 'vue-router'

const router = useRouter()
const schoolID = useAuth().get()?.payload.user.school_id || ''
const searchQuery = ref('')
const categoryFilter = ref('')
const showCreateModal = ref(false)

// Pagination state
const currentPage = ref(1)
const pageSize = ref(10)

// Build API URL with pagination and filters
const apiUrl = computed(() => {
  const params = new URLSearchParams({
    school_id: schoolID,
    page: currentPage.value.toString(),
    limit: pageSize.value.toString(),
  })

  if (searchQuery.value.trim()) {
    params.append('search', searchQuery.value.trim())
  }

  if (categoryFilter.value) {
    params.append('category', categoryFilter.value)
  }

  return `/api/v1/subject?${params.toString()}`
})

// Fetch subjects with pagination
const { data, isFetching: loading, error, execute: refetch } = useApi(apiUrl).json()

const subjects = computed(() => data.value?.data || [])

// Pagination computed properties
const totalPages = computed(() => {
  return data.value?.meta?.pagination?.total_page || 1
})

const totalItems = computed(() => {
  return data.value?.meta?.pagination?.total_data || 0
})

// Computed properties for statistics
const recentSubjects = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return subjects.value.filter((subject) => new Date(subject.created_at) > oneWeekAgo).length
})

// Search debounce logic
let searchTimeout: NodeJS.Timeout | null = null

const handleFilterChange = () => {
  currentPage.value = 1
  refetch()
}

// Watch for search query changes and debounce API calls
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refetch()
    searchTimeout = null
  }, 300)
})

// Watch for API URL changes
watch(apiUrl, () => {
  if (!searchTimeout) {
    refetch()
  }
})

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page
  refetch()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  refetch()
}

const newSubject = ref({
  name: '',
  school_id: schoolID,
})

const modalFields = computed(() => [
  {
    key: 'name',
    label: 'Subject Name',
    value: newSubject.value.name,
    type: 'text',
    placeholder: 'Enter subject name',
    required: true,
  },
])

const creating = ref(false)

const subjectColumns: TableColumn[] = [
  {
    key: 'name',
    title: 'Subject',
    width: '300px',
  },
  {
    key: 'teachers',
    title: 'Teacher',
    width: '200px',
    render: (subject: any) => {
      return subject.teacher || 'No teacher assigned'
    },
  },
  {
    key: 'classes_count',
    title: 'Classes',
    width: '100px',
    render: (subject: any) => {
      return subject.classes_count || 0
    },
  },
  {
    key: 'students_count',
    title: 'Students',
    width: '100px',
    render: (subject: any) => {
      return subject.students_count || 0
    },
  },
  {
    key: 'created_at',
    title: 'Created',
    width: '150px',
  },
]

function viewSubject(subject: any) {
  // TODO: Implement view functionality
  console.log('View subject:', subject)
}

function editSubject(subject: any) {
  // TODO: Implement edit functionality
  console.log('Edit subject:', subject)
}

async function deleteSubject(subjectId: string) {
  if (confirm('Are you sure you want to delete this subject?')) {
    try {
      const { data } = await useApi(`/api/v1/subject/${subjectId}`, {
        method: 'DELETE',
      }).json()

      if (data.value.code === 200) {
        // Refresh the subjects list after successful deletion
        await refetch()
      } else {
        console.error('Error deleting subject:', data.value.message)
        alert('Failed to delete subject: ' + data.value.message)
      }
    } catch (error) {
      console.error('Failed to delete subject:', error)
      alert('Failed to delete subject. Please try again.')
    }
  }
}

function updateField(update: { key: string; value: string }) {
  if (update.key === 'name') {
    newSubject.value.name = update.value
  }
}

function closeCreateModal() {
  showCreateModal.value = false
  newSubject.value.name = ''
}

async function createSubject() {
  if (!newSubject.value.name.trim()) return

  creating.value = true
  try {
    const { data } = await useApi('/api/v1/subject', {
      method: 'POST',
      body: JSON.stringify(newSubject.value),
    }).json()

    if (data.value.code !== 200) {
      console.error('Error creating subject:', data.value.message)
      alert('Failed to create subject: ' + data.value.message)
      return
    }

    // Refresh the subjects list
    await refetch()

    // Close modal and reset form
    closeCreateModal()
  } catch (error) {
    console.error('Failed to create subject:', error)
    alert('Failed to create subject. Please try again.')
  } finally {
    creating.value = false
  }
}

// Filtered subjects based on search
const filteredSubjects = computed(() => {
  if (!searchQuery.value.trim()) return subjects.value

  const query = searchQuery.value.toLowerCase()
  return subjects.value.filter((subject) => subject.name.toLowerCase().includes(query))
})

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
