<template>
  <div class="space-y-8">
    <!-- Platform Overview -->
    <section>
      <div class="flex items-center gap-2 mb-6">
        <LayoutDashboard class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Platform Overview</h2>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="building"
          color="blue"
          label="Schools"
          :value="systemStats.totalSchools"
          :trend="systemStats.schoolsChange"
        />
        <MetricCard
          icon="users"
          color="emerald"
          label="Teachers"
          :value="systemStats.totalTeachers"
          :trend="systemStats.teachersChange"
        />
        <MetricCard
          icon="graduation-cap"
          color="purple"
          label="Students"
          :value="systemStats.totalStudents"
          :trend="systemStats.studentsChange"
        />
        <MetricCard
          icon="activity"
          color="orange"
          label="Active Exams"
          :value="systemStats.totalExams"
          :trend="systemStats.examsChange"
        />
      </div>
    </section>

    <!-- Recent Schools -->
    <RecentSchools :schools="schoolsData" />

    <!-- Admin Quick Actions -->
    <AdminQuickActions />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LayoutDashboard, Building, Users, GraduationCap, FileText } from 'lucide-vue-next'
import MetricCard from './MetricCard.vue'
import RecentSchools from './RecentSchools.vue'
import AdminQuickActions from './AdminQuickActions.vue'

const systemStats = ref({
  totalSchools: 156,
  totalTeachers: 12847,
  totalStudents: 156789,
  totalExams: 1247,
  schoolsChange: '+5.2%',
  teachersChange: '+12.3%',
  studentsChange: '+8.7%',
  examsChange: '+15.4%',
})

const schoolsData = ref([
  {
    id: 1,
    name: 'Roosevelt High School',
    location: 'New York, NY',
    studentCount: 1247,
    teacherCount: 87,
  },
  {
    id: 2,
    name: 'Lincoln Elementary',
    location: 'Chicago, IL',
    studentCount: 856,
    teacherCount: 52,
  },
  {
    id: 3,
    name: 'Washington Middle School',
    location: 'Los Angeles, CA',
    studentCount: 923,
    teacherCount: 64,
  },
  {
    id: 4,
    name: 'Jefferson Academy',
    location: 'Houston, TX',
    studentCount: 1156,
    teacherCount: 78,
  },
])
</script>
