import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { schoolService } from '@/services/schoolService'
import { useSchoolEdit } from '@/composables/useSchoolEdit'
import { useSchoolStats } from '@/composables/useSchoolStats'
import { useSchoolActivities } from '@/composables/useSchoolActivities'
import type { DetailSchoolResponse } from '@/types/school'

export function useSchoolDetail(schoolId: string) {
  const router = useRouter()

  // Modal states
  const showBannerModal = ref(false)
  const showLogoModal = ref(false)

  // Fetch school data
  const {
    data,
    isFetching,
    execute: refetch,
  } = schoolService.getSchoolProfile(schoolId).json<DetailSchoolResponse>()
  const schoolData = computed(() => {
    if (!data.value?.data) return null
    const { statistics, ...rest } = data.value.data
    return rest
  })

  // Use edit composable
  const editComposable = useSchoolEdit(schoolData, refetch)

  // Use stats composable
  const stats = computed(() => {
    return (
      data.value?.data.statistics || {
        student_count: 0,
        teacher_count: 0,
        class_count: 0,
        subject_count: 0,
        exam_count: 0,
        pending_students: 0,
        teacher_ratio: 0,
        avg_class_size: 0,
      }
    )
  })

  // Use activities composable
  const { activities } = useSchoolActivities(schoolId)

  // Handle save action
  const handleSave = async () => {
    await editComposable.saveChanges(schoolId)
  }

  // Handle logo save
  const handleLogoSave = async (file: File | null, remove: boolean) => {
    try {
      editComposable.isSaving.value = true
      if (remove) {
        await schoolService.updateLogo(schoolId, null).json()
      } else if (file) {
        await schoolService.updateLogo(schoolId, file).json()
      }
      await refetch()
      showLogoModal.value = false
    } catch (error) {
      console.error('Failed to update logo:', error)
      alert('Failed to update logo. Please try again.')
    } finally {
      editComposable.isSaving.value = false
    }
  }

  // Handle banner save
  const handleBannerSave = async (file: File | null, remove: boolean) => {
    try {
      editComposable.isSaving.value = true
      if (remove) {
        await schoolService.updateBanner(schoolId, null).json()
      } else if (file) {
        await schoolService.updateBanner(schoolId, file).json()
      }
      await refetch()
      showBannerModal.value = false
    } catch (error) {
      console.error('Failed to update banner:', error)
      alert('Failed to update banner. Please try again.')
    } finally {
      editComposable.isSaving.value = false
    }
  }

  // Delete school
  const deleteSchool = async () => {
    if (!confirm(`Are you sure you want to delete "${schoolData.value?.name}"?`)) {
      return
    }

    try {
      await schoolService.deleteSchool(schoolId).json()
      router.push('/school')
    } catch (error) {
      console.error('Failed to delete school:', error)
      alert('Failed to delete school. Please try again.')
    }
  }

  // Format level helper
  const formatLevel = (level: string) => {
    if (!level) return 'Educational Institution'

    const levelMap: Record<string, string> = {
      elementary: 'Elementary School',
      junior: 'Junior High School',
      senior: 'Senior High School',
      college: 'University',
    }

    return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1)
  }

  return {
    // Data
    schoolData,
    isFetching,
    stats,
    activities,

    // Modal states
    showBannerModal,
    showLogoModal,

    // Edit functionality
    ...editComposable,

    // Actions
    handleSave,
    handleLogoSave,
    handleBannerSave,
    deleteSchool,
    formatLevel,
    refetch,

    // Navigation
    router,
  }
}
