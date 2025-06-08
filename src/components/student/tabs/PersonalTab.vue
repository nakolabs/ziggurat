<template>
  <div class="space-y-6 p-4">
    <!-- Header Section with Avatar and Basic Info -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-6">
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <!-- Enhanced Avatar Section -->
        <div class="relative">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-neutral-800 shadow-md ring-2 ring-white dark:ring-neutral-700">
            <img
              v-if="student.avatar"
              :src="student.avatar"
              :alt="student.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800">
              <User class="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          
          <!-- Floating Edit Button -->
          <button
            @click="$emit('edit-avatar')"
            class="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
            title="Change Profile Photo"
          >
            <Camera class="w-3 h-3" />
          </button>
        </div>

        <!-- Basic Info Display -->
        <div class="flex-1 text-center sm:text-left">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">{{ student.name }}</h1>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ student.email }}</p>
          
          <!-- Status Badge -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2"
               :class="student.is_verified 
                 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                 : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'">
            <div class="w-1.5 h-1.5 rounded-full"
                 :class="student.is_verified ? 'bg-green-600 dark:bg-green-400' : 'bg-amber-600 dark:bg-amber-400'"></div>
            {{ student.is_verified ? 'Verified' : 'Pending' }}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-col gap-2">
          <button
            v-if="!isEditing"
            @click="startEdit"
            class="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
          >
            <Edit class="w-3.5 h-3.5" />
            Edit
          </button>
          
          <div v-else class="flex gap-2">
            <button
              @click="saveChanges"
              :disabled="isSaving"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg text-xs font-medium transition-all duration-200"
            >
              <Save v-if="!isSaving" class="w-3 h-3" />
              <div v-else class="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
            <button
              @click="cancelEdit"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Details Card -->
    <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <User class="w-4 h-4 text-blue-500" />
          Personal Information
        </h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Student ID -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Student ID
            </label>
            <div class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ student.student_id || '-' }}</p>
            </div>
          </div>

          <!-- Grade -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Grade
            </label>
            <div class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">Grade {{ student.grade || '-' }}</p>
            </div>
          </div>

          <!-- Date of Birth -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Date of Birth
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.date_of_birth"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ formatDate(student.date_of_birth) || '-' }}</p>
            </div>
          </div>

          <!-- Gender -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Gender
            </label>
            <select
              v-if="isEditing"
              v-model="editForm.gender"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm capitalize">{{ student.gender || '-' }}</p>
            </div>
          </div>

          <!-- Phone -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Phone Number
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter phone number"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ student.phone || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Address - Full Width -->
        <div class="mt-5 space-y-1">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Address
          </label>
          <textarea
            v-if="isEditing"
            v-model="editForm.address"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm resize-none"
            placeholder="Enter complete address"
          ></textarea>
          <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
            <p class="text-gray-900 dark:text-white text-sm">{{ student.address || '-' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Parent/Guardian Information -->
    <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Users class="w-4 h-4 text-purple-500" />
          Guardian Information
        </h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- Guardian Name -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Name
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.parent_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter guardian name"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ student.parent_name || '-' }}</p>
            </div>
          </div>

          <!-- Guardian Email -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Email
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.parent_email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter guardian email"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ student.parent_email || '-' }}</p>
            </div>
          </div>

          <!-- Guardian Phone -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Phone
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.parent_phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter guardian phone"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ student.parent_phone || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30">
      <div class="px-5 py-4">
        <h3 class="text-sm font-semibold text-red-900 dark:text-red-400 flex items-center gap-2 mb-2">
          <Trash2 class="w-4 h-4" />
          Delete Student
        </h3>
        <p class="text-red-700 dark:text-red-300 text-xs mb-3">This action cannot be undone and will permanently delete all associated data.</p>
        
        <button
          @click="$emit('delete-student')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all duration-200"
        >
          <Trash2 class="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  Edit,
  Save,
  Trash2,
  User,
  Users,
  Camera,
} from 'lucide-vue-next'

const props = defineProps<{
  student: any
}>()

const emit = defineEmits<{
  'update-student': [data: any]
  'delete-student': []
  'edit-avatar': []
}>()

const isEditing = ref(false)
const isSaving = ref(false)

const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  gender: '',
  address: '',
  date_of_birth: '',
  parent_name: '',
  parent_email: '',
  parent_phone: '',
})

const startEdit = () => {
  // Populate form with current data
  Object.assign(editForm, {
    name: props.student.name || '',
    email: props.student.email || '',
    phone: props.student.phone || '',
    gender: props.student.gender || '',
    address: props.student.address || '',
    date_of_birth: props.student.date_of_birth || '',
    parent_name: props.student.parent_name || '',
    parent_email: props.student.parent_email || '',
    parent_phone: props.student.parent_phone || '',
  })
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveChanges = async () => {
  isSaving.value = true
  try {
    await emit('update-student', editForm)
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update student:', error)
  } finally {
    isSaving.value = false
  }
}

const formatDate = (timestamp: number | string) => {
  if (!timestamp) return '-'
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp)
  
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>