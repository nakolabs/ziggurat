<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold">Exam Results</h1>
          <p class="text-neutral-400">View and manage exam results and grades</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="exportResults"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <Download class="w-4 h-4" />
            Export Results
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <SearchInput
              v-model="searchQuery"
              placeholder="Search by exam name or student..."
              @input="onSearchInput"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="examFilter"
              @change="handleFilterChange"
              class="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
            >
              <option value="">All Exams</option>
              <option v-for="exam in availableExams" :key="exam.id" :value="exam.id">
                {{ exam.name }}
              </option>
            </select>
            <select
              v-model="gradeFilter"
              @change="handleFilterChange"
              class="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
            >
              <option value="">All Grades</option>
              <option value="A">Grade A (90-100)</option>
              <option value="B">Grade B (80-89)</option>
              <option value="C">Grade C (70-79)</option>
              <option value="D">Grade D (60-69)</option>
              <option value="F">Grade F (0-59)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <DataTable
        :columns="resultColumns"
        :data="resultsData"
        :loading="isFetching"
        :dropdown-actions="resultActions"
        empty-message="No exam results found"
      >
        <template #cell-score="{ value }">
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ value }}%</span>
            <span :class="getGradeColor(value)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getLetterGrade(value) }}
            </span>
          </div>
        </template>
        <template #cell-status="{ value }">
          <span
            :class="
              value === 'graded'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            "
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ value === 'graded' ? 'Graded' : 'Pending' }}
          </span>
        </template>
        <template #cell-submitted_at="{ value }">
          {{ value ? new Date(value).toLocaleString() : 'Not submitted' }}
        </template>
      </DataTable>

      <!-- Grade Modal -->
      <GradeModal
        v-if="showGradeModal && selectedResult"
        :result="selectedResult"
        :loading="grading"
        @close="closeGradeModal"
        @submit="handleGradeSubmit"
      />
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Download, Eye, Edit, Award } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import DataTable from '@/components/DataTable.vue'
import SearchInput from '@/components/SearchInput.vue'
import GradeModal from '@/components/exam/GradeModal.vue'
import { examService } from '@/services/examService'
import { useAuth } from '@/stores/useAuth'
import { useApi } from '@/stores/useApi'
import type { TableColumn, DropdownAction } from '@/types/table'

const auth = useAuth()

// Reactive state
const searchQuery = ref('')
const examFilter = ref('')
const gradeFilter = ref('')
const showGradeModal = ref(false)
const selectedResult = ref<any>(null)
const grading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// Computed URL for API call
const apiUrl = computed(() => {
  const params = new URLSearchParams({
    school_id: auth.schoolId(),
    page: currentPage.value.toString(),
    page_size: pageSize.value.toString(),
  })

  if (searchQuery.value) {
    params.append('search', searchQuery.value)
  }

  if (examFilter.value) {
    params.append('exam_id', examFilter.value)
  }

  if (gradeFilter.value) {
    params.append('grade_filter', gradeFilter.value)
  }

  return `/api/v1/exam/results?${params.toString()}`
})

// API calls
const { data, isFetching, error, execute: refetch } = useApi(apiUrl).json()
const resultsData = computed(() => data.value?.data || [])

const { data: examsData } = useApi(`/api/v1/exam?school_id=${auth.schoolId()}`).json()
const availableExams = computed(() => examsData.value?.data || [])

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

const getLetterGrade = (score: number) => {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

const getGradeColor = (score: number) => {
  const grade = getLetterGrade(score)
  switch (grade) {
    case 'A':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'B':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'C':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'D':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'F':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const viewResult = (result: any) => {
  selectedResult.value = result
  // TODO: Implement detailed result view
  console.log('View result:', result)
}

const gradeResult = (result: any) => {
  selectedResult.value = result
  showGradeModal.value = true
}

const handleGradeSubmit = async (gradeData: any) => {
  grading.value = true
  try {
    await examService
      .gradeExam(selectedResult.value.exam_id, selectedResult.value.student_id, gradeData.score)
      .json()
    closeGradeModal()
    refetch()
  } catch (error) {
    console.error('Failed to grade exam:', error)
  } finally {
    grading.value = false
  }
}

const closeGradeModal = () => {
  showGradeModal.value = false
  selectedResult.value = null
}

const exportResults = async () => {
  try {
    // TODO: Implement export functionality
    console.log('Export results')
  } catch (error) {
    console.error('Failed to export results:', error)
  }
}

// Table configuration
const resultColumns: TableColumn[] = [
  { key: 'exam_name', title: 'Exam' },
  { key: 'student_name', title: 'Student' },
  { key: 'score', title: 'Score' },
  { key: 'status', title: 'Status' },
  { key: 'submitted_at', title: 'Submitted At' },
]

const resultActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Details',
    icon: Eye,
    handler: (result: any) => viewResult(result),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'grade',
    label: 'Grade/Edit',
    icon: Award,
    handler: (result: any) => gradeResult(result),
    class: 'text-green-600 dark:text-green-400',
    condition: (result: any) => result.status !== 'graded',
  },
]

watch(apiUrl, () => {
  if (!searchTimeout) {
    refetch()
  }
})
</script>
