<template>
    <section>
      <div class="flex items-center gap-2 mb-6">
        <Calendar class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Today's Schedule</h2>
      </div>
      <div
        class="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800"
      >
        <div class="p-4 border-b border-gray-100 dark:border-neutral-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 bg-blue-500 rounded-full"></div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Mathematics</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <User class="w-3 h-3" />
                  Dr. Smith • Room 101
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-blue-600 dark:text-blue-400">08:00</div>
              <div class="text-xs text-blue-500 dark:text-blue-300 flex items-center gap-1">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                Ongoing
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-b border-gray-100 dark:border-neutral-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 bg-green-500 rounded-full"></div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Physics</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Prof. Johnson • Lab 201
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">09:30</div>
              <div class="text-xs text-gray-500 dark:text-gray-300">Upcoming</div>
            </div>
          </div>
        </div>
        <div class="p-4 border-b border-gray-100 dark:border-neutral-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 bg-orange-500 rounded-full"></div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Chemistry</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Dr. Brown • Lab 301
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">11:00</div>
              <div class="text-xs text-gray-500 dark:text-gray-300">Upcoming</div>
            </div>
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 bg-purple-500 rounded-full"></div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">English</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Ms. Davis • Room 205
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">13:30</div>
              <div class="text-xs text-gray-500 dark:text-gray-300">Upcoming</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { Calendar, User } from 'lucide-vue-next'
  </script>
  