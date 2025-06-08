<template>
  <div class="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
    <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
          <MapPin class="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </div>
        <h2 class="text-lg font-medium text-neutral-900 dark:text-white">Location</h2>
      </div>
    </div>
    
    <div class="p-6 space-y-6">
      <FormInput
        :model-value="formData.address"
        @update:model-value="$emit('update:address', $event)"
        label="Street Address"
        placeholder="123 Main Street"
      >
        <template #icon>
          <MapPin class="w-4 h-4 text-neutral-400" />
        </template>
      </FormInput>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FormInput
          :model-value="formData.city"
          @update:model-value="$emit('update:city', $event)"
          label="City"
          placeholder="Springfield"
        >
          <template #icon>
            <Building2 class="w-4 h-4 text-neutral-400" />
          </template>
        </FormInput>

        <FormInput
          :model-value="formData.province"
          @update:model-value="$emit('update:province', $event)"
          label="Province/State"
          placeholder="California"
        >
          <template #icon>
            <Map class="w-4 h-4 text-neutral-400" />
          </template>
        </FormInput>

        <FormInput
          :model-value="formData.postal_code"
          @update:model-value="$emit('update:postal_code', $event)"
          label="Postal Code"
          placeholder="12345"
        >
          <template #icon>
            <Hash class="w-4 h-4 text-neutral-400" />
          </template>
        </FormInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Building2, Map, Hash } from 'lucide-vue-next'
import FormInput from '@/components/forms/FormInput.vue'

interface Props {
  formData: {
    address: string
    city: string
    province: string
    postal_code: string
  }
}

defineProps<Props>()

defineEmits<{
  'update:address': [value: string]
  'update:city': [value: string]
  'update:province': [value: string]
  'update:postal_code': [value: string]
}>()
</script>
