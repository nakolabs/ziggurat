<template>
  <Container>
    <NavBar />
    <form
      class="max-w-md mx-auto mt-16 space-y-6 p-8 rounded-2xl shadow-lg"
      @submit.prevent="submitForm"
    >
      <h2 class="text-2xl font-bold text-center">Login Your Account</h2>
      <InputField v-model="form.email" :error="errors.email" label="Email" type="email" />

      <InputField
        v-model="form.password"
        :error="errors.password"
        label="Password"
        type="password"
      />

      <button
        class="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
        type="submit"
      >
        Login
      </button>

      <p v-if="success" class="text-green-500 text-center text-sm mt-4">
        🎉 Login successful! <br />Please check your email to confirm
      </p>
    </form>
  </Container>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import InputField from '@/components/inputField.vue'
import NavBar from '@/components/NavBar.vue'
import Container from '@/components/container.vue'
import { useApi } from '@/stores/useApi.ts'
import { useRouter } from 'vue-router'
import type { LoginResponse } from '@/types/response.ts'
import { useAuth } from '@/stores/useAuth.ts'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const success = ref(false)

const validate = () => {
  let valid = true
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Invalid email address'
  errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters'

  for (const field in errors) {
    if (errors[field as keyof typeof errors]) valid = false
  }

  return valid
}

async function submitForm() {
  if (validate()) {
    await postLogin()
  }
}

async function postLogin() {
  const url = '/api/v1/auth/login'
  const { response, data } = await useApi<LoginResponse>(url, {
    method: 'POST',
    body: JSON.stringify(form),
  }).json()

  if (data.value.code === 200) {
    const auth = useAuth()
    auth.set(data.value.data.access_token, data.value.data.refresh_token)
    success.value = true
    await router.push('/home')
  }
}
</script>
