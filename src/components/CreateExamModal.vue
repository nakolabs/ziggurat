<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import BaseModal from './BaseModal.vue'
import type { Subject } from '@/types/subject'
import type { Class } from '@/types/class'
import type { Question } from '@/types/question'
import { examService } from '@/services/examService'
import { subjectService } from '@/services/subjectService'
import { classService } from '@/services/classService'
import { questionService } from '@/services/questionService'
import { useAuth } from '@/stores/useAuth'

type Props = {
  show: boolean
}

type Emits = {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref({
  name: '',
  subject_id: '',
  class_id: '',
  multiple_choice_ids: [] as string[],
  essay_question_ids: [] as string[],
})

const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

// Fetch subjects, classes, and questions
const { data: subjects } = subjectService.getSubjects().json<{ data: Subject[] }>()

const { data: classes } = classService
  .getClasses({
    school_id: useAuth().schoolId(),
  })
  .json<{ data: Class[] }>()

const { data: multipleChoiceQuestions } = questionService
  .getQuestions({})
  .json<{ data: Question[] }>()

const { data: essayQuestions } = questionService
  .getQuestions({
    question_type: 'essay',
  })
  .json<{ data: Question[] }>()

const validateForm = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Exam name is required'
  }

  if (!form.value.subject_id) {
    errors.value.subject_id = 'Subject is required'
  }

  if (!form.value.class_id) {
    errors.value.class_id = 'Class is required'
  }

  if (form.value.multiple_choice_ids.length === 0 && form.value.essay_question_ids.length === 0) {
    errors.value.questions = 'At least one question must be selected'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const payload = {
      name: form.value.name,
      school_id: useAuth().schoolId(),
      subject_id: form.value.subject_id,
      class_id: form.value.class_id,
      multiple_choice_ids: form.value.multiple_choice_ids,
      essay_question_ids: form.value.essay_question_ids,
    }

    const success = await examService.createExam(payload)

    if (success) {
      resetForm()
      emit('created')
      emit('close')
    }
  } catch (error) {
    console.error('Failed to create exam:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    subject_id: '',
    class_id: '',
    multiple_choice_ids: [],
    essay_question_ids: [],
  }
  errors.value = {}
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const toggleMultipleChoiceQuestion = (questionId: string) => {
  const index = form.value.multiple_choice_ids.indexOf(questionId)
  if (index > -1) {
    form.value.multiple_choice_ids.splice(index, 1)
  } else {
    form.value.multiple_choice_ids.push(questionId)
  }
}

const toggleEssayQuestion = (questionId: string) => {
  const index = form.value.essay_question_ids.indexOf(questionId)
  if (index > -1) {
    form.value.essay_question_ids.splice(index, 1)
  } else {
    form.value.essay_question_ids.push(questionId)
  }
}
</script>

<template>
  <BaseModal
    v-if="show"
    title="Create New Exam"
    description="Set up a new exam by selecting questions and configuring details"
    modal-class="max-w-2xl"
    content-class="max-h-[60vh] overflow-y-auto space-y-6"
    :loading="isSubmitting"
    @close="closeModal"
    @submit="handleSubmit"
  >
    <template #content>
      <!-- Exam Name -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Exam Name
        </label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          :class="{ 'border-red-500': errors.name }"
          placeholder="Enter exam name"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <!-- Subject -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Subject
        </label>
        <select
          v-model="form.subject_id"
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          :class="{ 'border-red-500': errors.subject_id }"
        >
          <option value="">Select a subject</option>
          <option v-for="subject in subjects?.data" :key="subject.id" :value="subject.id">
            {{ subject.name }}
          </option>
        </select>
        <p v-if="errors.subject_id" class="mt-1 text-sm text-red-600">
          {{ errors.subject_id }}
        </p>
      </div>

      <!-- Class -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Class
        </label>
        <select
          v-model="form.class_id"
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          :class="{ 'border-red-500': errors.class_id }"
        >
          <option value="">Select a class</option>
          <option v-for="classItem in classes?.data" :key="classItem.id" :value="classItem.id">
            {{ classItem.name }}
          </option>
        </select>
        <p v-if="errors.class_id" class="mt-1 text-sm text-red-600">{{ errors.class_id }}</p>
      </div>

      <!-- Multiple Choice Questions -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Multiple Choice Questions
        </label>
        <div
          class="border border-neutral-300 dark:border-neutral-600 rounded-lg p-3 max-h-40 overflow-y-auto"
        >
          <div v-if="multipleChoiceQuestions?.data.length === 0" class="text-neutral-500 text-sm">
            No multiple choice questions available
          </div>
          <div v-else class="space-y-2">
            <label
              v-for="question in multipleChoiceQuestions?.data"
              :key="question.id"
              class="flex items-start space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="form.multiple_choice_ids.includes(question.id)"
                @change="toggleMultipleChoiceQuestion(question.id)"
                class="mt-1 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
              />
              <span class="text-sm text-neutral-700 dark:text-neutral-300">{{
                question.question
              }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Essay Questions -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Essay Questions
        </label>
        <div
          class="border border-neutral-300 dark:border-neutral-600 rounded-lg p-3 max-h-40 overflow-y-auto"
        >
          <div v-if="essayQuestions?.data.length === 0" class="text-neutral-500 text-sm">
            No essay questions available
          </div>
          <div v-else class="space-y-2">
            <label
              v-for="question in essayQuestions?.data"
              :key="question.id"
              class="flex items-start space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="form.essay_question_ids.includes(question.id)"
                @change="toggleEssayQuestion(question.id)"
                class="mt-1 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
              />
              <span class="text-sm text-neutral-700 dark:text-neutral-300">{{
                question.question
              }}</span>
            </label>
          </div>
        </div>
        <p v-if="errors.questions" class="mt-1 text-sm text-red-600">{{ errors.questions }}</p>
      </div>
    </template>

    <template #actions="{ loading }">
      <button
        @click="closeModal"
        type="button"
        class="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        @click="handleSubmit"
        :disabled="loading"
        class="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <Plus class="w-4 h-4" />
        <span>{{ loading ? 'Creating...' : 'Create Exam' }}</span>
      </button>
    </template>
  </BaseModal>
</template>
