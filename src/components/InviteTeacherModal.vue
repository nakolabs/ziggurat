<template>
  <BaseModal
    title="Invite Teacher"
    description="Enter the teacher's details and assign subjects and classes."
    :loading="loading"
    :error="error"
    :success="success"
    submit-text="Send Invitation"
    modal-class="max-w-2xl"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <template #content>
      <div class="space-y-6">
        <!-- Personal Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="teacher-email" class="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="teacher-email"
              :value="email"
              @input="$emit('update:email', ($event.target as HTMLInputElement).value)"
              type="email"
              class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              :class="{ 'border-red-500': error }"
              placeholder="teacher@example.com"
              required
            />
          </div>
          
          <div>
            <label for="teacher-name" class="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="teacher-name"
              :value="name"
              @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
              type="text"
              class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              placeholder="Teacher's full name"
              required
            />
          </div>
        </div>

        <!-- Subject Assignment -->
        <div>
          <label for="subject-dropdown" class="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Subjects
          </label>
          <div class="relative">
            <button
              id="subject-dropdown"
              type="button"
              @click="showSubjectDropdown = !showSubjectDropdown"
              class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-left flex items-center justify-between"
              :class="{ 'ring-2 ring-orange-500 border-orange-500': showSubjectDropdown }"
            >
              <div class="flex flex-wrap gap-1 flex-1 min-h-[20px]">
                <span v-if="selectedSubjects.length === 0" class="text-neutral-400 dark:text-neutral-500 text-sm">
                  Select subjects...
                </span>
                <span
                  v-for="subject in selectedSubjects.slice(0, 2)"
                  :key="subject.id"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded-md"
                >
                  {{ subject.name }}
                  <button
                    type="button"
                    @click.stop="removeSubject(subject.id)"
                    class="hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </span>
                <span
                  v-if="selectedSubjects.length > 2"
                  class="px-2 py-1 bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs rounded-md"
                >
                  +{{ selectedSubjects.length - 2 }} more
                </span>
              </div>
              <ChevronDown class="w-4 h-4 text-neutral-400 transition-transform" :class="{ 'rotate-180': showSubjectDropdown }" />
            </button>

            <!-- Subject Dropdown -->
            <div
              v-if="showSubjectDropdown"
              id="subject-dropdown-menu"
              class="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              <div v-if="subjectsLoading" class="text-center py-4">
                <div class="inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span class="ml-2 text-sm text-neutral-500">Loading subjects...</span>
              </div>
              <div v-else-if="!subjectsData?.data || subjectsData.data.length === 0" class="text-center py-4 text-neutral-500 text-sm">
                No subjects available
              </div>
              <div v-else class="p-1">
                <button
                  type="button"
                  v-for="subject in subjectsData.data"
                  :key="subject.id"
                  @click="toggleSubject(subject)"
                  class="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-md flex items-center justify-between"
                >
                  <span class="text-sm text-neutral-700 dark:text-neutral-300">{{ subject.name }}</span>
                  <Check
                    v-if="subjectIds.includes(subject.id)"
                    class="w-4 h-4 text-orange-600"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Class Assignment -->
        <div>
          <label for="class-dropdown" class="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Classes
          </label>
          <div class="relative">
            <button
              id="class-dropdown"
              type="button"
              @click="showClassDropdown = !showClassDropdown"
              class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-left flex items-center justify-between"
              :class="{ 'ring-2 ring-orange-500 border-orange-500': showClassDropdown }"
            >
              <div class="flex flex-wrap gap-1 flex-1 min-h-[20px]">
                <span v-if="selectedClasses.length === 0" class="text-neutral-400 dark:text-neutral-500 text-sm">
                  Select classes...
                </span>
                <span
                  v-for="classItem in selectedClasses.slice(0, 2)"
                  :key="classItem.id"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 text-xs rounded-md"
                >
                  {{ classItem.name }}
                  <button
                    type="button"
                    @click.stop="removeClass(classItem.id)"
                    class="hover:bg-purple-100 dark:hover:bg-purple-800 rounded-full p-0.5"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </span>
                <span
                  v-if="selectedClasses.length > 2"
                  class="px-2 py-1 bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs rounded-md"
                >
                  +{{ selectedClasses.length - 2 }} more
                </span>
              </div>
              <ChevronDown class="w-4 h-4 text-neutral-400 transition-transform" :class="{ 'rotate-180': showClassDropdown }" />
            </button>

            <!-- Class Dropdown -->
            <div
              v-if="showClassDropdown"
              id="class-dropdown-menu"
              class="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              <div v-if="classesLoading" class="text-center py-4">
                <div class="inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span class="ml-2 text-sm text-neutral-500">Loading classes...</span>
              </div>
              <div v-else-if="!classesData?.data || classesData.data.length === 0" class="text-center py-4 text-neutral-500 text-sm">
                No classes available
              </div>
              <div v-else class="p-1">
                <button
                  type="button"
                  v-for="classItem in classesData.data"
                  :key="classItem.id"
                  @click="toggleClass(classItem)"
                  class="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-md flex items-center justify-between"
                >
                  <span class="text-sm text-neutral-700 dark:text-neutral-300">{{ classItem.name }}</span>
                  <Check
                    v-if="classIds.includes(classItem.id)"
                    class="w-4 h-4 text-orange-600"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Click outside handler -->
      <div
        v-if="showSubjectDropdown || showClassDropdown"
        @click="closeDropdowns"
        class="fixed inset-0 z-5"
      ></div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'
