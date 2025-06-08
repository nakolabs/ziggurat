<template>
  <div class="space-y-6">
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">School Information</h2>
        
        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <button
            v-if="!isEditMode"
            @click="$emit('edit')"
            class="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit class="w-4 h-4" />
            Edit
          </button>
          <template v-else>
            <button
              @click="$emit('cancel')"
              class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              @click="$emit('save')"
              :disabled="isSaving"
              class="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <div v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </template>
          <button
            @click="$emit('delete')"
            class="px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 class="w-4 h-4" />
            <span class="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <FormField
            label="School Name"
            :is-edit="isEditMode"
            :value="school?.name"
            v-model="form.name"
            type="text"
            placeholder="Enter school name"
            required
          />
          
          <FormField
            label="Education Level"
            :is-edit="isEditMode"
            :value="formatLevel(school?.level)"
            v-model="form.level"
            type="select"
            :options="levelOptions"
          />

          <FormField
            label="Phone"
            :is-edit="isEditMode"
            :value="school?.phone"
            v-model="form.phone"
            type="tel"
            placeholder="Enter phone number"
          />

          <FormField
            label="Address"
            :is-edit="isEditMode"
            :value="school?.address"
            v-model="form.address"
            type="textarea"
            placeholder="Enter address"
            :rows="2"
          />

          <FormField
            label="City"
            :is-edit="isEditMode"
            :value="school?.city"
            v-model="form.city"
            type="text"
            placeholder="Enter city"
          />
        </div>

        <div class="space-y-4">
          <FormField
            label="Email"
            :is-edit="isEditMode"
            :value="school?.email"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
          />
          
          <FormField
            label="Website"
            :is-edit="isEditMode"
            :value="school?.website"
            v-model="form.website"
            type="url"
            placeholder="Enter website URL"
            :is-link="true"
          />

          <FormField
            label="Province"
            :is-edit="isEditMode"
            :value="school?.province"
            v-model="form.province"
            type="text"
            placeholder="Enter province"
          />

          <FormField
            label="Postal Code"
            :is-edit="isEditMode"
            :value="school?.postal_code"
            v-model="form.postal_code"
            type="text"
            placeholder="Enter postal code"
          />

          <div>
            <label class="block text-sm text-neutral-500 dark:text-neutral-400 mb-1">Status</label>
            <span class="inline-flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-sm">
              Active
            </span>
          </div>

          <div>
            <label class="block text-sm text-neutral-500 dark:text-neutral-400 mb-1">Created By</label>
            <p class="text-neutral-700 dark:text-neutral-300">{{ school?.created_by || '-' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm text-neutral-500 dark:text-neutral-400 mb-2">Description</label>
      <div v-if="!isEditMode" class="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
        <p class="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          {{ school?.description || '-' }}
        </p>
      </div>
      <textarea
        v-else
        v-model="form.description"
        rows="4"
        class="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        placeholder="Enter school description"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Trash2 } from 'lucide-vue-next'
import FormField from './FormField.vue'
import type { UpdateSchoolProfileRequest } from '@/services/schoolService'

interface Props {
  school?: any
  form: UpdateSchoolProfileRequest
  isEditMode: boolean
  isSaving: boolean
}

defineProps<Props>()

defineEmits<{
  edit: []
  cancel: []
  save: []
  delete: []
}>()

const levelOptions = [
  { value: 'elementary', label: 'Elementary School' },
  { value: 'junior', label: 'Junior High School' },
  { value: 'senior', label: 'Senior High School' },
  { value: 'university', label: 'University' }
]

const formatLevel = (level: string) => {
  if (!level) return '-'
  
  const levelMap: Record<string, string> = {
    'elementary': 'Elementary School',
    'junior': 'Junior High School', 
    'senior': 'Senior High School',
    'university': 'University'
  }
  
  return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1)
}
</script>
