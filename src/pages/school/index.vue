<template>
  <Dashboard>
    <main class="p-6 overflow-auto">
      <!-- Create School Button -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Schools</h1>
        <button
          @click="openCreateModal"
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <CirclePlus />
          Create School
        </button>
      </div>

      <!-- Modal -->
      <BaseModal
        v-if="showModal"
        :title="isEditing ? 'Edit School' : 'Create New School'"
        :description="isEditing ? 'Update school information' : 'Add a new school to the system'"
        :fields="modalFields"
        :loading="isCreating"
        :submit-text="isEditing ? 'Update School' : 'Create School'"
        @close="closeModal"
        @submit="handleSubmit"
        @update:field="updateField"
      />

      <DataTable
        :data="data?.data"
        :columns="columns"
        :loading="isFetching"
        :dropdown-actions="dropdownActions"
        :use-dropdown-actions="true"
        :show-actions="true"
        loading-text="Loading schools..."
        empty-text="No schools found"
      />
    </main>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'
import DataTable from '@/components/DataTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import { CirclePlus, Edit, Trash2, ArrowRightLeft, Eye } from 'lucide-vue-next'
import type { TableColumn } from '@/components/DataTable.vue'
import type { DropdownAction } from '@/types/table'
import { useAuth } from '@/stores/useAuth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()
const { data, isFetching, execute: refresh } = useApi('/api/v1/school').json()

const columns: TableColumn[] = [
  {
    key: 'name',
    title: 'Name',
  },
  {
    key: 'level',
    title: 'Level',
  },
]

const dropdownActions: DropdownAction[] = [
  {
    key: 'view',
    label: 'View Details',
    icon: Eye,
    handler: (item) => router.push(`/school/${item.id}`),
    class: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
  },
  {
    key: 'switch',
    label: 'Switch to School',
    icon: ArrowRightLeft,
    handler: (item) => switchSchool(item),
    class: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
  },
  {
    key: 'edit',
    label: 'Edit School',
    icon: Edit,
    handler: (item) => openEditModal(item),
    class: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
  },
  {
    key: 'delete',
    label: 'Delete School',
    icon: Trash2,
    handler: (item) => deleteSchool(item),
    class: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300',
  },
]

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const formData = ref({
  name: '',
  level: '',
})

const isCreating = ref(false)

const modalFields = computed(() => [
  {
    key: 'name',
    label: 'Name',
    value: formData.value.name,
    type: 'text',
    placeholder: 'Enter school name',
    required: true,
  },
  {
    key: 'level',
    label: 'Level',
    value: formData.value.level,
    type: 'text',
    placeholder: 'Enter school level',
    required: true,
  },
])

const updateField = ({ key, value }: { key: string; value: string }) => {
  formData.value[key as keyof typeof formData.value] = value
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = { name: '', level: '' }
  showModal.value = true
}

const openEditModal = (school: any) => {
  isEditing.value = true
  editingId.value = school.id
  formData.value = {
    name: school.name,
    level: school.level,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = { name: '', level: '' }
}

const handleSubmit = async () => {
  if (isEditing.value) {
    await updateSchool()
  } else {
    await createSchool()
  }
}

const createSchool = async () => {
  isCreating.value = true
  try {
    await useApi('/api/v1/school').post(formData.value).json()
    closeModal()
    await refresh()
  } catch (error) {
    console.error('Failed to create school:', error)
  } finally {
    isCreating.value = false
  }
}

const updateSchool = async () => {
  if (!editingId.value) return

  isCreating.value = true
  try {
    await useApi(`/api/v1/school/${editingId.value}`).put(formData.value).json()
    closeModal()
    await refresh()
  } catch (error) {
    console.error('Failed to update school:', error)
  } finally {
    isCreating.value = false
  }
}

const deleteSchool = async (school: any) => {
  if (!confirm(`Are you sure you want to delete "${school.name}"?`)) {
    return
  }

  try {
    await useApi(`/api/v1/school/${school.id}`).delete().json()
    await refresh()
  } catch (error) {
    console.error('Failed to delete school:', error)
  }
}

const switchSchool = async (school: any) => {
  if (!confirm(`Switch to "${school.name}"?`)) {
    return
  }

  try {
    const { data: switchData } = await useApi(`/api/v1/school/${school.id}/switch`).json()

    if (switchData.value?.code === 200) {
      // Update the auth token with the new school context
      const newAccessToken = switchData.value.data.access_token
      const newRefreshToken = switchData.value.data.access_token
      auth.set(newAccessToken, newRefreshToken)

      // Show success message
      alert(`Successfully switched to ${school.name}`)

      // Optionally reload the page to reflect the new school context
      window.location.reload()
    } else {
      console.error('Failed to switch school:', switchData.value?.message)
      alert('Failed to switch school. Please try again.')
    }
  } catch (error) {
    console.error('Failed to switch school:', error)
    alert('Failed to switch school. Please try again.')
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
