<template>
  <Dashboard>
    <main class="p-6 overflow-auto">
      <div class="overflow-x-auto">
        <div v-if="isFetching">Loading....</div>
        <table v-else class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead class="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th class="px-4 py-2 border-b">Name</th>
              <th class="px-4 py-2 border-b">Level</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="user in data?.data" :key="user.id">
              <td class="px-4 py-2 border-b">{{ user.name }}</td>
              <td class="px-4 py-2 border-b">{{ user.level }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useApi } from '@/stores/useApi.ts'
import Dashboard from '@/layout/dashboard.vue'

const { data, isFetching } = useApi('/api/v1/school').json()
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
}
