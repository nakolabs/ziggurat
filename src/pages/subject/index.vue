<template>
  <Dashboard>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Subject Management</h1>
        <button
          @click="showCreateModal = true"
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <CirclePlus />
          Create Subject
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 flex gap-4">
        <SearchInput v-model="searchQuery" placeholder="Search subjects..." class="flex-1" />
      </div>

      <!-- Subjects DataTable -->
      <DataTable
        :data="subjects"
        :columns="subjectColumns"
        :dropdown-actions="subjectDropdownActions"
        :use-dropdown-actions="true"
        :loading="loading"
        :show-actions="true"
        loading-text="Loading subjects..."
        empty-text="No subjects found"
      >
        <template #cell-created_at="{ value }">
          <span class="text-sm text-gray-500">
            {{ new Date(value).toLocaleDateString() }}
          </span>
        </template>
      </DataTable>
    </div>

    <!-- Create Subject Modal -->
    <BaseModal
      v-if="showCreateModal"
      title="Add New Subject"
      submit-text="Create"
      :loading="creating"
      :fields="modalFields"
      @close="closeCreateModal"
      @submit="createSubject"
      @update:field="updateField"
    />
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Edit, Trash2, Eye, CirclePlus } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import SearchInput from '@/components/SearchInput.vue'
import DataTable from '@/components/DataTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useApi } from '@/stores/useApi.ts'
import { useAuth } from '@/stores/useAuth'
import type { TableColumn, DropdownAction } from '@/types/table'

const schoolID = useAuth().get()?.payload.user.school_id || ''
const searchQuery = ref('')
const showCreateModal = ref(false)

// Fetch subjects
const {
  data,
  isFetching: loading,
  error,
  execute: refetch,
} = useApi('/api/v1/subject?school_id=' + schoolID).json()
const subjects = computed(() => data.value?.data || [])

const newSubject = ref({
  name: '',
  school_id: schoolID,
})

const modalFields = computed(() => [
  {
    key: 'name',
    label: 'Subject Name',
    value: newSubject.value.name,
    type: 'text',
    placeholder: 'Enter subject name',
    required: true,
  },
])

const creating = ref(false)

const subjectColumns: TableColumn[] = [
  { key: 'name', title: 'Name' },
  { key: 'created_at', title: 'Created At' },
]

const subjectDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View',
    icon: Eye,
    handler: (subject: any) => viewSubject(subject),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    handler: (subject: any) => editSubject(subject),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    handler: (subject: any) => deleteSubject(subject.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

function viewSubject(subject: any) {
  // TODO: Implement view functionality
  console.log('View subject:', subject)
}

function editSubject(subject: any) {
  // TODO: Implement edit functionality
  console.log('Edit subject:', subject)
}

async function deleteSubject(subjectId: string) {
  if (confirm('Are you sure you want to delete this subject?')) {
    try {
      // TODO: Implement delete API call
      console.log('Delete subject:', subjectId)
    } catch (error) {
      console.error('Failed to delete subject:', error)
    }
  }
}

function updateField(update: { key: string; value: string }) {
  if (update.key === 'name') {
    newSubject.value.name = update.value
  }
}

function closeCreateModal() {
  showCreateModal.value = false
  newSubject.value.name = ''
}

async function createSubject() {
  if (!newSubject.value.name.trim()) return

  creating.value = true
  try {
    const { data } = await useApi('/api/v1/subject', {
      method: 'POST',
      body: JSON.stringify(newSubject.value),
    }).json()
    // await post(newSubject.value).json()

    if (data.value.code !== 200) {
      console.error('Error creating subject:', data.value.message)
      alert('Failed to create subject: ' + data.value.message)
      return
    }

    // Refresh the subjects list
    await refetch()

    // Close modal and reset form
    closeCreateModal()
  } catch (error) {
    console.error('Failed to create subject:', error)
    alert('Failed to create subject. Please try again.')
  } finally {
    creating.value = false
  }
}
</script>
