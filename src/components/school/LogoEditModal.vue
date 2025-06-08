<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      class="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full mx-4 overflow-hidden"
      :class="showCropper ? 'max-w-3xl' : 'max-w-md'"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">Edit School Logo</h3>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            :disabled="isSaving"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Cropper View -->
        <div v-if="showCropper" class="space-y-6">
          <!-- Crop Container -->
          <div
            class="relative bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-inner"
          >
            <div class="relative" style="height: 500px">
              <canvas
                ref="cropCanvas"
                class="absolute inset-0 w-full h-full object-contain"
                @mousedown="startCrop"
                @mousemove="updateCrop"
                @mouseup="endCrop"
                @mouseleave="endCrop"
                @wheel="handleWheel"
                @mousemove.passive="updateCursor"
              ></canvas>
            </div>
          </div>
        </div>

        <!-- Upload View -->
        <div v-else>
          <!-- Current Logo Preview -->
          <div v-if="school?.logo_url" class="text-center">
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Current Logo</p>
            <div class="inline-block p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <img :src="school.logo_url" :alt="school.name" class="w-16 h-16 object-contain" />
            </div>
          </div>

          <!-- Upload Area -->
          <div class="space-y-4">
            <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {{ school?.logo_url ? 'Upload New Logo' : 'Upload Logo' }}
            </label>

            <!-- Drag & Drop Area -->
            <div
              @dragover.prevent="handleDragOver"
              @dragenter.prevent="handleDragEnter"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
              class="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
              :class="[
                isDragOver
                  ? 'border-blue-400 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500',
                'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
              ]"
            >
              <!-- Upload Icon -->
              <div class="mb-4">
                <svg
                  class="w-12 h-12 mx-auto text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <!-- Upload Text -->
              <div class="space-y-2">
                <p class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {{ isDragOver ? 'Drop your logo here' : 'Click to upload or drag and drop' }}
                </p>
                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                  PNG, JPG, JPEG, SVG, WebP up to 5MB
                </p>
              </div>

              <!-- Hidden File Input -->
              <input
                ref="fileInput"
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/svg+xml,image/webp"
                @change="handleFileSelect"
                class="sr-only"
              />
            </div>

            <!-- File Preview -->
            <div v-if="selectedFile" class="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-white dark:bg-neutral-700 rounded-lg p-2">
                    <img :src="previewUrl" alt="Preview" class="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-neutral-900 dark:text-white">
                      {{ selectedFile.name }}
                    </p>
                    <p class="text-xs text-neutral-500 dark:text-neutral-400">
                      {{ formatFileSize(selectedFile.size) }}
                    </p>
                  </div>
                </div>
                <button
                  @click="removeSelectedFile"
                  class="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                  :disabled="isSaving"
                >
                  <svg
                    class="w-4 h-4 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3"
            >
              <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
            </div>
          </div>

          <!-- Remove Current Logo Option -->
          <div
            v-if="school?.logo_url && !selectedFile"
            class="pt-4 border-t border-neutral-200 dark:border-neutral-700"
          >
            <button
              @click="handleRemoveLogo"
              class="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
              :disabled="isSaving"
            >
              Remove Current Logo
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700"
      >
        <div class="flex justify-end space-x-3">
          <button
            @click="showCropper ? backToUpload() : $emit('close')"
            class="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            :disabled="isSaving"
          >
            {{ showCropper ? 'Back' : 'Cancel' }}
          </button>
          <button
            @click="showCropper ? handleCropSave() : null"
            v-if="showCropper"
            :disabled="isSaving"
            class="px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg v-if="isSaving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ isSaving ? 'Saving...' : 'Save Logo' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useCropper } from '@/composables/useCropper'

interface School {
  id: string
  name: string
  logo_url?: string
}

interface Props {
  school: School
  isSaving: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', file: File): void
  (e: 'remove-logo'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use the cropper composable
const {
  cropCanvas,
  previewCanvas,
  cropState,
  loadImage,
  initializeCropper,
  startCrop,
  updateCrop,
  endCrop,
  resetCrop,
  getCroppedFile,
  reset: resetCropper,
  handleWheel,
  updateCursor,
} = useCropper({
  outputWidth: 512,
  outputHeight: 512,
  initialCropRatio: 0.8,
  quality: 0.9,
  outputFormat: 'image/png',
  minCropSize: 50,
  maxCropSize: 800,
})

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File>()
const isDragOver = ref(false)
const error = ref('')
const dragCounter = ref(0)
const showCropper = ref(false)

const previewUrl = computed(() => {
  if (selectedFile.value) {
    return URL.createObjectURL(selectedFile.value)
  }
  return ''
})

// Cleanup preview URL when component unmounts
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    const file = files[0]
    validateAndSetFile(file)
  }

  // Reset input value to allow selecting the same file again
  if (target) {
    target.value = ''
  }
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  dragCounter.value++
  isDragOver.value = true
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  dragCounter.value--

  if (dragCounter.value === 0) {
    isDragOver.value = false
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  dragCounter.value = 0

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    validateAndSetFile(file)
  }
}

const validateAndSetFile = async (file: File) => {
  error.value = ''

  // Clean up previous preview URL
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  // Validate file type
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    error.value = 'Please select a valid image file (PNG, JPG, JPEG, SVG, or WebP)'
    return
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    error.value = 'File size must be less than 5MB'
    return
  }

  try {
    selectedFile.value = file
    await loadImage(file)
    showCropper.value = true
    await nextTick()
    await initializeCropper()
  } catch (err) {
    error.value = 'Selected file is not a valid image'
    selectedFile.value = undefined
  }
}

const handleCropSave = async () => {
  if (!selectedFile.value) return

  try {
    const croppedFile = await getCroppedFile(selectedFile.value)
    emit('save', croppedFile)
  } catch (err) {
    error.value = 'Failed to crop image'
  }
}

const backToUpload = () => {
  showCropper.value = false
  selectedFile.value = undefined
  resetCropper()
}

const removeSelectedFile = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  selectedFile.value = undefined
  error.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleRemoveLogo = () => {
  emit('remove-logo')
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
