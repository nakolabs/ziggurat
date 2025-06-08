<template>
  <div class="space-y-8">
    <!-- School Overview -->
    <section>
      <div class="flex items-center gap-2 mb-6">
        <LayoutDashboard class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">School Overview</h2>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="users"
          color="blue"
          label="Teachers"
          :value="teacherCount"
        />
        <MetricCard
          icon="graduation-cap"
          color="emerald"
          label="Students"
          :value="1247"
        />
        <MetricCard
          icon="book-open"
          color="purple"
          label="Active Classes"
          :value="24"
        />
        <MetricCard
          icon="check-circle"
          color="orange"
          label="Attendance"
          value="94.5%"
        />
      </div>
    </section>

    <!-- Today's Schedule -->
    <TodaysSchedule />

    <!-- Recent Activity -->
    <RecentActivity />

    <!-- School Quick Actions -->
    <SchoolQuickActions />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LayoutDashboard, Users, GraduationCap, BookOpen, CheckCircle } from 'lucide-vue-next'
import MetricCard from './MetricCard.vue'
import TodaysSchedule from './TodaysSchedule.vue'
import RecentActivity from './RecentActivity.vue'
import SchoolQuickActions from './SchoolQuickActions.vue'

interface Props {
  teacherData?: any
}

const props = defineProps<Props>()

const teacherCount = computed(() => props.teacherData?.data?.length || 0)
</script>
