<template>
  <Dashboard>
    <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button
                @click="router.push('/subject')"
                class="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div v-if="subjectData">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ subjectData.name }}</h1>
              </div>
            </div>
            <div v-if="subjectData" class="flex items-center gap-3">
              <button
                @click="showEditModal = true"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <Edit class="w-4 h-4" />
                Edit
              </button>
              <button
                @click="showDeleteModal = true"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Trash2 class="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isFetching" class="flex items-center justify-center py-20">
          <div class="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load subject</h3>
          <button
            @click="refetch"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Main Content -->
        <div v-else-if="subjectData">
          <!-- Tab Navigation -->
          <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 mb-6">
            <div class="border-b border-gray-200 dark:border-neutral-700">
              <nav class="flex space-x-8 px-6">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  class="py-4 px-1 border-b-2 font-medium text-sm transition-colors relative"
                  :class="[
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                >
                  {{ tab.name }}
                </button>
              </nav>
            </div>
          </div>

          <!-- Content -->
          <component
            :is="currentTabComponent"
            :subject="subjectData"
            :teachers="subjectTeachers"
            :classes="subjectClasses"
            :students="subjectStudents"
            :school="school"
            :teachers-loading="teachersLoading"
            :classes-loading="classesLoading"
            :students-loading="studentsLoading"
            @update-subject="handleSubjectUpdate"
          />
        </div>

        <!-- Edit Subject Modal -->
        <BaseModal
          v-if="showEditModal"
          title="Edit Subject"
          description="Update subject information"
          submit-text="Save Changes"
          :loading="updating"
          :fields="editModalFields"
          @close="closeEditModal"
          @submit="updateSubject"
          @update:field="updateEditField"
        />

        <!-- Delete Confirmation Modal -->
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
        >
          <div class="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md">
            <div class="text-center mb-6">
              <div class="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle class="w-6 h-6 text-red-500" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Delete Subject</h3>
              <p class="text-gray-500 dark:text-gray-400">This action cannot be undone</p>
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-8 text-center">
              Are you sure you want to delete <strong>{{ subjectData?.name }}</strong>?
            </p>
            <div class="flex gap-3">
              <button
                @click="showDeleteModal = false"
                class="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                :disabled="deleting"
                class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <div v-if="deleting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {{ deleting ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Edit, Trash2, AlertCircle, Book } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import BaseModal from '@/components/BaseModal.vue'
import SubjectSidebar from '@/components/subject/SubjectSidebar.vue'
import SubjectOverviewTab from '@/components/subject/tabs/OverviewTab.vue'
import SubjectTeachersTab from '@/components/subject/tabs/TeachersTab.vue'
import SubjectClassesTab from '@/components/subject/tabs/ClassesTab.vue'
import SubjectStudentsTab from '@/components/subject/tabs/StudentsTab.vue'
import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'

const route = useRoute()
const router = useRouter()
const subjectId = computed(() => route.params.id as string)

// Tab management
const activeTab = ref('overview')
const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'teachers', name: 'Teachers' },
  { id: 'classes', name: 'Classes' },
  { id: 'students', name: 'Students' },
]

const currentTabComponent = computed(() => {
  const components = {
    overview: SubjectOverviewTab,
    teachers: SubjectTeachersTab,
    classes: SubjectClassesTab,
    students: SubjectStudentsTab,
  }
  return components[activeTab.value] || SubjectOverviewTab
})

// Modal states
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const updating = ref(false)
const deleting = ref(false)

// Fetch subject data
const {
  data: subjectResponse,
  isFetching,
  error,
  execute: refetch,
} = useApi(`/api/v1/subject/${subjectId.value}`).json()

const subjectData = computed(() => subjectResponse.value?.data)

// Fetch related data
const {
  data: teachersResponse,
  isFetching: teachersLoading,
} = useApi(`/api/v1/subject/${subjectId.value}/teachers`).json()

const {
  data: classesResponse,
  isFetching: classesLoading,
} = useApi(`/api/v1/subject/${subjectId.value}/classes`).json()

const {
  data: studentsResponse,
  isFetching: studentsLoading,
} = useApi(`/api/v1/subject/${subjectId.value}/students`).json()

const {
  data: schoolResponse,
  isFetching: schoolLoading,
  error: schoolError,
} = useApi(`/api/v1/school/${useAuth().get()?.payload.user.school_id}`).json()

const subjectTeachers = computed(() => teachersResponse.value?.data || [])
const subjectClasses = computed(() => classesResponse.value?.data || [])
const subjectStudents = computed(() => studentsResponse.value?.data || [])
const school = computed(() => schoolResponse.value?.data)

// Edit form data
const editForm = ref({
  name: '',
})

const editModalFields = computed(() => [
  {
    key: 'name',
    label: 'Subject Name',
    value: editForm.value.name,
    type: 'text',
    placeholder: 'Enter subject name',
    required: true,
  },
])

const updateEditField = (update: { key: string; value: string }) => {
  if (update.key === 'name') {
    editForm.value.name = update.value
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value.name = subjectData.value?.name || ''
}

const updateSubject = async () => {
  if (!editForm.value.name.trim()) return

  updating.value = true
  try {
    const { data } = await useApi(`/api/v1/subject/${subjectId.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: editForm.value.name,
      }),
    }).json()

    if (data.value.code === 200) {
      await refetch()
      closeEditModal()
    } else {
      console.error('Error updating subject:', data.value.message)
      alert('Failed to update subject: ' + data.value.message)
    }
  } catch (error) {
    console.error('Failed to update subject:', error)
    alert('Failed to update subject. Please try again.')
  } finally {
    updating.value = false
  }
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    const { data } = await useApi(`/api/v1/subject/${subjectId.value}`, {
      method: 'DELETE',
    }).json()

    if (data.value.code === 200) {
      router.push('/subject')
    } else {
      console.error('Error deleting subject:', data.value.message)
      alert('Failed to delete subject: ' + data.value.message)
    }
  } catch (error) {
    console.error('Failed to delete subject:', error)
    alert('Failed to delete subject. Please try again.')
  } finally {
    deleting.value = false
  }
}

const handleSubjectUpdate = () => {
  refetch()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

// Initialize edit form when subject data loads
onMounted(() => {
  if (subjectData.value) {
    editForm.value.name = subjectData.value.name
  }
})
</script>
