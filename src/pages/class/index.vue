<template>
  <Dashboard>
    <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Page Title with Action Button -->
        <div class="flex items-center justify-between mb-8">
          <div></div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
          >
            <CirclePlus class="w-4 h-4" />
            Create Class
          </button>
        </div>

        <!-- Clean Statistics Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Classes</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ classes.length }}
                </p>
              </div>
              <School class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Classes</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ activeClasses }}
                </p>
              </div>
              <Users class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Students</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ totalStudents }}
                </p>
              </div>
              <GraduationCap class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Size</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ averageClassSize }}
                </p>
              </div>
              <TrendingUp class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 p-6 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search classes..."
                  class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Clean Data Table -->
        <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
          <DataTable
            :data="filteredClasses"
            :columns="classColumns"
            :dropdown-actions="classDropdownActions"
            :use-dropdown-actions="true"
            :loading="loading"
            :show-actions="true"
            :clickable-rows="true"
            loading-text="Loading classes..."
            empty-text="No classes found"
            @row-click="handleRowClick"
          >
            <!-- Clean Class Cell -->
            <template #cell-class="{ item }">
              <div class="flex items-center gap-3 py-2">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <School class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.description || 'No description' }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Student Count Badge -->
            <template #cell-students="{ value }">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  {{ value || 0 }} students
                </span>
              </div>
            </template>

            <!-- Clean Date Format -->
            <template #cell-created_at="{ value }">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(value) }}
              </div>
            </template>
          </DataTable>
        </div>

        <!-- Create Class Modal -->
        <div
          v-if="showCreateModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md mx-4">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Class</h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="createClass" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class Name
                </label>
                <input
                  v-model="newClass.name"
                  type="text"
                  placeholder="Enter class name"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  v-model="newClass.description"
                  placeholder="Enter class description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="creating"
                  class="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <div v-if="creating" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {{ creating ? 'Creating...' : 'Create Class' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Eye, Edit, Trash2, Users, CirclePlus, School, GraduationCap, TrendingUp, Search, X } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import DataTable from '@/components/DataTable.vue'
import { useApi } from '@/stores/useApi.ts'
import { useAuth } from '@/stores/useAuth'
import type { TableColumn, DropdownAction } from '@/types/table'

const searchQuery = ref('')
const showCreateModal = ref(false)
const creating = ref(false)
const newClass = ref({
  name: '',
  description: '',
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

// Computed statistics
const activeClasses = computed(() => classes.value.filter((c: any) => c.status === 'active').length)
const totalStudents = computed(() => classes.value.reduce((sum: number, c: any) => sum + (c.students || 0), 0))
const averageClassSize = computed(() => {
  const total = totalStudents.value
  const count = classes.value.length
  return count > 0 ? Math.round(total / count) : 0
})

// Filtered classes based on search
const filteredClasses = computed(() => {
  if (!searchQuery.value) return classes.value
  return classes.value.filter((classItem: any) =>
    classItem.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const classColumns: TableColumn[] = [
  {
    key: 'class',
    title: 'Class',
    width: '300px',
  },
  {
    key: 'students',
    title: 'Students',
    width: '120px',
  },
  {
    key: 'created_at',
    title: 'Created',
    width: '120px',
  },
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

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleRowClick = (classItem: any) => {
  // TODO: Navigate to class detail page
  console.log('Navigate to class:', classItem.id)
}

function viewClass(classItem: any) {
  // TODO: Implement view functionality
  console.log('View class:', classItem)
}

function manageStudents(classItem: any) {
  // TODO: Implement manage students functionality
  console.log('Manage students for class:', classItem)
}

function closeModal() {
  showCreateModal.value = false
  newClass.value = {
    name: '',
    description: '',
    school_id: auth.get()?.payload.user.school_id || '',
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
