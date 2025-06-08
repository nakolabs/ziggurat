<template>
  <Dashboard>
    <div class="bg-white dark:bg-neutral-950 min-h-screen">
      <UserHeader
        :user-info="userInfo"
        :school-data="schoolData?.data"
        :is-loading="isFetching"
        :is-admin="isAdmin"
        :current-date="currentDate"
      />

      <main class="max-w-7xl mx-auto px-6 py-8">
        <AdminDashboard v-if="isAdmin" />
        <SchoolDashboard v-else :teacher-data="data" />
      </main>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useApi } from '@/stores/useApi.ts'
import { useAuth } from '@/stores/useAuth'
import type { ListTeacherResponse } from '@/types/teacher'
import type { DetailSchoolResponse } from '@/types/school'

// Components
import Dashboard from '@/layout/dashboard.vue'
import UserHeader from '@/components/home/UserHeader.vue'
import AdminDashboard from '@/components/home/AdminDashboard.vue'
import SchoolDashboard from '@/components/home/SchoolDashboard.vue'

// Auth and user data
const auth = useAuth()
const userInfo = computed(() => auth.get()?.payload.user)
const isAdmin = computed(() => userInfo.value?.user_role === 'admin')

// School data for non-admin users
const {
  data: schoolData,
  isFetching,
} = useApi<DetailSchoolResponse>(`/api/v1/school/${userInfo?.value?.school_id}`).json()

// Teacher data for school dashboard
const { data } = useApi<ListTeacherResponse>(
  `/api/v1/teacher?school_id=${userInfo.value?.school_id}`,
)

// Current date formatting
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>
