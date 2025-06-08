<template>
  <Dashboard>
    <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <!-- Back Navigation -->
        <div class="mb-6">
          <button
            @click="router.push('/student')"
            class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            Back to Students
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isFetching" class="flex items-center justify-center py-24">
          <div class="flex flex-col items-center gap-3">
            <div class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-neutral-500 dark:text-neutral-400 text-sm">Loading student details...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-24">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle class="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load student</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">There was an error loading the student details.</p>
          <button
            @click="refetch"
            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Main Content -->
        <div v-else-if="studentData" class="space-y-8">
          <!-- Tab Navigation -->
          <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
            <div class="flex border-b border-gray-200 dark:border-neutral-700">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-6 py-4 text-sm font-medium transition-colors relative"
                :class="[
                  activeTab === tab.id
                    ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <!-- Main Content - Takes more space -->
            <div class="xl:col-span-3">
              <component
                :is="currentTabComponent"
                :student="studentData"
                :classes="studentClasses"
                @update-student="handleStudentUpdate"
                @delete-student="showDeleteModal = true"
                @edit-avatar="showAvatarModal = true"
              />
            </div>

            <!-- Sidebar -->
            <div class="xl:col-span-1">
              <StudentSidebar 
                :student="studentData"
                :classes="studentClasses"
                :subjects="studentSubjects"
                :school="school"
                :school-loading="schoolLoading"
                :school-error="schoolError"
              />
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md mx-4">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Student</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete <strong>{{ studentData?.name }}</strong>? All associated data will be permanently removed.
            </p>
            <div class="flex gap-3">
              <button
                @click="showDeleteModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                :disabled="deleting"
                class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <div v-if="deleting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {{ deleting ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Avatar Edit Modal -->
        <AvatarEditModal
          v-if="showAvatarModal"
          :student="studentData"
          :is-saving="avatarSaving"
          @close="showAvatarModal = false"
          @save="handleAvatarSave"
        />
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'
import Dashboard from '@/layout/dashboard.vue'
import {
  ArrowLeft,
  AlertCircle,
  X,
} from 'lucide-vue-next'

// Tab Components
import PersonalTab from '@/components/student/tabs/PersonalTab.vue'
import ClassesTab from '@/components/student/tabs/ClassesTab.vue'
import PerformanceTab from '@/components/student/tabs/PerformanceTab.vue'
import StudentSidebar from '@/components/student/StudentSidebar.vue'
import AvatarEditModal from '@/components/student/AvatarEditModal.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

// Student ID from route params
const studentId = computed(() => route.params.id as string)
const schoolId = computed(() => auth.get()?.payload.user.school_id || '')

// Reactive state
const showDeleteModal = ref(false)
const showAvatarModal = ref(false)
const deleting = ref(false)
const avatarSaving = ref(false)

// Fetch student data using reactive useApi
const {
  data,
  isFetching,
  error,
  execute: refetch,
} = useApi(`/api/v1/student/${studentId.value}`).json()

// Additional data fetching
const { data: classesData } = useApi(`/api/v1/student/${studentId.value}/classes`).json()
const { data: subjectsData } = useApi(`/api/v1/student/${studentId.value}/subjects`).json()
const { data: schoolData, isFetching: schoolLoading, error: schoolError } = useApi(`/api/v1/school/${schoolId.value}`).json()

// Extract student data from API response
const studentData = computed(() => data.value?.data || data.value)
const studentClasses = computed(() => classesData.value?.data || [])
const studentSubjects = computed(() => subjectsData.value?.data || [])
const school = computed(() => schoolData.value?.data)

// Tab management
const activeTab = ref('personal')
const tabs = [
  { id: 'personal', name: 'Personal' },
  { id: 'classes', name: 'Classes' },
  { id: 'performance', name: 'Performance' },
]

const currentTabComponent = computed(() => {
  const componentMap = {
    personal: PersonalTab,
    classes: ClassesTab,
    performance: PerformanceTab,
  }
  return componentMap[activeTab.value] || PersonalTab
})

// Event handlers
const handleStudentUpdate = async (updatedData: any) => {
  try {
    await useApi(`/api/v1/student/${studentId.value}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json',
      },
    }).json()

    // Refresh student data
    await refetch()
  } catch (error) {
    console.error('Failed to update student:', error)
    throw error
  }
}

const handleAvatarSave = async (file: File, remove: boolean) => {
  avatarSaving.value = true
  try {
    if (remove) {
      await useApi(`/api/v1/student/${studentId.value}/avatar`, {
        method: 'DELETE',
      }).json()
    } else {
      const formData = new FormData()
      formData.append('avatar', file)

      await useApi(`/api/v1/student/${studentId.value}/avatar`, {
        method: 'POST',
        body: formData,
      }).json()
    }

    // Refresh student data to show updated avatar
    await refetch()
    showAvatarModal.value = false
  } catch (error) {
    console.error('Failed to update avatar:', error)
    // You might want to show an error message to the user here
  } finally {
    avatarSaving.value = false
  }
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    const { data: deleteResponse } = await useApi(`/api/v1/student/${studentId.value}`, {
      method: 'DELETE',
    }).json()

    if (deleteResponse.value?.code === 200) {
      router.push('/student')
    } else {
      throw new Error('Failed to delete student')
    }
  } catch (e) {
    console.error('Failed to delete student:', e)
    // TODO: Show error message
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}
</script>
