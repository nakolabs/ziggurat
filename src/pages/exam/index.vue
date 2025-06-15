<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Search, Edit, Trash2, Eye, Users, Play, CirclePlus } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import CreateExamModal from '@/components/CreateExamModal.vue'
import DataTable from '@/components/DataTable.vue'
import type { Exam, ListExamResponse } from '@/types/exam'
import { examService } from '@/services/examService'
import { useAuth } from '@/stores/useAuth'
import type { TableColumn, DropdownAction } from '@/types/table'

const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedExam = ref<Exam | null>(null)
const statusFilter = ref('')

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
}

const examColumns: TableColumn[] = [
  {
    key: 'name',
    title: 'Title',
    width: '300px',
  },
  {
    key: 'subject_name',
    title: 'Subject',
    width: '120px',
  },
  {
    key: 'exam_date',
    title: 'Exam Date',
    width: '120px',
  },
  {
    key: 'duration',
    title: 'Duration',
    width: '100px',
  },
  {
    key: 'status',
    title: 'Status',
    width: '100px',
  },
]

const examDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Details',
    icon: Eye,
    handler: (exam: Exam) => viewExam(exam),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    handler: (exam: Exam) => editExam(exam),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'participants',
    label: 'View Participants',
    icon: Users,
    handler: (exam: Exam) => viewParticipants(exam),
    class: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'start',
    label: 'Start Exam',
    icon: Play,
    handler: (exam: Exam) => startExam(exam),
    class: 'text-orange-600 dark:text-orange-400',
    condition: (exam: Exam) => exam.status === 'published',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    handler: (exam: Exam) => deleteExam(exam.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

const { data, isFetching, execute } = examService
  .getExams({
    school_id: useAuth().schoolId(),
    page: 1,
    page_size: 100,
    order_by: 'created_at',
    order: 'desc',
  })
  .json<ListExamResponse>()

function editExam(exam: Exam) {
  selectedExam.value = exam
  showEditModal.value = true
}

function viewExam(exam: Exam) {
  selectedExam.value = exam
  showViewModal.value = true
}

function viewParticipants(exam: Exam) {
  console.log('View participants for exam:', exam.id)
}

function startExam(exam: Exam) {
  console.log('Start exam:', exam.id)
}

const deleteExam = async (examId: string) => {
  if (confirm('Are you sure you want to delete this exam?')) {
    try {
      await examService.deleteExam(examId)
      execute()
      console.log('Exam deleted successfully')
    } catch (error) {
      console.error('Failed to delete exam:', error)
    }
  }
}

const handleExamCreated = () => {
  execute()
  console.log('Exam created successfully')
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

// Computed statistics
const totalExams = computed(() => data.value?.data?.length || 0)
const publishedCount = computed(() => 
  data.value?.data?.filter((exam: Exam) => exam.status === 'published').length || 0
)
const draftCount = computed(() => 
  data.value?.data?.filter((exam: Exam) => exam.status === 'draft').length || 0
)
const completedCount = computed(() => 
  data.value?.data?.filter((exam: Exam) => exam.status === 'completed').length || 0
)

// Filtered exams based on search and filters
const filteredExams = computed(() => {
  let exams = data.value?.data || []
  
  if (searchQuery.value) {
    exams = exams.filter((exam: Exam) =>
      exam.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (exam.subject_name && exam.subject_name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }
  
  if (statusFilter.value) {
    exams = exams.filter((exam: Exam) => exam.status === statusFilter.value)
  }
  
  return exams
})
</script>

<template>
  <Dashboard>
    <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Page Title with Action Button -->
        <div class="flex items-center justify-between mb-8">
          <div>
          </div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
          >
            <CirclePlus class="w-4 h-4" />
            Create Exam
          </button>
        </div>

        <!-- Clean Statistics Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Exams</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ totalExams }}
                </p>
              </div>
              <CirclePlus class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Published</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ publishedCount }}
                </p>
              </div>
              <div class="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                <div class="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Draft</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ draftCount }}
                </p>
              </div>
              <div class="w-5 h-5 bg-yellow-100 dark:bg-yellow-900/30 rounded flex items-center justify-center">
                <div class="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ completedCount }}
                </p>
              </div>
              <div class="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                <div class="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search exams..."
                  class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </div>
            
            <div class="flex gap-3">
              <select
                v-model="statusFilter"
                class="px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Clean Data Table -->
        <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
          <DataTable
            :data="filteredExams"
            :columns="examColumns"
            :dropdown-actions="examDropdownActions"
            :use-dropdown-actions="true"
            :loading="isFetching"
            :show-actions="true"
            loading-text="Loading exams..."
            empty-text="No exams found"
          >
            <!-- Clean Title Cell -->
            <template #cell-name="{ value }">
              <div class="py-2">
                <div class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ value.length > 50 ? value.substring(0, 50) + '...' : value }}
                </div>
              </div>
            </template>

            <!-- Subject Badge -->
            <template #cell-subject_name="{ value }">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  {{ value || 'No Subject' }}
                </span>
              </div>
            </template>

            <!-- Status Badge -->
            <template #cell-status="{ value }">
              <span
                :class="statusColors[value as keyof typeof statusColors]"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ value.charAt(0).toUpperCase() + value.slice(1) }}
              </span>
            </template>

            <!-- Date Cell -->
            <template #cell-exam_date="{ value }">
              <div class="text-sm text-gray-900 dark:text-white">
                {{ formatDate(value) }}
              </div>
            </template>

            <!-- Duration Cell -->
            <template #cell-duration="{ value }">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ value }} min
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateExamModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleExamCreated"
    />
  </Dashboard>
</template>
