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
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search teachers by name or email..."
                class="w-full pl-10 pr-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-neutral-400"
              />
            </div>
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

      <!-- Teachers Table -->
      <div class="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-800">
            <thead class="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Teacher
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-neutral-50 dark:bg-neutral-900/90 divide-y divide-neutral-900">
              <tr v-if="isFetching">
                <td colspan="4" class="px-6 py-4 text-center text-neutral-400">Loading...</td>
              </tr>
              <tr v-else v-for="teacher in data?.data" :key="teacher.id" class="transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full bg-neutral-600 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium">
                          {{ teacher.name.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium">{{ teacher.name }}</div>
                      <div class="text-sm">{{ teacher.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm">{{ teacher.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      teacher.is_verified
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
                    ]"
                  >
                    {{ teacher.is_verified ? 'Verified' : 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-orange-400 hover:text-orange-300 mr-3 transition-colors">
                    Edit
                  </button>
                  <button class="text-red-400 hover:text-red-300 transition-colors">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
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
  })

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

// Methods
const handleSearch = () => {
  currentPage.value = 1
  refetch()
}

const handleFilterChange = () => {
  currentPage.value = 1
  refetch()
}

// Watch for URL changes to refetch data
watch(apiUrl, () => {
  refetch()
})
</script>
