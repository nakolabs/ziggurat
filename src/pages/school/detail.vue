<template>
  <Dashboard>
    <div class="p-6 max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isFetching" class="flex items-center justify-center py-12">
        <div
          class="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 text-lg mb-4">Failed to load school details</div>
        <button
          @click="refetch"
          class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>

      <!-- School Detail Content -->
      <div v-else-if="schoolData" class="space-y-8">
        <!-- Header Section -->
        <div
          class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div class="flex items-center gap-6">
                <!-- School Logo/Avatar -->
                <div
                  class="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                >
                  <img
                    v-if="schoolData.logo"
                    :src="schoolData.logo"
                    :alt="schoolData.name"
                    class="w-20 h-20 rounded-xl object-cover"
                  />
                  <Building v-else class="w-12 h-12 text-white/80" />
                </div>

                <div class="space-y-2">
                  <h1 class="text-3xl lg:text-4xl font-bold">{{ schoolData.name }}</h1>
                  <div class="flex items-center gap-4 text-white/90">
                    <div class="flex items-center gap-2">
                      <GraduationCap class="w-5 h-5" />
                      <span class="text-lg">{{ schoolData.level }}</span>
                    </div>
                    <div class="flex items-center gap-2" v-if="schoolData.created_at">
                      <Calendar class="w-5 h-5" />
                      <span>Est. {{ formatYear(schoolData.created_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3">
                <router-link
                  :to="`/school/${schoolId}/profile`"
                  class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                >
                  <Edit class="w-4 h-4" />
                  Edit Profile
                </router-link>
                <button
                  @click="switchToSchool"
                  class="bg-white text-orange-600 hover:bg-gray-50 px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-medium"
                >
                  <ArrowRightLeft class="w-4 h-4" />
                  Switch to School
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Total Teachers
                </p>
                <p class="text-2xl font-bold text-neutral-900 dark:text-white">
                  {{ stats.teachers || 0 }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
              >
                <Users class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Total Students
                </p>
                <p class="text-2xl font-bold text-neutral-900 dark:text-white">
                  {{ stats.students || 0 }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
              >
                <GraduationCap class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Total Classes
                </p>
                <p class="text-2xl font-bold text-neutral-900 dark:text-white">
                  {{ stats.classes || 0 }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
              >
                <School class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Total Subjects
                </p>
                <p class="text-2xl font-bold text-neutral-900 dark:text-white">
                  {{ stats.subjects || 0 }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center"
              >
                <BookOpen class="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - School Information -->
          <div class="lg:col-span-2 space-y-6">
            <!-- About Section -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
            >
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info class="w-5 h-5 text-orange-500" />
                About School
              </h2>
              <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {{ schoolData.description || 'No description available for this school.' }}
              </p>
            </div>

            <!-- Quick Actions -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
            >
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap class="w-5 h-5 text-orange-500" />
                Quick Actions
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <router-link
                  to="/teacher"
                  class="flex flex-col items-center p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <Users class="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span class="text-sm font-medium mt-2">Teachers</span>
                </router-link>

                <router-link
                  to="/student"
                  class="flex flex-col items-center p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <GraduationCap
                    class="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform"
                  />
                  <span class="text-sm font-medium mt-2">Students</span>
                </router-link>

                <router-link
                  to="/class"
                  class="flex flex-col items-center p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <School
                    class="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform"
                  />
                  <span class="text-sm font-medium mt-2">Classes</span>
                </router-link>

                <router-link
                  to="/exam"
                  class="flex flex-col items-center p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <FileText
                    class="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform"
                  />
                  <span class="text-sm font-medium mt-2">Exams</span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Right Column - Contact & Address -->
          <div class="space-y-6">
            <!-- Contact Information -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
            >
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <Phone class="w-5 h-5 text-orange-500" />
                Contact Information
              </h2>
              <div class="space-y-4">
                <div v-if="schoolData.phone" class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
                  >
                    <Phone class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">Phone</p>
                    <p class="font-medium">{{ schoolData.phone }}</p>
                  </div>
                </div>

                <div v-if="schoolData.email" class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
                  >
                    <Mail class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
                    <p class="font-medium">{{ schoolData.email }}</p>
                  </div>
                </div>

                <div v-if="schoolData.website" class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
                  >
                    <Globe class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">Website</p>
                    <a
                      :href="schoolData.website"
                      target="_blank"
                      class="font-medium text-orange-500 hover:text-orange-600"
                    >
                      {{ schoolData.website }}
                    </a>
                  </div>
                </div>

                <div
                  v-if="!schoolData.phone && !schoolData.email && !schoolData.website"
                  class="text-center py-4"
                >
                  <p class="text-neutral-500 dark:text-neutral-400">
                    No contact information available
                  </p>
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
            >
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin class="w-5 h-5 text-orange-500" />
                Address
              </h2>
              <div class="space-y-3">
                <div v-if="schoolData.address">
                  <p class="text-sm text-neutral-500 dark:text-neutral-400">Street Address</p>
                  <p class="font-medium">{{ schoolData.address }}</p>
                </div>

                <div v-if="schoolData.city || schoolData.province" class="grid grid-cols-2 gap-4">
                  <div v-if="schoolData.city">
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">City</p>
                    <p class="font-medium">{{ schoolData.city }}</p>
                  </div>
                  <div v-if="schoolData.province">
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">Province</p>
                    <p class="font-medium">{{ schoolData.province }}</p>
                  </div>
                </div>

                <div v-if="schoolData.postal_code">
                  <p class="text-sm text-neutral-500 dark:text-neutral-400">Postal Code</p>
                  <p class="font-medium">{{ schoolData.postal_code }}</p>
                </div>

                <div
                  v-if="
                    !schoolData.address &&
                    !schoolData.city &&
                    !schoolData.province &&
                    !schoolData.postal_code
                  "
                  class="text-center py-4"
                >
                  <p class="text-neutral-500 dark:text-neutral-400">
                    No address information available
                  </p>
                </div>
              </div>
            </div>

            <!-- School Details -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
            >
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings class="w-5 h-5 text-orange-500" />
                School Details
              </h2>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-neutral-500 dark:text-neutral-400">School ID</p>
                  <p class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                    {{ schoolData.id }}
                  </p>
                </div>

                <div v-if="schoolData.created_at">
                  <p class="text-sm text-neutral-500 dark:text-neutral-400">Created</p>
                  <p class="font-medium">{{ formatDate(schoolData.created_at) }}</p>
                </div>

                <div v-if="schoolData.updated_at">
                  <p class="text-sm text-neutral-500 dark:text-neutral-400">Last Updated</p>
                  <p class="font-medium">{{ formatDate(schoolData.updated_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Building,
  GraduationCap,
  Calendar,
  Edit,
  ArrowRightLeft,
  Users,
  School,
  BookOpen,
  Info,
  Zap,
  Phone,
  Mail,
  Globe,
  MapPin,
  Settings,
  FileText,
} from 'lucide-vue-next'
import Dashboard from '@/layout/dashboard.vue'
import { schoolService } from '@/services/schoolService'
import { useAuth } from '@/stores/useAuth'
import { useApi } from '@/stores/useApi'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const schoolId = computed(() => route.params.id as string)

// Fetch school data
const {
  data,
  isFetching,
  error,
  execute: refetch,
} = schoolService.getSchoolProfile(schoolId.value).json()
const schoolData = computed(() => data.value?.data)

// Stats data (you can fetch these from separate endpoints)
const stats = ref({
  teachers: 0,
  students: 0,
  classes: 0,
  subjects: 0,
})

// Fetch school statistics
const fetchStats = async () => {
  try {
    // Fetch teachers count
    const { data: teachersData } = await useApi(
      `/api/v1/teacher?school_id=${schoolId.value}&limit=1`,
    ).json()
    stats.value.teachers = teachersData.value?.meta?.pagination?.total || 0

    // Fetch students count
    const { data: studentsData } = await useApi(
      `/api/v1/student?school_id=${schoolId.value}&limit=1`,
    ).json()
    stats.value.students = studentsData.value?.meta?.pagination?.total || 0

    // Fetch classes count
    const { data: classesData } = await useApi(
      `/api/v1/class?school_id=${schoolId.value}&limit=1`,
    ).json()
    stats.value.classes = classesData.value?.meta?.pagination?.total || 0

    // Fetch subjects count
    const { data: subjectsData } = await useApi(
      `/api/v1/subject?school_id=${schoolId.value}&limit=1`,
    ).json()
    stats.value.subjects = subjectsData.value?.meta?.pagination?.total || 0
  } catch (error) {
    console.error('Failed to fetch school statistics:', error)
  }
}

const switchToSchool = async () => {
  if (!confirm(`Switch to "${schoolData.value?.name}"?`)) {
    return
  }

  try {
    const { data: switchData } = await useApi(`/api/v1/school/${schoolId.value}/switch`).json()

    if (switchData.value?.code === 200) {
      const newAccessToken = switchData.value.data.access_token
      const newRefreshToken = switchData.value.data.refresh_token
      auth.set(newAccessToken, newRefreshToken)

      alert(`Successfully switched to ${schoolData.value?.name}`)
      router.push('/home')
    } else {
      console.error('Failed to switch school:', switchData.value?.message)
      alert('Failed to switch school. Please try again.')
    }
  } catch (error) {
    console.error('Failed to switch school:', error)
    alert('Failed to switch school. Please try again.')
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatYear = (timestamp: number) => {
  return new Date(timestamp).getFullYear()
}

onMounted(() => {
  fetchStats()
})
</script>
