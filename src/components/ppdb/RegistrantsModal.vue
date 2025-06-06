<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[80vh] overflow-hidden flex flex-col"
    >
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-lg font-semibold">Registrants - {{ ppdb.name }}</h3>
          <p class="text-sm text-neutral-500 mt-1">
            {{ registrants.length }} registrant{{ registrants.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="$emit('export')"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <Download class="w-4 h-4" />
            Export CSV
          </button>
          <button
            @click="$emit('close')"
            class="text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-hidden">
        <div class="h-full overflow-auto">
          <table class="w-full">
            <thead class="bg-neutral-50 dark:bg-neutral-700 sticky top-0">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Student Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Parent Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Parent Email
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Parent Phone
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Registration Date
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700"
            >
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-8 text-center">
                  <div class="flex items-center justify-center">
                    <div
                      class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-3"
                    ></div>
                    Loading registrants...
                  </div>
                </td>
              </tr>
              <tr v-else-if="registrants.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-neutral-500">
                  No registrants found for this program
                </td>
              </tr>
              <tr
                v-else
                v-for="registrant in registrants"
                :key="registrant.id"
                class="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <td class="px-4 py-3 text-sm font-medium">
                  {{ registrant.student_name }}
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ registrant.parent_name }}
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ registrant.parent_email }}
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ registrant.parent_phone }}
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ new Date(registrant.created_at).toLocaleDateString() }}
                </td>
                <td class="px-4 py-3 text-sm">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Registered
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download } from 'lucide-vue-next'

defineProps<{
  ppdb: any
  registrants: any[]
  loading: boolean
}>()

defineEmits<{
  close: []
  export: []
}>()
</script>
