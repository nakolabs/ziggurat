<template>
  <Dashboard>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div class="max-w-3xl mx-auto px-6 py-8">
        <!-- Modern Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-light text-neutral-900 dark:text-white mb-2">
            Create School
          </h1>
          <p class="text-neutral-500 dark:text-neutral-400">
            {{ currentStep === 1 ? 'Enter school information' : 'Review and confirm' }}
          </p>
        </div>

        <!-- Step 1: Form -->
        <div v-if="currentStep === 1">
          <form @submit.prevent="proceedToReview" class="space-y-6">
            <BasicInfoSection 
              :form-data="{
                name: formData.name,
                level: formData.level,
                status: formData.status,
                description: formData.description || ''
              }" 
              :errors="errors" 
              :validate-field="validateField"
              @update:name="formData.name = $event"
              @update:level="formData.level = $event"
              @update:status="formData.status = $event"
              @update:description="formData.description = $event"
            />
            <ContactInfoSection 
              :form-data="{
                phone: formData.phone || '',
                email: formData.email || '',
                website: formData.website || ''
              }"
              @update:phone="formData.phone = $event"
              @update:email="formData.email = $event"
              @update:website="formData.website = $event"
            />
            <LocationSection 
              :form-data="{
                address: formData.address || '',
                city: formData.city || '',
                province: formData.province || '',
                postal_code: formData.postal_code || ''
              }"
              @update:address="formData.address = $event"
              @update:city="formData.city = $event"
              @update:province="formData.province = $event"
              @update:postal_code="formData.postal_code = $event"
            />

            <!-- Minimal Action Buttons -->
            <div class="flex items-center justify-between pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                @click="router.push('/school')"
                class="px-6 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="!isFormValid"
                class="px-8 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                :class="[
                  !isFormValid
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg'
                ]"
              >
                Continue
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Review -->
        <div v-else-if="currentStep === 2" class="space-y-6">
          <ReviewSection 
            :form-data="{
              ...formData,
              description: formData.description || '',
              address: formData.address || '',
              city: formData.city || '',
              province: formData.province || '',
              postal_code: formData.postal_code || '',
              phone: formData.phone || '',
              email: formData.email || '',
              website: formData.website || ''
            }" 
            @edit="currentStep = 1" 
          />

          <!-- Minimal Action Buttons -->
          <div class="flex items-center justify-between pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              @click="currentStep = 1"
              class="px-6 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft class="w-4 h-4" />
              Back
            </button>
            <button
              @click="handleSubmit"
              :disabled="isSubmitting"
              class="px-8 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
              :class="[
                isSubmitting
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg'
              ]"
            >
              <div
                v-if="isSubmitting"
                class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
              ></div>
              <Check v-else class="w-4 h-4" />
              {{ isSubmitting ? 'Creating...' : 'Create School' }}
            </button>
          </div>
        </div>

        <!-- Minimal Success Toast -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-4 scale-95"
        >
          <div
            v-if="showSuccess"
            class="fixed top-6 right-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-sm"
          >
            <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check class="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span class="text-sm font-medium">School created successfully</span>
          </div>
        </Transition>
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import BasicInfoSection from '@/components/school/BasicInfoSection.vue'
import ContactInfoSection from '@/components/school/ContactInfoSection.vue'
import LocationSection from '@/components/school/LocationSection.vue'
import ReviewSection from '@/components/school/ReviewSection.vue'
import ProgressSteps from '@/components/ui/ProgressSteps.vue'
import { useSchoolForm } from '@/composables/useSchoolForm'

const router = useRouter()
const isSubmitting = ref(false)
const showSuccess = ref(false)
const currentStep = ref(1)

const { formData, errors, validateField, isFormValid, submitForm } = useSchoolForm()

const proceedToReview = () => {
  if (!isFormValid.value) {
    return
  }
  currentStep.value = 2
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await submitForm()
    
    showSuccess.value = true
    setTimeout(() => {
      router.push('/school')
    }, 1500)
  } catch (error) {
    console.error('Failed to create school:', error)
    alert('Failed to create school. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
