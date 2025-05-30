<template>
  <BaseModal
    v-if="isOpen"
    title="Question Details"
    :description="`View details for question ID: ${question?.id}`"
    cancel-text="Close"
    submit-text=""
    @close="$emit('close')"
    @submit="$emit('close')"
  >
    <template #content>
      <div v-if="question" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Question</label>
          <div
            class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
          >
            {{ question.question }}
          </div>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Subject</label>
          <div
            class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
          >
            {{ question.subject_name }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm font-medium">Type</label>
            <div
              class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
            >
              {{
                question.question_type
                  .replace('_', ' ')
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())
              }}
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium">Difficulty</label>
            <div
              class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
            >
              {{
                question.difficulty_level.charAt(0).toUpperCase() +
                question.difficulty_level.slice(1)
              }}
            </div>
          </div>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Points</label>
          <div
            class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
          >
            {{ question.points }}
          </div>
        </div>

        <div v-if="question.options && question.options.length > 0">
          <label class="block mb-1 text-sm font-medium">Options</label>
          <div class="space-y-2">
            <div
              v-for="(option, index) in question.options"
              :key="index"
              class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
              :class="{ 'border-green-500 bg-green-50 dark:bg-green-900/20': option.is_correct }"
            >
              {{ option.option_text }}
              <span v-if="option.is_correct" class="ml-2 text-green-600 text-sm font-medium"
                >(Correct)</span
              >
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #actions="{ loading }">
      <button
        type="button"
        class="px-4 py-2 rounded-lg bg-neutral-700 text-white"
        @click="$emit('close')"
        :disabled="loading"
      >
        Close
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/BaseModal.vue'
import type { Question } from '@/types/question'

defineProps<{
  isOpen: boolean
  question: Question | null
}>()

defineEmits(['close'])
</script>
