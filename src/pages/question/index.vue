<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'

interface Question {
  id: string
  question: string
  question_type: 'multiple_choice' | 'essay'
  subject_name: string
  difficulty_level: 'easy' | 'medium' | 'hard'
  points: number
  created_at: number
  updated_at: number
}

const questions = ref<Question[]>([])
const loading = ref(false)
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

const fetchQuestions = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    questions.value = [
      {
        id: '1',
        question: 'What is the capital of France?',
        question_type: 'multiple_choice',
        subject_name: 'Geography',
        difficulty_level: 'easy',
        points: 5,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        id: '2',
        question: 'Explain the process of photosynthesis in plants.',
        question_type: 'essay',
        subject_name: 'Biology',
        difficulty_level: 'medium',
        points: 10,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    ]
  } catch (error) {
    console.error('Failed to fetch questions:', error)
  } finally {
    loading.value = false
  }
}

const editQuestion = (question: Question) => {
  selectedQuestion.value = question
  showEditModal.value = true
}

const viewQuestion = (question: Question) => {
  selectedQuestion.value = question
  showViewModal.value = true
}

const deleteQuestion = async (questionId: string) => {
  if (confirm('Are you sure you want to delete this question?')) {
    try {
      // TODO: Replace with actual API call
      questions.value = questions.value.filter((q) => q.id !== questionId)
    } catch (error) {
      console.error('Failed to delete question:', error)
    }
  }
}

const filteredQuestions = computed(() => {
  return questions.value.filter((question) => {
    const matchesSearch =
      question.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      question.subject_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !selectedType.value || question.question_type === selectedType.value
    const matchesDifficulty =
      !selectedDifficulty.value || question.difficulty_level === selectedDifficulty.value

    return matchesSearch && matchesType && matchesDifficulty
  })
})

onMounted(() => {
  fetchQuestions()
})
</script>

<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Questions</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage your question bank</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      <!-- Filters -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Search -->
          <div class="relative flex-1 min-w-64">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search questions..."
              class="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-900"
            />
          </div>

          <!-- Type Filter -->
          <select
            v-model="selectedType"
            class="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-900"
          >
            <option value="">All Types</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="essay">Essay</option>
          </select>

          <!-- Difficulty Filter -->
          <select
            v-model="selectedDifficulty"
            class="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-900"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <!-- Questions List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Loading questions...</p>
        </div>

        <div v-else-if="filteredQuestions.length === 0" class="p-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">No questions found</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Question
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Subject
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Difficulty
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Points
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
                v-for="question in filteredQuestions"
                :key="question.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{
                      question.question.length > 50
                        ? question.question.substring(0, 50) + '...'
                        : question.question
                    }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ question.subject_name }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="typeColors[question.question_type as keyof typeof typeColors]"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{
                      question.question_type
                        .replace('_', ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="
                      difficultyColors[question.difficulty_level as keyof typeof difficultyColors]
                    "
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{
                      question.difficulty_level.charAt(0).toUpperCase() +
                      question.difficulty_level.slice(1)
                    }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ question.points }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewQuestion(question)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="editQuestion(question)"
                      class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteQuestion(question.id)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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

  <!-- Modals would go here - CreateQuestionModal, EditQuestionModal, ViewQuestionModal -->
</template>
