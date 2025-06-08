<template>
  <Dashboard>
    <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <!-- Loading State -->
        <LoadingState v-if="isFetching" message="Loading teacher details..." />

        <!-- Error State -->
        <ErrorState v-else-if="error" @retry="$router.go(-1)" />

        <!-- Main Content -->
        <div v-else-if="teacher" class="space-y-8">
          <!-- Tab Navigation -->
          <TabNavigation v-model="activeTab" :tabs="tabs" />
          <!-- Main Content - Takes more space -->
          <div class="xl:col-span-3">
            <component
              :is="currentTabComponent"
              :teacher="teacher"
              :subjects="subjects"
              :classes="classes"
              :available-subjects="availableSubjects"
              :available-classes="availableClasses"
              :assignment-state="assignmentState"
              :avatar-saving="avatarSaving"
              @assign-subject="assignSubject"
              @assign-class="assignClass"
              @unassign-subject="unassignSubject"
              @unassign-class="unassignClass"
              @update-teacher="handleTeacherUpdate"
              @delete-teacher="showDeleteModal = true"
              @edit-avatar="showAvatarModal = true"
              @save-avatar="handleAvatarSave"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteModal
      v-if="showDeleteModal"
      :teacher-name="teacher?.name"
      :deleting="deleting"
      @confirm="deleteTeacher"
      @cancel="showDeleteModal = false"
    />

    <!-- Avatar Edit Modal -->
    <AvatarEditModal
      v-if="showAvatarModal"
      :teacher="teacher"
      :is-saving="avatarSaving"
      @close="showAvatarModal = false"
      @save="handleAvatarSave"
    />
  </Dashboard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Dashboard from '@/layout/dashboard.vue'
import { useTeacherDetail } from '@/composables/useTeacherDetail'
import { useTeacherAssignment } from '@/composables/useTeacherAssignment'
import { useApi } from '@/stores/useApi'

// Components
import TabNavigation from '@/components/ui/TabNavigation.vue'
import TeacherSidebar from '@/components/teacher/TeacherSidebar.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import DeleteModal from '@/components/teacher/DeleteModal.vue'
import AvatarEditModal from '@/components/teacher/AvatarEditModal.vue'

// Tab Components
import PersonalTab from '@/components/teacher/tabs/PersonalTab.vue'
import SubjectsTab from '@/components/teacher/tabs/SubjectsTab.vue'
import ClassesTab from '@/components/teacher/tabs/ClassesTab.vue'

const route = useRoute()
const teacherId = computed(() => route.params.id as string)

// Use composables
const {
  teacher,
  subjects,
  classes,
  availableSubjects,
  availableClasses,
  school,
  isFetching,
  subjectsLoading,
  classesLoading,
  schoolLoading,
  error,
  subjectsError,
  classesError,
  schoolError,
  showDeleteModal,
  deleting,
  deleteTeacher,
  refetch,
} = useTeacherDetail(teacherId.value)

const assignmentOperations = useTeacherAssignment(teacherId.value)

// Avatar editing
const showAvatarModal = ref(false)
const avatarSaving = ref(false)

const handleAvatarSave = async (file: File, remove: boolean) => {
  avatarSaving.value = true
  try {
    if (remove) {
      await useApi(`/api/v1/teacher/${teacherId.value}/avatar`, {
        method: 'DELETE',
      }).json()
    } else {
      const formData = new FormData()
      formData.append('avatar', file)

      await useApi(`/api/v1/teacher/${teacherId.value}/avatar`, {
        method: 'POST',
        body: formData,
      }).json()
    }

    // Refresh teacher data to show updated avatar
    await refetch()
    showAvatarModal.value = false
  } catch (error) {
    console.error('Failed to update avatar:', error)
    // You might want to show an error message to the user here
  } finally {
    avatarSaving.value = false
  }
}

const handleTeacherUpdate = async (updatedData: any) => {
  try {
    await useApi(`/api/v1/teacher/${teacherId.value}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json',
      },
    }).json()

    // Refresh teacher data
    await refetch()
  } catch (error) {
    console.error('Failed to update teacher:', error)
    throw error
  }
}

// Tab management
const activeTab = ref('personal')
const tabs = [
  { id: 'personal', name: 'Personal', icon: 'user' },
  { id: 'subjects', name: 'Subjects', icon: 'book' },
  { id: 'classes', name: 'Classes', icon: 'class' },
]

const currentTabComponent = computed(() => {
  const componentMap = {
    personal: PersonalTab,
    subjects: SubjectsTab,
    classes: ClassesTab,
  }
  return componentMap[activeTab.value] || PersonalTab
})

// Assignment state for child components
const assignmentState = computed(() => ({
  selectedSubjectId: assignmentOperations.selectedSubjectId,
  selectedClassId: assignmentOperations.selectedClassId,
  assigningSubject: assignmentOperations.assigningSubject,
  assigningClass: assignmentOperations.assigningClass,
  unassigningSubject: assignmentOperations.unassigningSubject,
  unassigningClass: assignmentOperations.unassigningClass,
  assignSubjectError: assignmentOperations.assignSubjectError,
  assignClassError: assignmentOperations.assignClassError,
  assignSubjectSuccess: assignmentOperations.assignSubjectSuccess,
  assignClassSuccess: assignmentOperations.assignClassSuccess,
}))

// Event handlers
const { assignSubject, assignClass, unassignSubject, unassignClass } = assignmentOperations
</script>
