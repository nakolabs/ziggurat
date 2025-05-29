<template>
  <div class="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-800">
        <thead class="bg-neutral-50 dark:bg-neutral-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Teacher
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Contact
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-neutral-50 dark:bg-neutral-900/90 divide-y divide-neutral-900">
          <tr v-if="loading">
            <td colspan="3" class="px-6 py-4 text-center text-neutral-400">Loading...</td>
          </tr>
          <tr v-else-if="!teachers.length">
            <td colspan="3" class="px-6 py-4 text-center text-neutral-400">No teachers found.</td>
          </tr>
          <tr
            v-else
            v-for="teacher in teachers"
            :key="teacher.id"
            class="transition-colors cursor-pointer hover:bg-orange-500/10"
            @click="$router.push(`/teacher/${teacher.id}`)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div
                    class="h-10 w-10 rounded-full bg-neutral-600 flex items-center justify-center"
                  >
                    <span class="text-sm font-medium">
                      {{ teacher.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium">{{ teacher.name }}</div>
                  <div class="text-sm">{{ teacher.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm">{{ teacher.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  teacher.is_verified
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
                ]"
              >
                {{ teacher.is_verified ? 'Verified' : 'Pending' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Teacher } from '@/types/response'

const router = useRouter()

defineProps<{
  teachers: Teacher[]
  loading: boolean
}>()
</script>
