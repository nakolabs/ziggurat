<template>
  <Container>
    <NavBar/>
    <form class="max-w-md mx-auto mt-16 space-y-6  p-8 rounded-2xl shadow-lg" @submit.prevent="submitForm">
      <h2 class="text-2xl font-bold text-center">Create Your Account</h2>

      <InputField
          v-model="form.name"
          :error="errors.name"
          label="Name"
          type="text"
      />

      <InputField
          v-model="form.username"
          :error="errors.username"
          label="Username"
          type="text"
      />

      <InputField
          v-model="form.email"
          :error="errors.email"
          label="Email"
          type="email"
      />

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
        Register
      </button>

      <p v-if="success" class="text-green-500 text-center text-sm mt-4">
        🎉 Registration successful! <br/>Please check your email to confirm
      </p>
    </form>
  </Container>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import InputField from '@/components/inputField.vue'
import NavBar from "@/components/NavBar.vue";
import Container from "@/components/container.vue";
import {useApi} from "@/stores/useApi.ts";
import type {RegisterResponse} from "@/types/response.ts";

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

const errors = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

const success = ref(false)

const validate = () => {
  let valid = true
  errors.name = form.name.length >= 2 ? '' : 'Name must be at least 2 characters'
  errors.username = form.name.length >= 2 ? '' : 'Username must be at least 6 characters'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Invalid email address'
  errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters'

  for (const field in errors) {
    if (errors[field as keyof typeof errors]) valid = false
  }

  return valid
}

async function submitForm() {
  if (validate()) {
    await postRegister()
  }
}

async function postRegister() {
  const url = '/api/v1/auth/register'
  const {response} = await useApi(url, {
    method: 'POST',
    body: JSON.stringify(form),
  })

  const body: RegisterResponse = await response.value?.json()
  if (body.code === 200) {
    success.value = true
  }
}

</script>
