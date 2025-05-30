<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold">Teachers</h1>
          <p class="text-neutral-400">Manage and invite teachers to your school</p>
        </div>
        <button
          @click="showInviteModal = true"
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <CirclePlus />
          Add Teacher
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <SearchInput
              v-model="searchQuery"
              placeholder="Search teachers by name or email..."
              @input="onSearchInput"
            />
          </div>
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

      <!-- Teachers DataTable -->
      <DataTable
        :data="data?.data || []"
        :columns="teacherColumns"
        :dropdown-actions="teacherDropdownActions"
        :use-dropdown-actions="true"
        :loading="isFetching"
        :show-actions="true"
        loading-text="Loading teachers..."
        empty-text="No teachers found"
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
      </DataTable>

      <!-- Invite Teacher Modal (reusable component) -->
      <InviteTeacherModal
        v-if="showInviteModal"
        :loading="inviteLoading"
        :error="inviteErrorMsg"
        :success="inviteSuccessMsg"
        :email="inviteForm.email"
        @update:email="inviteForm.email = $event"
        @close="closeInviteModal"
        @submit="inviteTeacher"
      />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
import InviteTeacherModal from '@/components/InviteTeacherModal.vue'
import SearchInput from '@/components/SearchInput.vue'
import DataTable from '@/components/DataTable.vue'
import { useAuth } from '@/stores/useAuth.ts'
import type { ListTeacherResponse } from '@/types/teacher'
import type { TableColumn, DropdownAction } from '@/types/table'
import { UserPlus, Eye, Edit, Trash2, Circle, CirclePlus } from 'lucide-vue-next'

const auth = useAuth()

// Reactive state
const searchQuery = ref('')
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
    search: searchQuery.value,
  })

  params.append('search_by', 'name')
  params.append('search_by', 'email')

  if (searchQuery.value) {
    params.append('search', searchQuery.value)
  }

  if (verificationFilter.value) {
    params.append('is_verified', verificationFilter.value)
  }

  return `/api/v1/teacher?${params.toString()}`
})

// API call
const { data, isFetching, error, execute: refetch } = useApi<ListTeacherResponse>(apiUrl).json()

// Debounce logic for search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
function onSearchInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refetch()
  }, 500) // 500ms debounce delay
}

// Methods
const handleFilterChange = () => {
  currentPage.value = 1
  refetch()
}

// Modal state and form
const inviteForm = ref({ email: '' })
const inviteLoading = ref(false)
const inviteErrorMsg = ref('')
const inviteSuccessMsg = ref('')

function closeInviteModal() {
  showInviteModal.value = false
  inviteForm.value = { email: '' }
  inviteErrorMsg.value = ''
  inviteSuccessMsg.value = ''
}

async function inviteTeacher() {
  inviteErrorMsg.value = ''
  inviteSuccessMsg.value = ''
  if (
    !inviteForm.value.email.trim() ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inviteForm.value.email)
  ) {
    inviteErrorMsg.value = !inviteForm.value.email.trim()
      ? 'Email is required'
      : 'Invalid email address'
    return
  }

  inviteLoading.value = true
  try {
    const school_id = auth.get()?.payload.user.school_id
    const { data } = await useApi('/api/v1/teacher/invite', {
      method: 'POST',
      body: JSON.stringify({
        school_id,
        emails: [inviteForm.value.email.trim()],
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
  // Only refetch immediately if it's not a search-triggered change
  if (!searchTimeout) {
    refetch()
  }
})

const teacherColumns: TableColumn[] = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'is_verified', title: 'Status' },
]

const teacherDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Details',
    icon: Eye,
    handler: (teacher: any) => viewTeacher(teacher),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    handler: (teacher: any) => editTeacher(teacher),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    handler: (teacher: any) => deleteTeacher(teacher.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

function viewTeacher(teacher: any) {
  // TODO: Implement view functionality
  console.log('View teacher:', teacher)
}

function editTeacher(teacher: any) {
  // TODO: Implement edit functionality
  console.log('Edit teacher:', teacher)
}

async function deleteTeacher(teacherId: string) {
  if (confirm('Are you sure you want to delete this teacher?')) {
    try {
      // TODO: Implement delete API call
      console.log('Delete teacher:', teacherId)
    } catch (error) {
      console.error('Failed to delete teacher:', error)
    }
  }
}
</script>
