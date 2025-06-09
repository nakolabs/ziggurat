<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Main Overview -->
    <div class="lg:col-span-3">
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                <Users class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ teachers.length }}</p>
                <p class="text-sm text-blue-600/70 dark:text-blue-400/70">Teachers</p>
              </div>
            </div>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <School class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ classes.length }}</p>
                <p class="text-sm text-green-600/70 dark:text-green-400/70">Classes</p>
              </div>
            </div>
          </div>
          
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                <GraduationCap class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ students.length }}</p>
                <p class="text-sm text-purple-600/70 dark:text-purple-400/70">Students</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Subject Details -->
        <div class="border-t border-gray-200 dark:border-neutral-700 pt-8">
          <h4 class="text-base font-semibold text-gray-900 dark:text-white mb-6">Information</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-700">
                <span class="text-sm text-gray-500 dark:text-gray-400">Subject Name</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ subject.name }}</span>
              </div>
              
              <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-700">
                <span class="text-sm text-gray-500 dark:text-gray-400">Created</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ new Date(subject.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) }}
                </span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-700">
                <span class="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ new Date(subject.updated_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) }}
                </span>
              </div>
              
              <div class="flex items-center justify-between py-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Status</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="lg:col-span-1">
      <SubjectSidebar 
        :subject="subject"
        :teachers="teachers"
        :classes="classes"
        :students="students"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, School, GraduationCap } from 'lucide-vue-next'
import SubjectSidebar from '../SubjectSidebar.vue'

defineProps<{
  subject: any
  teachers: any[]
  classes: any[]
  students: any[]
  teachersLoading?: boolean
  classesLoading?: boolean
  studentsLoading?: boolean
}>()

defineEmits<{
  'update-subject': []
}>()
</script>
