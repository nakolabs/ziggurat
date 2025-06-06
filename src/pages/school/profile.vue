<template>
  <Dashboard>
    <div class="p-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">School Profile</h1>
          <p class="text-neutral-400">Manage your school information and settings</p>
        </div>
        <button
          v-if="!isEditing"
          @click="startEditing"
          class="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Edit class="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isFetching" class="flex items-center justify-center py-12">
        <div
          class="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="schoolData" class="space-y-6">
        <!-- Basic Information -->
        <div
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6"
        >
          <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
          <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >School Name</label
              >
              <p class="mt-1 text-neutral-900 dark:text-white">{{ schoolData.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >Level</label
              >
              <p class="mt-1 text-neutral-900 dark:text-white">{{ schoolData.level }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >Description</label
              >
              <p class="mt-1 text-neutral-900 dark:text-white">
                {{ schoolData.description || 'No description provided' }}
              </p>
            </div>
          </div>

          <!-- Edit Form -->
          <form v-else @submit.prevent="saveProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >School Name</label
                >
                <input
                  v-model="editForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >Level</label
                >
                <select
                  v-model="editForm.level"
                  required
                  class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="Elementary">Elementary</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="University">University</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >Description</label
              >
              <textarea
                v-model="editForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                placeholder="Enter school description..."
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Contact Information -->
        <div
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6"
        >
          <h2 class="text-lg font-semibold mb-4">Contact Information</h2>
          <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >Phone</label
              >
              <p class="mt-1 text-neutral-900 dark:text-white">
                {{ schoolData.phone || 'Not provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >Email</label
              >
              <p class="mt-1 text-neutral-900 dark:text-white">
                {{ schoolData.email || 'Not provided' }}
              </p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >Website</label
              >
              <p class="mt-1 text-neutral-900 dark:text-white">
                <a
                  v-if="schoolData.website"
                  :href="schoolData.website"
                  target="_blank"
                  class="text-orange-500 hover:text-orange-600"
                >
                  {{ schoolData.website }}
                </a>
                <span v-else>Not provided</span>
              </p>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >Phone</label
              >
              <input
                v-model="editForm.phone"
                type="tel"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                placeholder="Enter phone number..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >Email</label
              >
              <input
                v-model="editForm.email"
                type="email"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                placeholder="Enter email address..."
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >Website</label
              >
              <input
                v-model="editForm.website"
                type="url"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                placeholder="Enter website URL..."
              />
            </div>
          </div>
        </div>

        <!-- Address -->
        <div
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6"
        >
          <h2 class="text-lg font-semibold mb-4">Address</h2>
          <div v-if="!isEditing" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >Street Address</label
              >
              <p class="mt-1 text-neutral-900 dark:text-white">
                {{ schoolData.address || 'Not provided' }}
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >City</label
                >
                <p class="mt-1 text-neutral-900 dark:text-white">
                  {{ schoolData.city || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >Province</label
                >
                <p class="mt-1 text-neutral-900 dark:text-white">
                  {{ schoolData.province || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >Postal Code</label
                >
                <p class="mt-1 text-neutral-900 dark:text-white">
                  {{ schoolData.postal_code || 'Not provided' }}
                </p>
              </div>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >Street Address</label
              >
              <input
                v-model="editForm.address"
                type="text"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                placeholder="Enter street address..."
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >City</label
                >
                <input
                  v-model="editForm.city"
                  type="text"
                  class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  placeholder="Enter city..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >Province</label
                >
                <input
                  v-model="editForm.province"
                  type="text"
                  class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  placeholder="Enter province..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >Postal Code</label
                >
                <input
                  v-model="editForm.postal_code"
                  type="text"
                  class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  placeholder="Enter postal code..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons for Edit Mode -->
        <div v-if="isEditing" class="flex justify-end gap-3">
          <button
            @click="cancelEdit"
            type="button"
            class="px-4 py-2 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            @click="saveProfile"
            :disabled="saving"
            class="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <div
              v-if="saving"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            <Save v-else class="w-4 h-4" />
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Edit, Save } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import { schoolService, type UpdateSchoolProfileRequest } from '@/services/schoolService'
import { useAuth } from '@/stores/useAuth'

const auth = useAuth()
const schoolId = computed(() => auth.get()?.payload.user.school_id || '')

// Fetch school data
const { data, isFetching, execute: refetch } = schoolService.getSchoolProfile(schoolId.value).json()
const schoolData = computed(() => data.value?.data)

// Edit state
const isEditing = ref(false)
const saving = ref(false)
const editForm = ref<UpdateSchoolProfileRequest>({
  name: '',
  level: '',
  description: '',
  address: '',
  city: '',
  province: '',
  postal_code: '',
  phone: '',
  email: '',
  website: '',
})

// Initialize form when data loads
watch(
  schoolData,
  (newData) => {
    if (newData) {
      editForm.value = {
        name: newData.name,
        level: newData.level,
        description: newData.description || '',
        address: newData.address || '',
        city: newData.city || '',
        province: newData.province || '',
        postal_code: newData.postal_code || '',
        phone: newData.phone || '',
        email: newData.email || '',
        website: newData.website || '',
      }
    }
  },
  { immediate: true },
)

const startEditing = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  // Reset form to original data
  if (schoolData.value) {
    editForm.value = {
      name: schoolData.value.name,
      level: schoolData.value.level,
      description: schoolData.value.description || '',
      address: schoolData.value.address || '',
      city: schoolData.value.city || '',
      province: schoolData.value.province || '',
      postal_code: schoolData.value.postal_code || '',
      phone: schoolData.value.phone || '',
      email: schoolData.value.email || '',
      website: schoolData.value.website || '',
    }
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await schoolService.updateSchoolProfile(schoolId.value, editForm.value).json()
    isEditing.value = false
    await refetch()
  } catch (error) {
    console.error('Failed to update school profile:', error)
  } finally {
    saving.value = false
  }
}
</script>
