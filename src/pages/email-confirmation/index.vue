<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/stores/useApi.ts'
import { onMounted, ref, computed } from 'vue'
import type { Response } from '@/types/response.ts'

const route = useRoute()
const router = useRouter()
const token = route.query.token
const email = route.query.email
const confirmationType = route.query.type

const loading = ref(true)
const error = ref<string | null>(null)
const userName = ref('')
const userPassword = ref('')
const setupLoading = ref(false)

// Computed properties for dynamic content
const isTeacher = computed(() => confirmationType === 'invite_teacher')
const isStudent = computed(() => confirmationType === 'invite_student')
const isInviteFlow = computed(() => isTeacher.value || isStudent.value)

const setupTitle = computed(() => 'Complete Your Setup')
const setupDescription = computed(() => {
  if (isTeacher.value) return 'Welcome! Please set up your account to get started.'
  if (isStudent.value) return 'Welcome! Please set up your student account to get started.'
  return ''
})

onMounted(async () => {
  try {
    let url = ''
    switch (confirmationType) {
      case 'invite_teacher':
        url = '/api/v1/teacher/invite/verify'
        break
      case 'invite_student':
        url = '/api/v1/student/invite/verify'
        break
      case 'register':
        url = '/api/v1/auth/register/verify-email'
        break
      default:
        throw new Error('Invalid confirmation type')
    }
    const { response } = await useApi(url, {
      method: 'POST',
      body: JSON.stringify({
        email,
        token,
      }),
    })
    const body: Response<any> = await response.value?.json()
    if (body.code === 200) {
      if (confirmationType === 'register') {
        await router.push('/login')
      }
    } else {
      error.value = body.message || 'Failed to verify email'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})

const handleUserSetup = async () => {
  try {
    setupLoading.value = true
    error.value = null
    
    const endpoint = isTeacher.value 
      ? '/api/v1/teacher/invite/complete'
      : '/api/v1/student/invite/complete'
    
    const { response } = await useApi(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        email,
        token,
        name: userName.value,
        password: userPassword.value,
      }),
    })
    
    const body: Response<any> = await response.value?.json()
    if (body.code === 200) {
      await router.push('/login')
    } else {
      const errorType = isTeacher.value ? 'teacher' : 'student'
      error.value = body.message || `Failed to complete ${errorType} setup`
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    setupLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Verifying your email...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <img src="@/assets/logo.png" alt="Logo" class="w-full h-full object-contain opacity-50" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button 
          @click="router.push('/login')" 
          class="bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Back to Login
        </button>
      </div>

      <!-- Success States -->
      <div v-else class="bg-white rounded-lg shadow-sm p-8">
        <!-- User Setup Form (Teacher/Student) -->
        <div v-if="isInviteFlow">
          <div class="text-center mb-8">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <img src="@/assets/logo.png" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ setupTitle }}</h1>
            <p class="text-gray-600">{{ setupDescription }}</p>
          </div>

          <form @submit.prevent="handleUserSetup" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label for="user-name" class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input 
                  id="user-name" 
                  v-model="userName" 
                  type="text" 
                  required 
                  :disabled="setupLoading"
                  placeholder="Enter your full name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label for="user-password" class="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input 
                  id="user-password" 
                  v-model="userPassword" 
                  type="password" 
                  required 
                  :disabled="setupLoading"
                  placeholder="Create a secure password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="!userName.trim() || !userPassword.trim() || setupLoading"
              class="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg v-if="setupLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ setupLoading ? 'Setting up...' : 'Complete Setup' }}
            </button>
          </form>
        </div>

        <!-- Registration Success -->
        <div v-else class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <img src="@/assets/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
          <p class="text-gray-600 mb-6">Your email has been successfully verified. You can now log in to your account.</p>
          <button 
            @click="router.push('/login')" 
            class="bg-orange-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional custom styles if needed */
</style>
