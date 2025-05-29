<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { Plus, Search, Edit, Trash2, Eye, Users, Calendar } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'

interface Exam {
  id: string
  name: string
  subject_name: string
  total_questions: number
  total_students: number
  graded_students: number
  created_at: number
  updated_at: number
}

const exams = ref<Exam[]>([])
const loading = ref(false)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedExam = ref<Exam | null>(null)

const fetchExams = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    exams.value = [
      {
        id: '1',
        name: 'Mathematics Final Exam',
        subject_name: 'Mathematics',
        total_questions: 20,
        total_students: 35,
        graded_students: 30,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        id: '2',
        name: 'Science Mid-term',
        subject_name: 'Science',
        total_questions: 15,
        total_students: 28,
        graded_students: 28,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    ]
  } catch (error) {
    console.error('Failed to fetch exams:', error)
  } finally {
    loading.value = false
  }
}

const editExam = (exam: Exam) => {
  selectedExam.value = exam
  showEditModal.value = true
}

const viewExam = (exam: Exam) => {
  selectedExam.value = exam
  showViewModal.value = true
}

const deleteExam = async (examId: string) => {
  if (confirm('Are you sure you want to delete this exam?')) {
    try {
      // TODO: Replace with actual API call
      exams.value = exams.value.filter((e) => e.id !== examId)
    } catch (error) {
      console.error('Failed to delete exam:', error)
    }
  }
}

const getGradingProgress = (exam: Exam) => {
  return (exam.graded_students / exam.total_students) * 100
}

const getGradingStatus = (exam: Exam) => {
  const progress = getGradingProgress(exam)
  if (progress === 100)
    return {
      text: 'Complete',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    }
  if (progress > 0)
    return {
      text: 'In Progress',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    }
  return {
    text: 'Not Started',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  }
}

const filteredExams = computed(() => {
  return exams.value.filter((exam) => {
    return (
      exam.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      exam.subject_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

onMounted(() => {
  fetchExams()
})
</script>

<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Exams</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage and monitor your exams</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Create Exam</span>
        </button>
      </div>

      <!-- Search -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search exams..."
            class="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-900"
          />
        </div>
      </div>

      <!-- Exams List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Loading exams...</p>
        </div>

        <div v-else-if="filteredExams.length === 0" class="p-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">No exams found</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Exam Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Subject
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Questions
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Students
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Grading Progress
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="exam in filteredExams"
                :key="exam.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ exam.name }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ exam.subject_name }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ exam.total_questions }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-1">
                    <Users class="w-4 h-4 text-gray-400" />
                    <span class="text-sm text-gray-900 dark:text-white">{{
                      exam.total_students
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${getGradingProgress(exam)}%` }"
                      ></div>
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      {{ exam.graded_students }}/{{ exam.total_students }} graded
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="getGradingStatus(exam).color"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getGradingStatus(exam).text }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewExam(exam)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View Exam"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="editExam(exam)"
                      class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title="Edit Exam"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteExam(exam.id)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete Exam"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Dashboard>
  <!-- Modals would go here - CreateExamModal, EditExamModal, ViewExamModal -->
</template>
