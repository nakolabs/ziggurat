<template>
  <div class="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
    <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
          <Building class="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </div>
        <h2 class="text-lg font-medium text-neutral-900 dark:text-white">Basic Information</h2>
      </div>
    </div>
    
    <div class="p-6 space-y-6">
      <FormInput
        :model-value="formData.name"
        @update:model-value="$emit('update:name', $event)"
        label="School Name"
        required
        placeholder="Springfield Elementary School"
        :error="errors.name"
        @blur="validateField('name')"
      >
        <template #icon>
          <School class="w-4 h-4 text-neutral-400" />
        </template>
      </FormInput>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormInput
          :model-value="formData.level"
          @update:model-value="$emit('update:level', $event)"
          type="select"
          label="Education Level"
          required
          placeholder="Choose level"
          :options="levelOptions"
          :error="errors.level"
          @blur="validateField('level')"
        >
          <template #icon>
            <GraduationCap class="w-4 h-4 text-neutral-400" />
          </template>
        </FormInput>

        <FormInput
          :model-value="formData.status"
          @update:model-value="$emit('update:status', $event)"
          type="select"
          label="Status"
          placeholder="Choose status"
          :options="statusOptions"
        >
          <template #icon>
            <Shield class="w-4 h-4 text-neutral-400" />
          </template>
        </FormInput>
      </div>

      <FormInput
        :model-value="formData.description"
        @update:model-value="$emit('update:description', $event)"
        type="textarea"
        label="Description"
        optional
        placeholder="Brief description about the school..."
        :rows="3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building, School, GraduationCap, Shield, FileText } from 'lucide-vue-next'
import FormInput from '@/components/forms/FormInput.vue'

interface Props {
  formData: {
    name: string
    level: string
    status: string
    description: string
  }
  errors: Record<string, string>
  validateField: (field: string) => void
}

defineProps<Props>()

const levelOptions = [
  { value: 'elementary', label: 'Elementary School' },
  { value: 'junior', label: 'Junior High School' },
  { value: 'senior', label: 'Senior High School' },
  { value: 'college', label: 'University' }
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' }
]

defineEmits<{
  'update:name': [value: string]
  'update:level': [value: string]
  'update:status': [value: string]
  'update:description': [value: string]
}>()
</script>
