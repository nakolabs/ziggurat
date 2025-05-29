<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/stores/useApi.ts'
import { onMounted, ref } from 'vue'
import type { Response } from '@/types/response.ts'

const route = useRoute()
const router = useRouter()
const token = route.query.token
const email = route.query.email

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const { response } = await useApi('/api/v1/auth/register/verify-email', {
      method: 'POST',
      body: JSON.stringify({
        email,
        token,
      }),
    })
    const body: Response<any> = await response.value?.json()
    if (body.code === 200) {
      await router.push('/login')
    }
  } catch (err) {
    error.value = err.message || 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <p v-else>success</p>
  </div>
</template>
