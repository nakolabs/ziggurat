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
            Create Question
          </button>
        </div>

        <!-- Clean Statistics Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Questions</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ totalQuestions }}
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
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Multiple Choice</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ multipleChoiceCount }}
                </p>
              </div>
              <div
                class="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center"
              >
                <div class="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Essay Questions</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ essayCount }}
                </p>
              </div>
              <div
                class="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center"
              >
                <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Points</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ averagePoints }}
                </p>
              </div>
              <div
                class="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center"
              >
                <div class="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filters -->
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
                  placeholder="Search questions..."
                  class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <div class="flex gap-3">
              <select
                v-model="selectedType"
                class="px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              >
                <option value="">All Types</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="essay">Essay</option>
              </select>

              <select
                v-model="selectedDifficulty"
                class="px-3 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Clean Data Table -->
        <div
          class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
        >
          <DataTable
            :data="filteredQuestions"
            :columns="questionColumns"
            :dropdown-actions="questionDropdownActions"
            :use-dropdown-actions="true"
            :loading="isFetching"
            :show-actions="true"
            loading-text="Loading questions..."
            empty-text="No questions found"
          >
            <!-- Clean Question Cell -->
            <template #cell-question="{ value }">
              <div class="py-2">
                <div class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ value.length > 60 ? value.substring(0, 60) + '...' : value }}
                </div>
              </div>
            </template>

            <!-- Subject Badge -->
            <template #cell-subject_name="{ value }">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                >
                  {{ value || 'No Subject' }}
                </span>
              </div>
            </template>

            <!-- Type Badge -->
            <template #cell-question_type="{ value }">
              <span
                :class="typeColors[value as keyof typeof typeColors]"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ value.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) }}
              </span>
            </template>

            <!-- Difficulty Badge -->
            <template #cell-difficulty_level="{ value }">
              <span
                :class="difficultyColors[value as keyof typeof difficultyColors]"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ value.charAt(0).toUpperCase() + value.slice(1) }}
              </span>
            </template>

            <!-- Points Cell -->
            <template #cell-points="{ value }">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ value || 0 }} pts
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateQuestionModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleQuestionCreated"
    />

    <ViewQuestionModal
      :is-open="showViewModal"
      :question="selectedQuestion"
      @close="showViewModal = false"
    />

    <EditQuestionModal
      :is-open="showEditModal"
      :question="selectedQuestion"
      @close="showEditModal = false"
      @updated="handleQuestionUpdated"
    />
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Plus, Search, Edit, Trash2, Eye, CirclePlus } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import CreateQuestionModal from '@/components/CreateQuestionModal.vue'
import ViewQuestionModal from '@/components/ViewQuestionModal.vue'
import EditQuestionModal from '@/components/EditQuestionModal.vue'
import DataTable from '@/components/DataTable.vue'
import { questionService } from '@/services/questionService'
import type { ListQuestionResponse, Question } from '@/types/question'
import type { TableColumn, DropdownAction, TableAction } from '@/types/table'

const searchQuery = ref('')
const selectedType = ref('')
const selectedDifficulty = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedQuestion = ref<Question | null>(null)
const isSubmitting = ref(false)

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const typeColors = {
  multiple_choice: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  essay: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
}

const questionColumns: TableColumn[] = [
  {
    key: 'question',
    title: 'Question',
    width: '300px',
  },
  {
    key: 'subject_name',
    title: 'Subject',
    width: '120px',
  },
  {
    key: 'question_type',
    title: 'Type',
    width: '120px',
  },
  {
    key: 'difficulty_level',
    title: 'Difficulty',
    width: '100px',
  },
  {
    key: 'points',
    title: 'Points',
    width: '80px',
  },
]

const questionDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'view',
    icon: Eye,
    handler: (question: Question) => viewQuestion(question),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'edit',
    label: 'edit',
    icon: Edit,
    handler: (question: Question) => editQuestion(question),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'delete',
    label: 'delete',
    icon: Trash2,
    handler: (question: Question) => deleteQuestion(question.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

const {
  data,
  execute: refetch,
  isFetching,
} = questionService.getQuestions().json<ListQuestionResponse>()

function editQuestion(question: Question) {
  selectedQuestion.value = question
  showEditModal.value = true
}

function viewQuestion(question: Question) {
  selectedQuestion.value = question
  showViewModal.value = true
}

const deleteQuestion = async (questionId: string) => {
  if (confirm('Are you sure you want to delete this question?')) {
    try {
      await questionService.deleteQuestion(questionId)
      refetch()
      console.log('Question deleted successfully')
    } catch (error) {
      console.error('Failed to delete question:', error)
    }
  }
}

const handleQuestionCreated = () => {
  refetch()
  console.log('Question created successfully')
}

const handleQuestionUpdated = () => {
  refetch()
  console.log('Question updated successfully')
}

// Computed statistics
const totalQuestions = computed(() => data.value?.data?.length || 0)
const multipleChoiceCount = computed(
  () =>
    data.value?.data?.filter((q: Question) => q.question_type === 'multiple_choice').length || 0,
)
const essayCount = computed(
  () => data.value?.data?.filter((q: Question) => q.question_type === 'essay').length || 0,
)
const averagePoints = computed(() => {
  const questions = data.value?.data || []
  if (questions.length === 0) return 0
  const total = questions.reduce((sum: number, q: Question) => sum + (q.points || 0), 0)
  return Math.round(total / questions.length)
})

// Filtered questions based on search and filters
const filteredQuestions = computed(() => {
  let questions = data.value?.data || []

  if (searchQuery.value) {
    questions = questions.filter(
      (q: Question) =>
        q.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (q.subject_name && q.subject_name.toLowerCase().includes(searchQuery.value.toLowerCase())),
    )
  }

  if (selectedType.value) {
    questions = questions.filter((q: Question) => q.question_type === selectedType.value)
  }

  if (selectedDifficulty.value) {
    questions = questions.filter((q: Question) => q.difficulty_level === selectedDifficulty.value)
  }

  return questions
})
</script>
