<template>
  <div class="space-y-3">
    <label class="block text-sm text-neutral-500 dark:text-neutral-400">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Current Image Display -->
    <div v-if="currentImage || previewUrl" class="relative group">
      <div 
        class="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800"
        :class="imageClasses"
      >
        <img 
          :src="previewUrl || currentImage" 
          :alt="label"
          class="w-full h-full object-cover"
        />
        
        <!-- Overlay with actions -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            @click="triggerFileInput"
            class="px-3 py-1.5 bg-white text-neutral-900 rounded-md text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            Change
          </button>
          <button
            type="button"
            @click="removeImage"
            class="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    
    <!-- Upload Area -->
    <div 
      v-else
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
      class="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 transition-colors"
      :class="imageClasses"
    >
      <div class="flex flex-col items-center gap-2">
        <Upload class="w-8 h-8 text-neutral-400" />
        <div>
          <p class="text-sm font-medium text-neutral-900 dark:text-white">{{ uploadText }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ supportedFormats }}</p>
        </div>
      </div>
    </div>
    
    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload } from 'lucide-vue-next'

interface Props {
  label: string
  currentImage?: string
  modelValue?: File | null
  accept?: string
  maxSize?: number // in MB
  required?: boolean
  uploadText?: string
  supportedFormats?: string
  aspectRatio?: 'square' | 'banner' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSize: 5,
  uploadText: 'Click to upload or drag and drop',
  supportedFormats: 'PNG, JPG, GIF up to 5MB',
  aspectRatio: 'auto'
})

const emit = defineEmits<{
  'update:modelValue': [file: File | null]
  'remove': []
}>()

const fileInput = ref<HTMLInputElement>()
const previewUrl = ref<string>()
const error = ref<string>()

const imageClasses = computed(() => {
  switch (props.aspectRatio) {
    case 'square':
      return 'aspect-square w-24'
    case 'banner':
      return 'aspect-[3/1] w-full max-w-md'
    default:
      return 'min-h-[120px]'
  }
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const validateFile = (file: File): boolean => {
  error.value = ''
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file'
    return false
  }
  
  // Check file size
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    error.value = `File size must be less than ${props.maxSize}MB`
    return false
  }
  
  return true
}

const processFile = (file: File) => {
  if (!validateFile(file)) return
  
  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  emit('update:modelValue', file)
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

const removeImage = () => {
  previewUrl.value = undefined
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', null)
  emit('remove')
}
</script>
