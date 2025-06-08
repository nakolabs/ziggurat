import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'

export function useTeacherDetail(teacherId: string) {
  const router = useRouter()
  const schoolId = useAuth().get()?.payload.user.school_id || ''

  // API calls
  const { data: teacherData, isFetching, error, execute: refetchTeacher } = useApi(`/api/v1/teacher/${teacherId}`).json()
  const { data: subjectsData, isFetching: subjectsLoading, error: subjectsError, execute: refetchSubjects } = useApi(`/api/v1/teacher/${teacherId}/subjects`).json()
  const { data: classesData, isFetching: classesLoading, error: classesError, execute: refetchClasses } = useApi(`/api/v1/teacher/${teacherId}/classes`).json()
  const { data: allSubjectsData } = useApi(`/api/v1/subject?school_id=${schoolId}`).json()
  const { data: allClassesData } = useApi(`/api/v1/class?school_id=${schoolId}`).json()
  const { data: schoolData, isFetching: schoolLoading, error: schoolError } = useApi(`/api/v1/school/${schoolId}`).json()

  // Computed properties
  const teacher = computed(() => teacherData.value?.data)
  const subjects = computed(() => subjectsData.value?.data || [])
  const classes = computed(() => classesData.value?.data || [])
  const allSubjects = computed(() => allSubjectsData.value?.data || [])
  const allClasses = computed(() => allClassesData.value?.data || [])
  const school = computed(() => schoolData.value?.data)

  // Available options (exclude already assigned)
  const availableSubjects = computed(() => {
    if (!allSubjects.value || !subjects.value) return allSubjects.value || []
    const assignedSubjectIds = subjects.value.map(s => s.id)
    return allSubjects.value.filter(subject => !assignedSubjectIds.includes(subject.id))
  })

  const availableClasses = computed(() => {
    if (!allClasses.value || !classes.value) return allClasses.value || []
    const assignedClassIds = classes.value.map(c => c.id)
    return allClasses.value.filter(classItem => !assignedClassIds.includes(classItem.id))
  })

  // Delete functionality
  const showDeleteModal = ref(false)
  const deleting = ref(false)

  const deleteTeacher = async () => {
    if (!teacher.value?.id) return
    
    deleting.value = true
    try {
      const { data } = await useApi(`/api/v1/teacher/${teacher.value.id}`, {
        method: 'DELETE',
      }).json()
      
      if (data.value?.code !== 200) {
        throw new Error(data.value?.message || 'Unknown error')
      }
      
      showDeleteModal.value = false
      setTimeout(() => {
        router.push('/teachers')
      }, 500)
      
    } catch (error) {
      console.error('Failed to delete teacher:', error)
      throw error
    } finally {
      deleting.value = false
    }
  }

  // Refetch function
  const refetch = async () => {
    await Promise.all([
      refetchTeacher(),
      refetchSubjects(),
      refetchClasses()
    ])
  }

  return {
    // Data
    teacher,
    subjects,
    classes,
    availableSubjects,
    availableClasses,
    school,
    
    // Loading states
    isFetching,
    subjectsLoading,
    classesLoading,
    schoolLoading,
    
    // Error states
    error,
    subjectsError,
    classesError,
    schoolError,
    
    // Delete functionality
    showDeleteModal,
    deleting,
    deleteTeacher,
    
    // Refetch
    refetch,
  }
}
