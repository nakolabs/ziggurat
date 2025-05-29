<template>
  <Dashboard>
    <div class="p-6 max-w-xl mx-auto">
      <div v-if="isFetching" class="text-center text-neutral-400">Loading...</div>
      <div v-else-if="error" class="text-center text-red-400">Failed to load teacher details.</div>
      <div v-else-if="teacher" class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="h-16 w-16 rounded-full bg-neutral-600 flex items-center justify-center">
            <span class="text-2xl font-medium">{{ teacher.name.charAt(0).toUpperCase() }}</span>
          </div>
          <div>
            <div class="text-xl font-semibold">{{ teacher.name }}</div>
            <div class="text-sm text-neutral-400">{{ teacher.email }}</div>
          </div>
        </div>
        <div class="text-sm text-neutral-400">
          <div>Created: {{ formatDate(teacher.create_at) }}</div>
          <div>Updated: {{ formatDate(teacher.update_at) }}</div>
        </div>

        <!-- Teacher Subjects Section -->
        <div>
          <div class="font-semibold mb-2">Subjects</div>
          <div v-if="subjectsLoading" class="text-neutral-400">Loading subjects...</div>
          <div v-else-if="subjectsError" class="text-red-400">Failed to load subjects.</div>
          <ul v-else-if="subjects && subjects.length" class="space-y-1">
            <li
              v-for="subject in subjects"
              :key="subject.id"
              class="px-3 py-1 rounded bg-neutral-800 text-white"
            >
              {{ subject.name }}
            </li>
          </ul>
          <div v-else class="text-neutral-400">No subjects assigned.</div>
        </div>

        <!-- Assign Subject to Teacher Section -->
        <div class="mt-6">
          <div class="font-semibold mb-2">Assign Subject</div>
          <form @submit.prevent="assignSubject" class="flex gap-2 items-center">
            <select
              v-model="selectedSubjectId"
              class="px-2 py-1 rounded border border-neutral-700 bg-neutral-900 text-white"
              required
            >
              <option value="" disabled>Select subject</option>
              <option v-for="subject in allSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
            <button
              type="submit"
              class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              :disabled="assigning"
            >
              Assign
            </button>
          </form>
          <div v-if="assignError" class="text-red-400 mt-1">{{ assignError }}</div>
          <div v-if="assignSuccess" class="text-green-400 mt-1">Subject assigned!</div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useApi } from '@/stores/useApi'
import Dashboard from '@/layout/dashboard.vue'
import { useAuth } from '@/stores/useAuth'

const route = useRoute()
const teacherId = computed(() => route.params.id as string)
const schoolId = useAuth().get()?.payload.user.school_id || ''

const { data, isFetching, error } = useApi(`/api/v1/teacher/${teacherId.value}`).json()
const teacher = computed(() => data.value?.data)

// Fetch teacher subjects
const {
  data: subjectsData,
  isFetching: subjectsLoading,
  error: subjectsError,
} = useApi(`/api/v1/teacher/${teacherId.value}/subjects?`).json()
const subjects = computed(() => subjectsData.value?.data || [])

// Fetch all subjects for assignment
const {
  data: allSubjectsData,
  isFetching: allSubjectsLoading,
  error: allSubjectsError,
} = useApi('/api/v1/subject?school_id=' + schoolId).json()
const allSubjects = computed(() => allSubjectsData.value?.data || [])

// Assignment state
const selectedSubjectId = ref('')
const assigning = ref(false)
const assignError = ref('')
const assignSuccess = ref(false)

async function assignSubject() {
  assignError.value = ''
  assignSuccess.value = false
  if (!selectedSubjectId.value) return
  assigning.value = true
  try {
    const { error, data } = await useApi('/api/v1/subject/assign-teachers', {
      method: 'POST',
      body: JSON.stringify({
        teacher_id: teacherId.value,
        subject_id: selectedSubjectId.value,
        teacher_ids: [teacherId.value],
      }),
    }).json()
    if (data.value?.code !== 200) {
      assignSuccess.value = false
      assignError.value = data.value?.message || 'Failed to assign subject'
      return
    }
    assignSuccess.value = true
    assignError.value = ''
    selectedSubjectId.value = '' // Reset selection
  } catch (e) {
    assignError.value = 'Failed to assign subject'
  } finally {
    assigning.value = false
  }
}

function formatDate(date: string) {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}
</script>