import BaseModal from './BaseModal.vue'
import { ChevronDown, Check, X } from 'lucide-vue-next'

interface Props {
  loading: boolean
  error: string
  success: string
  email: string
  name: string
  subjectIds: string[]
  classIds: string[]
}

interface Emits {
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'update:email', value: string): void
  (e: 'update:name', value: string): void
  (e: 'update:subject-ids', value: string[]): void
  (e: 'update:class-ids', value: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const auth = useAuth()
const schoolId = auth.get()?.payload.user.school_id

// Fetch subjects - useApi is already reactive
const { 
  data: subjectsData, 
  isFetching: subjectsLoading 
} = useApi(`/api/v1/subject?school_id=${schoolId}`).json()

// Fetch classes - useApi is already reactive
const { 
  data: classesData, 
  isFetching: classesLoading 
} = useApi(`/api/v1/class?school_id=${schoolId}`).json()

const showSubjectDropdown = ref(false)
const showClassDropdown = ref(false)

// Computed properties for selected items
const selectedSubjects = computed(() => {
  if (!subjectsData.value?.data) return []
  return subjectsData.value.data.filter(subject => props.subjectIds.includes(subject.id))
})

const selectedClasses = computed(() => {
  if (!classesData.value?.data) return []
  return classesData.value.data.filter(classItem => props.classIds.includes(classItem.id))
})

// Subject management
const toggleSubject = (subject: any) => {
  const currentIds = [...props.subjectIds]
  const index = currentIds.indexOf(subject.id)
  
  if (index > -1) {
    currentIds.splice(index, 1)
  } else {
    currentIds.push(subject.id)
  }
  
  emit('update:subject-ids', currentIds)
}

const removeSubject = (subjectId: string) => {
  const currentIds = props.subjectIds.filter(id => id !== subjectId)
  emit('update:subject-ids', currentIds)
}

// Class management
const toggleClass = (classItem: any) => {
  const currentIds = [...props.classIds]
  const index = currentIds.indexOf(classItem.id)
  
  if (index > -1) {
    currentIds.splice(index, 1)
  } else {
    currentIds.push(classItem.id)
  }
  
  emit('update:class-ids', currentIds)
}

const removeClass = (classId: string) => {
  const currentIds = props.classIds.filter(id => id !== classId)
  emit('update:class-ids', currentIds)
}

// Dropdown management
const closeDropdowns = () => {
  showSubjectDropdown.value = false
  showClassDropdown.value = false
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdowns()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
