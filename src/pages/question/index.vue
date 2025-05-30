<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Questions</h1>
          <p class="text-neutral-600 dark:text-neutral-400">Manage your question bank</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <CirclePlus />
          Create Question
        </button>
      </div>

      <!-- Filters -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Search -->
          <div class="relative flex-1 min-w-64">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search questions..."
              class="pl-10 pr-4 py-2 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-900"
            />
          </div>

          <!-- Type Filter -->
          <select
            v-model="selectedType"
            class="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-900"
          >
            <option value="">All Types</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="essay">Essay</option>
          </select>

          <!-- Difficulty Filter -->
          <select
            v-model="selectedDifficulty"
            class="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-900"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <!-- Questions Table -->
      <DataTable
        :data="data?.data || []"
        :columns="questionColumns"
        :dropdown-actions="questionDropdownActions"
        :use-dropdown-actions="true"
        :loading="isFetching"
        :show-actions="true"
        loading-text="Loading questions..."
        empty-text="No questions found"
      >
        <template #cell-question="{ value }">
          <div class="text-sm font-medium text-neutral-900 dark:text-white">
            {{ value.length > 50 ? value.substring(0, 50) + '...' : value }}
          </div>
        </template>

        <template #cell-question_type="{ value }">
          <span
            :class="typeColors[value as keyof typeof typeColors]"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ value.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) }}
          </span>
        </template>

        <template #cell-difficulty_level="{ value }">
          <span
            :class="difficultyColors[value as keyof typeof difficultyColors]"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ value.charAt(0).toUpperCase() + value.slice(1) }}
          </span>
        </template>
      </DataTable>
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
  { key: 'question', title: 'Question' },
  { key: 'subject_name', title: 'Subject' },
  { key: 'question_type', title: 'Type' },
  { key: 'difficulty_level', title: 'Difficulty' },
  { key: 'points', title: 'Points' },
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
</script>
