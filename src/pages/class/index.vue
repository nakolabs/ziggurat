<template>
  <Dashboard>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Class Management</h1>
        <button
          @click="showCreateModal = true"
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <CirclePlus />
          Create Class
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 flex gap-4">
        <SearchInput v-model="searchQuery" placeholder="Search classes..." class="flex-1" />
      </div>

      <!-- Classes DataTable -->
      <DataTable
        :data="classes"
        :columns="classColumns"
        :dropdown-actions="classDropdownActions"
        :use-dropdown-actions="true"
        :loading="loading"
        :show-actions="true"
        loading-text="Loading classes..."
        empty-text="No classes found"
      >
        <template #cell-created_at="{ value }">
          <span class="text-sm text-gray-500">
            {{ new Date(value).toLocaleDateString() }}
          </span>
        </template>
      </DataTable>

      <!-- Create Class Modal -->
      <BaseModal
        v-if="showCreateModal"
        title="Create New Class"
        description="Enter the details for the new class"
        :fields="modalFields"
        :loading="creating"
        submit-text="Create Class"
        cancel-text="Cancel"
        @close="closeModal"
        @submit="createClass"
        @update:field="updateField"
      />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Eye, Edit, Trash2, Users, CirclePlus } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import SearchInput from '@/components/forms/SearchInput.vue'
import DataTable from '@/components/DataTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useApi } from '@/stores/useApi.ts'
import { useAuth } from '@/stores/useAuth'
import type { TableColumn, DropdownAction } from '@/types/table'

const searchQuery = ref('')
const showCreateModal = ref(false)
const creating = ref(false)
const newClass = ref({
  name: '',
  school_id: useAuth().get()?.payload.user.school_id || '',
})
const auth = useAuth()

// Fetch classes
const {
  data,
  isFetching: loading,
  error,
  execute: refetch,
} = useApi('/api/v1/class?school_id=' + auth.get()?.payload.user.school_id).json()
const classes = computed(() => data.value?.data || [])

const classColumns: TableColumn[] = [
  { key: 'name', title: 'Name' },
  { key: 'students', title: 'Students' },
  { key: 'created_at', title: 'Created At' },
]

const classDropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Details',
    icon: Eye,
    handler: (classItem: any) => viewClass(classItem),
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'students',
    label: 'Manage Students',
    icon: Users,
    handler: (classItem: any) => manageStudents(classItem),
    class: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    handler: (classItem: any) => editClass(classItem),
    class: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    handler: (classItem: any) => deleteClass(classItem.id),
    class: 'text-red-600 dark:text-red-400',
  },
]

function viewClass(classItem: any) {
  // TODO: Implement view functionality
  console.log('View class:', classItem)
}

function manageStudents(classItem: any) {
  // TODO: Implement manage students functionality
  console.log('Manage students for class:', classItem)
}

const modalFields = computed(() => [
  {
    key: 'name',
    label: 'Class Name',
    value: newClass.value.name,
    type: 'text',
    placeholder: 'Enter class name',
    required: true,
  },
])

function closeModal() {
  showCreateModal.value = false
  newClass.value.name = ''
}

function updateField({ key, value }: { key: string; value: string }) {
  if (key === 'name') {
    newClass.value.name = value
  }
}

async function createClass() {
  creating.value = true
  try {
    const { data } = await useApi('/api/v1/class', {
      method: 'POST',
      body: JSON.stringify(newClass.value),
    }).json()

    if (data.value.code !== 200) {
      console.error('Error creating class:', data.value.message)
      return
    }
    closeModal()
    refetch() // Refresh the classes list
  } catch (error) {
    console.error('Error creating class:', error)
  } finally {
    creating.value = false
  }
}

function editClass(classItem: any) {
  // TODO: Implement edit functionality
  console.log('Edit class:', classItem)
}

async function deleteClass(classId: string) {
  if (confirm('Are you sure you want to delete this class?')) {
    try {
      // TODO: Implement delete functionality
      console.log('Delete class:', classId)
    } catch (error) {
      console.error('Failed to delete class:', error)
    }
  }
}
</script>
