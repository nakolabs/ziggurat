import { ref, computed } from 'vue'
import { useApi } from '@/stores/useApi'
import { UserPlus, Calendar, Award, TrendingUp } from 'lucide-vue-next'

export function useSchoolActivities(schoolId: string) {
  const isLoading = ref(false)
  
  // In future, replace with real API call
  // const { data: activitiesData } = useApi(`/api/v1/school/${schoolId}/activities`).json()
  
  const activities = ref([
    {
      id: 1,
      title: 'New teacher added',
      description: 'John Doe joined as Mathematics teacher',
      time: '2 hours ago',
      icon: UserPlus,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 2,
      title: 'Class schedule updated',
      description: 'Grade 10A schedule has been modified',
      time: '5 hours ago',
      icon: Calendar,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 3,
      title: 'Exam results published',
      description: 'Mid-semester exam results are now available',
      time: '1 day ago',
      icon: Award,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 4,
      title: 'Performance report generated',
      description: 'Monthly performance report has been generated',
      time: '2 days ago',
      icon: TrendingUp,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ])
  
  return {
    activities,
    isLoading
  }
}
