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
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Invite Teacher
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

      <!-- Teachers Table (reusable component) -->
      <TeachersTable :teachers="data?.data || []" :loading="isFetching" />

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
import TeachersTable from '@/components/TeachersTable.vue'
import { useAuth } from '@/stores/useAuth.ts'
import type { ListTeacherResponse, Teacher } from '@/types/response.ts'

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
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refetch()
  }, 400)
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
  refetch()
})
</script>
