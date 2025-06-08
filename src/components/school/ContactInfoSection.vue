<template>
  <div class="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
    <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
          <Phone class="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </div>
        <h2 class="text-lg font-medium text-neutral-900 dark:text-white">Contact Information</h2>
      </div>
    </div>
    
    <div class="p-6 space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormInput
          :model-value="formData.phone"
          @update:model-value="$emit('update:phone', $event)"
          label="Phone Number"
          placeholder="+1 234 567 8900"
        >
          <template #icon>
            <Phone class="w-4 h-4 text-neutral-400" />
          </template>
        </FormInput>

        <FormInput
          :model-value="formData.email"
          @update:model-value="$emit('update:email', $event)"
          type="email"
          label="Email Address"
          placeholder="info@school.edu"
        >
          <template #icon>
            <Mail class="w-4 h-4 text-neutral-400" />
          </template>
        </FormInput>
      </div>

      <FormInput
        :model-value="formData.website"
        @update:model-value="$emit('update:website', $event)"
        type="url"
        label="Website"
        optional
        placeholder="https://www.school.edu"
      >
        <template #icon>
          <Globe class="w-4 h-4 text-neutral-400" />
        </template>
      </FormInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, Mail, Globe } from 'lucide-vue-next'
import FormInput from '@/components/forms/FormInput.vue'

interface Props {
  formData: {
    phone: string
    email: string
    website: string
  }
}

defineProps<Props>()

defineEmits<{
  'update:phone': [value: string]
  'update:email': [value: string]
  'update:website': [value: string]
}>()
</script>
