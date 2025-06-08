import { ref, computed } from 'vue'
import { useApi } from '@/stores/useApi'

export function useSchoolStats(schoolId: string) {
  const isLoading = ref(false)
  
  // Fetch real statistics from APIs
  const { data: teacherData } = useApi(`/api/v1/teacher?school_id=${schoolId}`).json()
  const { data: studentData } = useApi(`/api/v1/student?school_id=${schoolId}`).json()
  const { data: classData } = useApi(`/api/v1/class?school_id=${schoolId}`).json()
  const { data: subjectData } = useApi(`/api/v1/subject?school_id=${schoolId}`).json()
  
  const stats = computed(() => ({
    teachers: teacherData.value?.data?.length || 0,
    students: studentData.value?.data?.length || 0,
    classes: classData.value?.data?.length || 0,
    subjects: subjectData.value?.data?.length || 0
  }))
  
  return {
    stats,
    isLoading
  }
}
