<template>
  <BaseModal
    v-if="isOpen"
    title="Create New Question"
    modal-class="max-w-4xl"
    content-class="max-w-full"
    submit-text="Create Question"
    :loading="isSubmitting"
    @close="closeModal"
    @submit="handleSubmit"
  >
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Question Text -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Question <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.question"
            rows="3"
            required
            :class="inputClass"
            placeholder="Enter your question..."
          ></textarea>
        </div>

        <!-- Subject -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Subject <span class="text-red-500">*</span>
          </label>
          <select v-if="isFetching" :class="inputClass" disabled>
            <option value="">Loading subjects...</option>
          </select>
          <select v-else v-model="form.subject_id" required :class="inputClass">
            <option value="">Select Subject</option>
            <option v-for="subject in subjects.data" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <!-- Question Type and Difficulty Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Question Type <span class="text-red-500">*</span>
            </label>
            <select v-model="form.question_type" required :class="inputClass">
              <option value="">Select Type</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="essay">Essay</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Difficulty Level <span class="text-red-500">*</span>
            </label>
            <select v-model="form.difficulty_level" required :class="inputClass">
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <!-- Points -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Points <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.points"
            type="number"
            min="1"
            max="100"
            required
            :class="inputClass"
            placeholder="Enter points (1-100)"
          />
        </div>

        <!-- Multiple Choice Options -->
        <div v-if="form.question_type === 'multiple_choice'" class="space-y-4">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Answer Options <span class="text-red-500">*</span>
          </label>
          <div class="space-y-3">
            <div
              v-for="(option, index) in form.options"
              :key="index"
              class="flex items-center space-x-3"
            >
              <input
                type="radio"
                :name="'correct_answer'"
                :value="option.id"
                v-model="form.correct_answer"
                class="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                v-model="form.options[index].text"
                type="text"
                required
                :class="inputClass"
                :placeholder="`Option ${index + 1}`"
              />
            </div>
          </div>
          <p v-if="form.question_type === 'multiple_choice' && !form.correct_answer" class="text-sm text-red-600">
            Please select the correct answer
          </p>
        </div>

        <!-- Essay Answer -->
        <div v-if="form.question_type === 'essay'">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Sample Answer (Optional)
          </label>
          <textarea
            v-model="form.essay_answer"
            rows="4"
            :class="inputClass"
            placeholder="Enter a sample answer or grading criteria..."
          ></textarea>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue'
import BaseModal from './BaseModal.vue'
import { questionService } from '@/services/questionService'
import { subjectService } from '@/services/subjectService'
import type { DifficultyLevel, MultipleChoiceOption, QuestionType } from '@/types/question'
import { useAuth } from '@/stores/useAuth'

const inputClass = `w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg 
  focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 
  text-neutral-900 dark:text-neutral-100`

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSubmitting = ref(false)
const defaultMultipleOption = [
  {
    id: '1',
    text: '',
  },
  {
    id: '2',
    text: '',
  },
  {
    id: '3',
    text: '',
  },
  {
    id: '4',
    text: '',
  },
] as Array<MultipleChoiceOption>

const form = reactive({
  question: '',
  subject_id: '',
  question_type: '' as QuestionType | '',
  difficulty_level: '' as DifficultyLevel | '',
  points: 1,
  options: defaultMultipleOption,
  correct_answer: '',
  essay_answer: '',
})

const resetForm = () => {
  form.question = ''
  form.subject_id = ''
  form.question_type = ''
  form.difficulty_level = ''
  form.points = 1
  form.options = [
    {
      id: '1',
      text: '',
    },
    {
      id: '2',
      text: '',
    },
    {
      id: '3',
      text: '',
    },
    {
      id: '4',
      text: '',
    },
  ]
  form.correct_answer = ''
  form.essay_answer = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const { data: subjects, isFetching } = subjectService.getSubjects().json()

const validateForm = (): boolean => {
  if (!form.question.trim()) return false
  if (!form.subject_id) return false
  if (!form.question_type) return false
  if (!form.difficulty_level) return false
  if (!form.points || form.points < 1) return false
  
  if (form.question_type === 'multiple_choice') {
    if (!form.correct_answer) return false
    if (form.options.some(option => !option.text.trim())) return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    console.error('Form validation failed')
    return
  }

  try {
    isSubmitting.value = true

    const questionData = {
      question: form.question.trim(),
      subject_id: form.subject_id,
      question_type: form.question_type as QuestionType,
      difficulty_level: form.difficulty_level as DifficultyLevel,
      points: form.points,
      school_id: useAuth().schoolId(),
      ...(form.question_type === 'multiple_choice' && {
        options: form.options.filter(option => option.text.trim()),
        correct_answer: form.correct_answer,
      }),
      ...(form.question_type === 'essay' && form.essay_answer.trim() && {
        essay_answer: form.essay_answer.trim(),
      }),
    }

    await questionService.createQuestion(questionData)
    emit('created')
    closeModal()
  } catch (error) {
    console.error('Failed to create question:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Reset correct answer when question type changes
watch(
  () => form.question_type,
  () => {
    form.correct_answer = ''
  },
)
</script>
