<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold">PPDB Management</h1>
          <p class="text-neutral-400">Manage student registration programs</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <CirclePlus />
          Create PPDB
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <SearchInput
              v-model="searchQuery"
              placeholder="Search PPDB programs..."
              @input="onSearchInput"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="statusFilter"
              @change="handleFilterChange"
              class="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <!-- PPDB DataTable -->
      <DataTable
        :columns="ppdbColumns"
        :data="ppdbData"
        :loading="isFetching"
        :dropdown-actions="ppdbDropdownActions"
        empty-message="No PPDB programs found"
      >
        <template #cell-start_date="{ value }">
          {{ new Date(value).toLocaleDateString() }}
        </template>
        <template #cell-end_date="{ value }">
          {{ new Date(value).toLocaleDateString() }}
        </template>
        <template #cell-status="{ row }">
          <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(row)]">
            {{ getStatus(row) }}
          </span>
        </template>
      </DataTable>

      <!-- Create/Edit PPDB Modal -->
      <PPDBModal
        v-if="showCreateModal || showEditModal"
        :mode="showEditModal ? 'edit' : 'create'"
        :ppdb="selectedPPDB"
        :loading="creating"
        @close="closeModals"
        @submit="handleSubmit"
      />

      <!-- View Registrants Modal -->
      <RegistrantsModal
        v-if="showRegistrantsModal && selectedPPDB"
        :ppdb="selectedPPDB"
        :registrants="registrants"
        :loading="loadingRegistrants"
        @close="closeRegistrantsModal"
        @export="exportRegistrants"
      />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { CirclePlus } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import DataTable from '@/components/DataTable.vue'
import SearchInput from '@/components/SearchInput.vue'
import PPDBModal from '@/components/ppdb/PPDBModal.vue'
import RegistrantsModal from '@/components/ppdb/RegistrantsModal.vue'
import { ppdbService } from '@/services/ppdbService'
import { useAuth } from '@/stores/useAuth'
import type { TableColumn, DropdownAction } from '@/types/table'
import { Eye, Edit, Trash2, Users, Download } from 'lucide-vue-next'
import { useApi } from '@/stores/useApi'

const auth = useAuth()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showRegistrantsModal = ref(false)
const selectedPPDB = ref<any>(null)
const creating = ref(false)
const loadingRegistrants = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// Computed URL for API call
const apiUrl = computed(() => {
  const params = new URLSearchParams({
    school_id: auth.schoolId(),
    page: currentPage.value.toString(),
    page_size: pageSize.value.toString(),
  })

  if (searchQuery.value) {
    params.append('search', searchQuery.value)
  }

  if (statusFilter.value) {
    params.append('status', statusFilter.value)
  }

  return `/api/v1/ppdb?${params.toString()}`
})

// API call
const { data, isFetching, error, execute: refetch } = useApi(apiUrl).json()
const ppdbData = computed(() => data.value?.data || [])
const registrants = ref<any[]>([])

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

const getStatus = (ppdb: any) => {
  const now = new Date()
  const startDate = new Date(ppdb.start_date)
  const endDate = new Date(ppdb.end_date)

  if (now < startDate) return 'Upcoming'
  if (now > endDate) return 'Closed'
  return 'Active'
}

const getStatusColor = (ppdb: any) => {
  const status = getStatus(ppdb)
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'Upcoming':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'Closed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const viewRegistrants = async (ppdb: any) => {
  selectedPPDB.value = ppdb
  loadingRegistrants.value = true
  showRegistrantsModal.value = true

  try {
    const response = await ppdbService.getPPDBRegistrants({
      ppdb_id: ppdb.id,
    })
    const result = await response.json()
    registrants.value = result.data?.data || []
  } catch (error) {
    console.error('Failed to load registrants:', error)
    registrants.value = []
  } finally {
    loadingRegistrants.value = false
  }
}

const editPPDB = (ppdb: any) => {
  selectedPPDB.value = ppdb
  showEditModal.value = true
}

const deletePPDB = async (ppdbId: string) => {
  if (confirm('Are you sure you want to delete this PPDB program?')) {
    try {
      await ppdbService.deletePPDB(ppdbId).json()
      refetch()
    } catch (error) {
      console.error('Failed to delete PPDB:', error)
    }
  }
}

const handleSubmit = async (formData: any) => {
  creating.value = true
  try {
    if (showEditModal.value) {
      await ppdbService.updatePPDB({ ...formData, id: selectedPPDB.value.id }).json()
    } else {
      await ppdbService.createPPDB(formData).json()
    }
    closeModals()
    refetch()
  } catch (error) {
    console.error('Failed to save PPDB:', error)
  } finally {
    creating.value = false
  }
}

const exportRegistrants = async () => {
  try {
    const response = await ppdbService.exportRegistrants(selectedPPDB.value.id)
    // Handle file download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ppdb-registrants-${selectedPPDB.value.name}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export registrants:', error)
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedPPDB.value = null
}

const closeRegistrantsModal = () => {
  showRegistrantsModal.value = false
  selectedPPDB.value = null
  registrants.value = []
}

// Table configuration
const ppdbColumns: TableColumn[] = [
  { key: 'name', title: 'Name' },
  { key: 'description', title: 'Description' },
  { key: 'start_date', title: 'Start Date' },
  { key: 'end_date', title: 'End Date' },
  { key: 'max_registrants', title: 'Max Registrants' },
  { key: 'status', title: 'Status' },
]

const ppdbDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Registrants',
    icon: Users,
    handler: (ppdb: any) => viewRegistrants(ppdb),
    class: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    handler: (ppdb: any) => editPPDB(ppdb),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    handler: (ppdb: any) => deletePPDB(ppdb.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

watch(apiUrl, () => {
  if (!searchTimeout) {
    refetch()
  }
})
</script>
