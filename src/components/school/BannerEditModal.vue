<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-neutral-900 rounded-xl max-w-lg w-full p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">Update School Banner</h3>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-500"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
      
      <div class="space-y-4">
        <ImageUpload
          label="School Banner"
          :current-image="school?.banner"
          v-model="bannerFile"
          aspect-ratio="banner"
          upload-text="Upload school banner"
          supported-formats="PNG, JPG recommended (3:1 ratio)"
          :max-size="10"
          @remove="handleRemove"
        />
        
        <div class="flex items-center gap-3 pt-4">
          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            :disabled="isSaving || (!bannerFile && !removeBanner)"
            class="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <div v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ isSaving ? 'Saving...' : (removeBanner ? 'Remove Banner' : 'Save Banner') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import ImageUpload from './ImageUpload.vue'

interface Props {
  school?: any
  isSaving?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [file: File | null, remove: boolean]
}>()

const bannerFile = ref<File | null>(null)
const removeBanner = ref(false)

const handleRemove = () => {
  bannerFile.value = null
  removeBanner.value = true
}

const handleSave = () => {
  emit('save', bannerFile.value, removeBanner.value)
}
</script>
