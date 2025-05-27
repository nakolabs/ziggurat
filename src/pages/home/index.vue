<template>
  <Dashboard>
    <div class="p-6 space-y-6">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Welcome back!</h1>
        <p class="text-gray-400">Here's what's happening at your school today.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">Total Teachers</p>
              <p class="text-2xl font-bold text-white">
                {{ data?.data?.length || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-400 font-medium">+12%</span>
            <span class="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">Active Students</p>
              <p class="text-2xl font-bold text-white">1,247</p>
            </div>
            <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-400 font-medium">+8%</span>
            <span class="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">Classes</p>
              <p class="text-2xl font-bold text-white">24</p>
            </div>
            <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-400 font-medium">+3</span>
            <span class="text-gray-500 ml-2">new this semester</span>
          </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">Attendance Rate</p>
              <p class="text-2xl font-bold text-white">94.5%</p>
            </div>
            <div class="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-red-400 font-medium">-2.1%</span>
            <span class="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 class="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">New teacher registered</p>
                <p class="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">Student assignment completed</p>
                <p class="text-xs text-gray-400">4 hours ago</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">System maintenance scheduled</p>
                <p class="text-xs text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Overview -->
        <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 class="text-lg font-semibold text-white mb-4">Performance Overview</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">Teaching Hours</span>
                <span class="font-medium text-white">87%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-orange-500 h-2 rounded-full" style="width: 87%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">Student Satisfaction</span>
                <span class="font-medium text-white">94%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 94%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">Resource Utilization</span>
                <span class="font-medium text-white">76%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: 76%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useApi } from '@/stores/useApi.ts'
import { useLocalStorage } from '@vueuse/core'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '@/types/jwt.ts'
import Dashboard from '@/layout/dashboard.vue'
import type { ListTeacherResponse } from '@/types/response'

const accessToken = useLocalStorage('access_token', '')

const tokenDecoded = jwtDecode<JwtPayload>(accessToken.value)
console.log(tokenDecoded)

const { response, data, isFetching, json } = useApi<ListTeacherResponse>(
  '/api/v1/teacher?school_id=' + tokenDecoded.user.school_id,
)
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
