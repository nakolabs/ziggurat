<template>
  <Dashboard>
    <div class="bg-white dark:bg-neutral-950 min-h-screen">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- School Header -->
        <SchoolDetailHeader
          :school-data="schoolData"
          :format-level="formatLevel"
          @edit-logo="showLogoModal = true"
        />

        <!-- Loading State -->
        <LoadingState v-if="isFetching" />

        <!-- Main Content -->
        <div v-else-if="schoolData" class="space-y-8 relative">
          <!-- Statistics Grid -->
          <SchoolStats :data="stats" />

          <!-- Content Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Information -->
            <div class="lg:col-span-2 space-y-6">
              <!-- School Details Form -->
              <SchoolInformationForm
                :school="schoolData"
                :form="editForm"
                :is-edit-mode="isEditMode"
                :is-saving="isSaving"
                @edit="toggleEditMode"
                @cancel="cancelEdit"
                @save="handleSave"
                @update:logo-file="handleLogoFile"
                @update:banner-file="handleBannerFile"
                @remove-logo="handleRemoveLogo"
                @remove-banner="handleRemoveBanner"
              />

              <!-- Recent Activities -->
              <RecentActivities :activities="activities" />
              <!-- Danger Zone -->
              <div
                class="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30"
              >
                <div class="px-5 py-4">
                  <h3
                    class="text-sm font-semibold text-red-900 dark:text-red-400 flex items-center gap-2 mb-2"
                  >
                    <Trash2 class="w-4 h-4" />
                    Delete School
                  </h3>
                  <p class="text-red-700 dark:text-red-300 text-xs mb-3">
                    This action cannot be undone and will permanently delete all associated data.
                  </p>

                  <button
                    @click="deleteSchool"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all duration-200"
                  >
                    <Trash2 class="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <SchoolSidebar :stats="stats" :school="schoolData" @navigate="router.push" />
          </div>
        </div>

        <!-- Error State -->
        <ErrorState v-else @back="router.push('/school')" />

        <!-- Modals -->
        <LogoEditModal
          v-if="showLogoModal"
          :school="schoolData!"
          :is-saving="isSaving"
          @close="showLogoModal = false"
          @save="(file) => handleLogoSave(file, false)"
          @remove-logo="handleRemoveLogo"
        />

        <BannerEditModal
          v-if="showBannerModal"
          :school="schoolData"
          :is-saving="isSaving"
          @close="showBannerModal = false"
          @save="handleBannerSave"
        />
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '@vueuse/core'
import Dashboard from '@/layout/dashboard.vue'
import SchoolDetailHeader from '@/components/school/SchoolDetailHeader.vue'
import LoadingState from '@/components/school/LoadingState.vue'
import ErrorState from '@/components/school/ErrorState.vue'
import SchoolStats from '@/components/school/SchoolStats.vue'
import SchoolInformationForm from '@/components/school/SchoolInformationForm.vue'
import SchoolSidebar from '@/components/school/SchoolSidebar.vue'
import RecentActivities from '@/components/school/RecentActivities.vue'
import BannerEditModal from '@/components/school/BannerEditModal.vue'
import LogoEditModal from '@/components/school/LogoEditModal.vue'
import { useSchoolDetail } from '@/composables/useSchoolDetail'
import { Trash2 } from 'lucide-vue-next'

const route = useRoute()
const schoolId = computed(() => route.params.id as string)

const {
  // Data
  schoolData,
  isFetching,
  stats,
  activities,

  // Modal states
  showBannerModal,
  showLogoModal,

  // Edit functionality
  isEditMode,
  isSaving,
  editForm,
  toggleEditMode,
  cancelEdit,
  handleLogoFile,
  handleBannerFile,
  handleRemoveLogo,
  handleRemoveBanner,

  // Actions
  handleSave,
  handleLogoSave,
  handleBannerSave,
  deleteSchool,
  formatLevel,

  // Navigation
  router,
} = useSchoolDetail(schoolId.value)
</script>
