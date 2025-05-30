<template>
  <BaseModal
    v-if="isOpen"
    title="Create New Question"
    modal-class="max-w-4xl"
    content-class="max-w-full"
    @close="closeModal"
    @submit="handleSubmit"
  >
    <template #content>
      <!-- Question Text -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Question
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
      <div class="mb-4">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Subject
        </label>
        <select v-if="isFetching">
          <option value="">loading..</option>
        </select>
        <select v-else v-model="form.subject_id" required :class="inputClass">
          <option value="">Select Subject</option>
          <option v-for="subject in subjects.data" :key="subject.id" :value="subject.id">
            {{ subject.name }}
          </option>
        </select>
      </div>

      <!-- Question Type and Difficulty Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Question Type
          </label>
          <select v-model="form.question_type" required :class="inputClass">
            <option value="">Select Type</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="essay">Essay</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Difficulty Level
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
      <div class="mb-4">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Points
        </label>
        <input
          v-model.number="form.points"
          type="number"
          min="1"
          required
          :class="inputClass"
          placeholder="Enter points..."
        />
      </div>

      <!-- Multiple Choice Options -->
      <div v-if="form.question_type === 'multiple_choice'" class="space-y-4 mb-4">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Answer Options
        </label>
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
            :class="inputClass"
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

      <!-- Essay Answer -->
      <div v-if="form.question_type === 'essay'" class="mb-4">
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
    </template>

    <template #actions class="mb-4">
      <button
        type="button"
        @click="closeModal"
        class="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        {{ isSubmitting ? 'Creating...' : 'Create Question' }}
      </button>
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

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    const questionData = {
      question: form.question,
      subject_id: form.subject_id,
      question_type: form.question_type as QuestionType,
      difficulty_level: form.difficulty_level as DifficultyLevel,
      points: form.points,
      ...(form.question_type === 'multiple_choice' && {
        options: form.options,
        correct_answer: form.correct_answer,
      }),
      school_id: useAuth().schoolId(),
      ...(form.question_type === 'essay' && {
        essay_answer: form.essay_answer,
      }),
    }

    await questionService.createQuestion(questionData)
    emit('created')
    closeModal()
  } catch (error) {
    console.error('Failed to create question:', error)
    // You might want to show an error toast here
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
