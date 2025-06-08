<template>
  <div class="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
    <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
            <FileCheck class="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </div>
          <h2 class="text-lg font-medium text-neutral-900 dark:text-white">Review Information</h2>
        </div>
        <button
          @click="$emit('edit')"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <Edit2 class="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
    
    <div class="p-6 space-y-8">
      <!-- Basic Information -->
      <div>
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center">
            <Building class="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">
            Basic Information
          </h3>
        </div>
        
        <div class="space-y-6">
          <!-- School Name -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
              School Name
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <School class="w-4 h-4 text-neutral-400" />
              </div>
              <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                {{ formData.name }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Education Level -->
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Education Level
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <GraduationCap class="w-4 h-4 text-neutral-400" />
                </div>
                <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                  {{ formatLevel(formData.level) }}
                </div>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Status
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Shield class="w-4 h-4 text-neutral-400" />
                </div>
                <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                  {{ formatStatus(formData.status) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="formData.description">
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
              Description
              <span class="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
            </label>
            <div class="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700 min-h-[76px]">
              {{ formData.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div v-if="formData.phone || formData.email || formData.website" class="border-t border-neutral-100 dark:border-neutral-800 pt-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center">
            <Phone class="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">
            Contact Information
          </h3>
        </div>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Phone -->
            <div v-if="formData.phone">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Phone Number
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Phone class="w-4 h-4 text-neutral-400" />
                </div>
                <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                  {{ formData.phone }}
                </div>
              </div>
            </div>

            <!-- Email -->
            <div v-if="formData.email">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Mail class="w-4 h-4 text-neutral-400" />
                </div>
                <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                  {{ formData.email }}
                </div>
              </div>
            </div>
          </div>

          <!-- Website -->
          <div v-if="formData.website">
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
              Website
              <span class="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Globe class="w-4 h-4 text-neutral-400" />
              </div>
              <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                {{ formData.website }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div v-if="formData.address || formData.city || formData.province || formData.postal_code" class="border-t border-neutral-100 dark:border-neutral-800 pt-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center">
            <MapPin class="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">
            Location
          </h3>
        </div>
        
        <div class="space-y-6">
          <!-- Street Address -->
          <div v-if="formData.address">
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
              Street Address
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <MapPin class="w-4 h-4 text-neutral-400" />
              </div>
              <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                {{ formData.address }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <!-- City -->
            <div v-if="formData.city">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                City
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Building2 class="w-4 h-4 text-neutral-400" />
                </div>
                <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                  {{ formData.city }}
                </div>
              </div>
            </div>

            <!-- Province -->
            <div v-if="formData.province">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Province/State
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Map class="w-4 h-4 text-neutral-400" />
                </div>
                <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                  {{ formData.province }}
                </div>
              </div>
            </div>

            <!-- Postal Code -->
            <div v-if="formData.postal_code">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Postal Code
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Hash class="w-4 h-4 text-neutral-400" />
                </div>
                <div class="w-full pl-10 pr-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border-gray-200 dark:border-neutral-700">
                  {{ formData.postal_code }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  FileCheck, 
  Edit2, 
  Building, 
  Phone, 
  MapPin, 
  School, 
  GraduationCap, 
  Shield, 
  FileText, 
  Mail, 
  Globe, 
  Building2, 
  Map, 
  Hash 
} from 'lucide-vue-next'

interface Props {
  formData: {
    name: string
    level: string
    status: string
    description: string
    phone: string
    email: string
    website: string
    address: string
    city: string
    province: string
    postal_code: string
  }
}

defineProps<Props>()

defineEmits<{
  edit: []
}>()

const formatLevel = (level: string) => {
  const levels = {
    elementary: 'Elementary School',
    junior: 'Junior High School', 
    senior: 'Senior High School',
    university: 'University'
  }
  return levels[level as keyof typeof levels] || level
}

const formatStatus = (status: string) => {
  const statuses = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending'
  }
  return statuses[status as keyof typeof statuses] || status
}
</script>
