<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { Plus, Search, Edit, Trash2, Eye, Users, Play, CirclePlus } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import CreateExamModal from '@/components/CreateExamModal.vue'
import DataTable from '@/components/DataTable.vue'
import SearchInput from '@/components/forms/SearchInput.vue'
import type { Exam, ListExamResponse } from '@/types/exam'
import { examService } from '@/services/examService'
import { useAuth } from '@/stores/useAuth'
import { useApi } from '@/stores/useApi.ts'
import type { TableColumn, DropdownAction } from '@/types/table'

const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedExam = ref<Exam | null>(null)
const currentPage = ref(1)
const sortBy = ref('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')
const statusFilter = ref('')
const pageSize = ref(10)

const { data, isFetching, execute } = examService
  .getExams({
    school_id: useAuth().schoolId(),
    page: currentPage.value,
    page_size: 10,
    order_by: sortBy.value,
    order: sortOrder.value,
  })
  .json<ListExamResponse>()

const filteredExams = computed(() => {
  if (!data.value?.data) return []

  return data.value.data.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      exam.subject_name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const totalPages = computed(() => {
  return data.value?.meta?.pagination.total_page || 1
})

const editExam = (exam: Exam) => {
  selectedExam.value = exam
  showEditModal.value = true
}

const viewExam = (exam: Exam) => {
  selectedExam.value = exam
  showViewModal.value = true
}

const viewStudents = (exam: Exam) => {
  // Navigate to exam students page
  // You can implement this using router navigation
  console.log('View students for exam:', exam.id)
}

const handleDeleteExam = async (examId: string) => {
  if (confirm('Are you sure you want to delete this exam?')) {
    const success = await examService.deleteExam(examId)
    if (success) {
      execute()
    }
  }
}

const handleExamCreated = () => {
  execute()
}

const handleSort = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key
  sortOrder.value = order
  execute()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  execute()
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

// Computed URL for API call
const apiUrl = computed(() => {
  const params = new URLSearchParams({
    school_id: useAuth().schoolId(),
    page: currentPage.value.toString(),
    limit: pageSize.value.toString(),
  })

  if (searchQuery.value) {
    params.append('search', searchQuery.value)
    params.append('search_by', 'title')
    params.append('search_by', 'subject')
  }

  if (statusFilter.value) {
    params.append('status', statusFilter.value)
  }

  return `/api/v1/exam?${params.toString()}`
})

// API call
const { data: apiData, isFetching: apiIsFetching, error, execute: refetch } = useApi(apiUrl).json()

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

watch(apiUrl, () => {
  if (!searchTimeout) {
    refetch()
  }
})

const examColumns: TableColumn[] = [
  { key: 'name', title: 'Title' },
  { key: 'subject_name', title: 'Subject' },
  { key: 'exam_date', title: 'Exam Date' },
  { key: 'duration', title: 'Duration (min)' },
  { key: 'status', title: 'Status' },
]

const examDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Details',
    icon: Eye,
    handler: (exam: any) => viewExam(exam),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    handler: (exam: any) => editExam(exam),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'participants',
    label: 'View Participants',
    icon: Users,
    handler: (exam: any) => viewParticipants(exam),
    class: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'start',
    label: 'Start Exam',
    icon: Play,
    handler: (exam: any) => startExam(exam),
    class: 'text-orange-600 dark:text-orange-400',
    condition: (exam: any) => exam.status === 'published',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    handler: (exam: any) => deleteExam(exam.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

function viewParticipants(exam: any) {
  // TODO: Implement participants view
  console.log('View participants for exam:', exam)
}

function startExam(exam: any) {
  // TODO: Implement start exam functionality
  console.log('Start exam:', exam)
}

async function deleteExam(examId: string) {
  if (confirm('Are you sure you want to delete this exam?')) {
    try {
      // TODO: Implement delete API call
      console.log('Delete exam:', examId)
    } catch (error) {
      console.error('Failed to delete exam:', error)
    }
  }
}
</script>

<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold">Exams</h1>
          <p class="text-neutral-400">Manage and create exams for your school</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <CirclePlus />
          Create Exam
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <SearchInput
              v-model="searchQuery"
              placeholder="Search exams by title or subject..."
              @input="onSearchInput"
            />
          </div>
          <select
            v-model="statusFilter"
            @change="handleFilterChange"
            class="px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <!-- Exams DataTable -->
      <DataTable
        :data="data?.data || []"
        :columns="examColumns"
        :dropdown-actions="examDropdownActions"
        :use-dropdown-actions="true"
        :loading="isFetching"
        :show-actions="true"
        loading-text="Loading exams..."
        empty-text="No exams found"
      >
        <template #cell-status="{ value }">
          <span
            :class="{
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
                value === 'draft',
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':
                value === 'published',
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300':
                value === 'completed',
            }"
            class="px-2 py-1 text-xs font-medium rounded-full capitalize"
          >
            {{ value }}
          </span>
        </template>
        <template #cell-exam_date="{ value }">
          {{ formatDate(value) }}
        </template>
      </DataTable>
    </div>

    <!-- Modals -->
    <CreateExamModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleExamCreated"
    />
  </Dashboard>
</template>
