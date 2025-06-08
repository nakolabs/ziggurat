<template>
  <div class="space-y-6 p-4">
    <!-- Header Section with Avatar and Basic Info -->
    <div class="bg-gradient-to-r from-orange-50 to-indigo-50 dark:from-orange-900/10 dark:to-indigo-900/10 rounded-2xl p-6">
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <!-- Enhanced Avatar Section -->
        <div class="relative">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-neutral-800 shadow-md ring-2 ring-white dark:ring-neutral-700">
            <img
              v-if="teacher.avatar"
              :src="teacher.avatar"
              :alt="teacher.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800">
              <div class="flex flex-col items-center text-gray-400 dark:text-gray-500">
                <User class="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <!-- Floating Edit Button -->
          <button
            @click="$emit('edit-avatar')"
            class="absolute bottom-0 right-0 w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
            title="Change Profile Photo"
          >
            <Camera class="w-3 h-3" />
          </button>
        </div>

        <!-- Basic Info Display -->
        <div class="flex-1 text-center sm:text-left">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">{{ teacher.name }}</h1>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ teacher.email }}</p>
          
          <!-- Status Badge -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2"
               :class="teacher.is_verified 
                 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                 : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'">
            <div class="w-1.5 h-1.5 rounded-full"
                 :class="teacher.is_verified ? 'bg-orange-600 dark:bg-orange-400' : 'bg-amber-600 dark:bg-amber-400'"></div>
            {{ teacher.is_verified ? 'Verified' : 'Pending' }}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-col gap-2">
          <button
            v-if="!isEditing"
            @click="startEdit"
            class="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
          >
            <Edit class="w-3.5 h-3.5" />
            Edit
          </button>
          
          <template v-else>
            <button
              @click="saveEdit"
              :disabled="isSaving"
              class="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
            >
              <div v-if="isSaving" class="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin"></div>
              <Save v-else class="w-3.5 h-3.5" />
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
            
            <button
              @click="cancelEdit"
              class="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Feedback Messages -->
    <div v-if="showSuccess" class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-3 rounded-r-lg">
      <div class="flex items-center gap-2">
        <CheckCircle class="w-4 h-4 text-green-400" />
        <p class="text-green-800 dark:text-green-400 text-sm font-medium">Profile updated successfully</p>
      </div>
    </div>

    <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-3 rounded-r-lg">
      <div class="flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-red-400" />
        <p class="text-red-800 dark:text-red-400 text-sm font-medium">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Personal Details Card -->
    <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <User class="w-4 h-4 text-orange-500" />
          Personal Information
        </h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Name Field -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <User class="w-3 h-3" />
              Full Name
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter full name"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ teacher.name || '-' }}</p>
            </div>
          </div>

          <!-- Email Field -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <Mail class="w-3 h-3" />
              Email Address
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter email address"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ teacher.email || '-' }}</p>
            </div>
          </div>

          <!-- Date of Birth -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              Date of Birth
            </label>
            <div class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">
                {{ teacher.date_of_birth ? formatDateOfBirth(teacher.date_of_birth) : '-' }}
              </p>
            </div>
          </div>

          <!-- Gender -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <Users class="w-3 h-3" />
              Gender
            </label>
            <select
              v-if="isEditing"
              v-model="editForm.gender"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm capitalize">{{ teacher.gender || '-' }}</p>
            </div>
          </div>

          <!-- Phone -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <Phone class="w-3 h-3" />
              Phone Number
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter phone number"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ teacher.phone || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Address - Full Width -->
        <div class="mt-5 space-y-1">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
            <MapPin class="w-3 h-3" />
            Address
          </label>
          <textarea
            v-if="isEditing"
            v-model="editForm.address"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm resize-none"
            placeholder="Enter complete address"
          ></textarea>
          <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
            <p class="text-gray-900 dark:text-white text-sm">{{ teacher.address || '-' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Parent/Guardian Information -->
    <div
      v-if="teacher.parent_name || teacher.parent_email || teacher.parent_phone"
      class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800"
    >
      <div class="px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Users class="w-4 h-4 text-purple-500" />
          Guardian Information
        </h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <User class="w-3 h-3" />
              Name
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.parent_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter guardian name"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ teacher.parent_name || '-' }}</p>
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <Mail class="w-3 h-3" />
              Email
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.parent_email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter guardian email"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ teacher.parent_email || '-' }}</p>
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <Phone class="w-3 h-3" />
              Phone
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.parent_phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
              placeholder="Enter guardian phone"
            />
            <div v-else class="px-3 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <p class="text-gray-900 dark:text-white text-sm">{{ teacher.parent_phone || '-' }}</p>
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
          Delete Teacher
        </h3>
        <p class="text-red-700 dark:text-red-300 text-xs mb-3">This action cannot be undone and will permanently delete all associated data.</p>
        
        <button
          @click="$emit('delete-teacher')"
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
  CheckCircle,
  AlertCircle,
  User,
  Users,
  Camera,
  Phone,
  Calendar,
  Mail,
  MapPin,
} from 'lucide-vue-next'
import type { Teacher } from '@/types/teacher'

const props = defineProps<{
  teacher: Teacher
}>()

const emit = defineEmits<{
  'update-teacher': [data: any]
  'delete-teacher': []
  'edit-avatar': []
}>()

const isEditing = ref(false)
const isSaving = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')

const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  gender: '',
  address: '',
  parent_name: '',
  parent_email: '',
  parent_phone: '',
})

const startEdit = () => {
  // Populate form with current data
  editForm.name = props.teacher.name || ''
  editForm.email = props.teacher.email || ''
  editForm.phone = props.teacher.phone || ''
  editForm.gender = props.teacher.gender || ''
  editForm.address = props.teacher.address || ''
  editForm.parent_name = props.teacher.parent_name || ''
  editForm.parent_email = props.teacher.parent_email || ''
  editForm.parent_phone = props.teacher.parent_phone || ''

  isEditing.value = true
  errorMessage.value = ''
  showSuccess.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  errorMessage.value = ''
}

const saveEdit = async () => {
  isSaving.value = true
  errorMessage.value = ''

  try {
    await emit('update-teacher', editForm)
    isEditing.value = false
    showSuccess.value = true

    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to update profile'
  } finally {
    isSaving.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateOfBirth(timestamp: string | number) {
  if (!timestamp) return '-'
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp)
  if (isNaN(date.getTime())) return '-'
  const now = new Date()
  const age = now.getFullYear() - date.getFullYear()
  return `${date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })} (${age} years old)`
}

const formatAge = (dateString: string) => {
  if (!dateString) return 0
  const birthDate = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
</script>
