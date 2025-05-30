<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold">Students</h1>
          <p class="text-neutral-400">Manage and invite students to your school</p>
        </div>
        <button
          @click="showInviteModal = true"
          class="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <CirclePlus />
          Add student
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <SearchInput
              v-model="searchQuery"
              placeholder="Search students by name or email..."
              @input="onSearchInput"
            />
          </div>
          <select
            v-model="gradeFilter"
            @change="handleFilterChange"
            class="px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
          >
            <option value="">All Grades</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
          </select>
          <select
            v-model="verificationFilter"
            @change="handleFilterChange"
            class="px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>
      </div>

      <!-- Students DataTable -->
      <DataTable
        :data="data?.data || []"
        :columns="studentColumns"
        :dropdown-actions="studentDropdownActions"
        :use-dropdown-actions="true"
        :loading="isFetching"
        :show-actions="true"
        loading-text="Loading students..."
        empty-text="No students found"
      >
        <template #cell-is_verified="{ value }">
          <span
            :class="
              value
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            "
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ value ? 'Verified' : 'Not Verified' }}
          </span>
        </template>
        <template #cell-grade="{ value }">
          <span
            class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            Grade {{ value }}
          </span>
        </template>
      </DataTable>

      <!-- Invite Student Modal -->
      <InviteStudentModal
        v-if="showInviteModal"
        :loading="inviteLoading"
        :error="inviteErrorMsg"
        :success="inviteSuccessMsg"
        :email="inviteForm.email"
        :grade="inviteForm.grade"
        @update:email="inviteForm.email = $event"
        @update:grade="inviteForm.grade = $event"
        @close="closeInviteModal"
        @submit="inviteStudent"
      />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
import InviteStudentModal from '@/components/InviteStudentModal.vue'
import SearchInput from '@/components/SearchInput.vue'
import DataTable from '@/components/DataTable.vue'
import { useAuth } from '@/stores/useAuth.ts'
import type { TableColumn, DropdownAction } from '@/types/table'
import { Eye, Edit, Trash2, BookOpen, Award, SquarePlus, CirclePlus } from 'lucide-vue-next'

const auth = useAuth()

// Reactive state
const searchQuery = ref('')
const gradeFilter = ref('')
const verificationFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showInviteModal = ref(false)

// Computed URL for API call
const apiUrl = computed(() => {
  const params = new URLSearchParams({
    school_id: auth.get()?.payload.user.school_id || '',
    page: currentPage.value.toString(),
    limit: pageSize.value.toString(),
  })

  if (searchQuery.value) {
    params.append('search', searchQuery.value)
    params.append('search_by', 'name')
    params.append('search_by', 'email')
  }

  if (gradeFilter.value) {
    params.append('grade', gradeFilter.value)
  }

  if (verificationFilter.value) {
    params.append('is_verified', verificationFilter.value)
  }

  return `/api/v1/student?${params.toString()}`
})

// API call
const { data, isFetching, error, execute: refetch } = useApi(apiUrl).json()

// Debounce logic for search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
function onSearchInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refetch()
  }, 500)
}

// Methods
const handleFilterChange = () => {
  currentPage.value = 1
  refetch()
}

// Modal state and form
const inviteForm = ref({ email: '', grade: '' })
const inviteLoading = ref(false)
const inviteErrorMsg = ref('')
const inviteSuccessMsg = ref('')

function closeInviteModal() {
  showInviteModal.value = false
  inviteForm.value = { email: '', grade: '' }
  inviteErrorMsg.value = ''
  inviteSuccessMsg.value = ''
}

async function inviteStudent() {
  inviteErrorMsg.value = ''
  inviteSuccessMsg.value = ''

  if (!inviteForm.value.email.trim() || !inviteForm.value.grade) {
    inviteErrorMsg.value = 'Email and grade are required'
    return
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inviteForm.value.email)) {
    inviteErrorMsg.value = 'Invalid email address'
    return
  }

  inviteLoading.value = true
  try {
    const school_id = auth.get()?.payload.user.school_id
    const { data } = await useApi('/api/v1/student/invite', {
      method: 'POST',
      body: JSON.stringify({
        school_id,
        emails: [inviteForm.value.email.trim()],
        grade: inviteForm.value.grade,
      }),
    }).json()

    if (data.value.code !== 200) {
      inviteErrorMsg.value = data.value.message || 'Failed to send invite'
    } else {
      inviteSuccessMsg.value = 'Invitation sent!'
      setTimeout(() => {
        closeInviteModal()
        refetch()
      }, 1000)
    }
  } catch (e) {
    inviteErrorMsg.value = 'Network error'
  } finally {
    inviteLoading.value = false
  }
}

watch(apiUrl, () => {
  if (!searchTimeout) {
    refetch()
  }
})

const studentColumns: TableColumn[] = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'grade', title: 'Grade' },
  { key: 'is_verified', title: 'Status' },
]

const studentDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Profile',
    icon: Eye,
    handler: (student: any) => viewStudent(student),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    handler: (student: any) => editStudent(student),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'exams',
    label: 'View Exams',
    icon: BookOpen,
    handler: (student: any) => viewStudentExams(student),
    class: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'results',
    label: 'View Results',
    icon: Award,
    handler: (student: any) => viewStudentResults(student),
    class: 'text-orange-600 dark:text-orange-400',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    handler: (student: any) => deleteStudent(student.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

function viewStudent(student: any) {
  // TODO: Implement view functionality
  console.log('View student:', student)
}

function editStudent(student: any) {
  // TODO: Implement edit functionality
  console.log('Edit student:', student)
}

function viewStudentExams(student: any) {
  // TODO: Implement exam view functionality
  console.log('View exams for student:', student)
}

function viewStudentResults(student: any) {
  // TODO: Implement results view functionality
  console.log('View results for student:', student)
}

async function deleteStudent(studentId: string) {
  if (confirm('Are you sure you want to delete this student?')) {
    try {
      // TODO: Implement delete API call
      console.log('Delete student:', studentId)
    } catch (error) {
      console.error('Failed to delete student:', error)
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
