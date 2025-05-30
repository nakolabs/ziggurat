<template>
  <BaseModal
    v-if="isOpen"
    title="Edit Question"
    description="Update the question details below"
    :loading="loading"
    :error="error"
    :success="success"
    cancel-text="Cancel"
    submit-text="Update Question"
    @close="$emit('close')"
    @submit="handleSubmit"
  >
    <template #content>
      <div v-if="question" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Question</label>
          <textarea
            v-model="formData.question"
            class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm font-medium">Type</label>
            <select
              v-model="formData.question_type"
              class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
              required
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="essay">Essay</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium">Difficulty</label>
            <select
              v-model="formData.difficulty_level"
              class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Points</label>
          <input
            v-model.number="formData.points"
            type="number"
            min="1"
            class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
            required
          />
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { questionService } from '@/services/questionService'
import type { DifficultyLevel, Question, QuestionType } from '@/types/question'

const props = defineProps<{
  isOpen: boolean
  question: Question | null
}>()

const emit = defineEmits(['close', 'updated'])

const loading = ref(false)
const error = ref('')
const success = ref('')

const formData = ref({
  question: '',
  question_type: 'multiple_choice' as QuestionType,
  difficulty_level: 'easy' as DifficultyLevel,
  points: 1,
})

watch(
  () => props.question,
  (newQuestion) => {
    if (newQuestion) {
      formData.value = {
        question: newQuestion.question,
        question_type: newQuestion.question_type,
        difficulty_level: newQuestion.difficulty_level,
        points: newQuestion.points,
      }
    }
  },
  { immediate: true },
)

const handleSubmit = async () => {
  if (!props.question) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await questionService.updateQuestion(props.question.id, formData.value)
    success.value = 'Question updated successfully!'
    setTimeout(() => {
      emit('updated')
      emit('close')
    }, 1000)
  } catch (err) {
    error.value = 'Failed to update question. Please try again.'
    console.error('Error updating question:', err)
  } finally {
    loading.value = false
  }
}
</script>
