import { ref } from 'vue'
import { useApi } from '@/stores/useApi'

export function useTeacherAssignment(teacherId: string) {
  // Assignment state
  const selectedSubjectId = ref('')
  const selectedClassId = ref('')
  const assigningSubject = ref(false)
  const assigningClass = ref(false)
  const assignSubjectError = ref('')
  const assignClassError = ref('')
  const assignSubjectSuccess = ref(false)
  const assignClassSuccess = ref(false)

  // Unassign state
  const unassigningSubject = ref('')
  const unassigningClass = ref('')

  const assignSubject = async () => {
    assignSubjectError.value = ''
    assignSubjectSuccess.value = false
    if (!selectedSubjectId.value) return

    assigningSubject.value = true
    try {
      const { data } = await useApi('/api/v1/subject/assign-teachers', {
        method: 'POST',
        body: JSON.stringify({
          teacher_id: teacherId,
          subject_id: selectedSubjectId.value,
          teacher_ids: [teacherId],
        }),
      }).json()

      if (data.value?.code !== 200) {
        throw new Error(data.value?.message || 'Failed to assign subject')
      }

      assignSubjectSuccess.value = true
      selectedSubjectId.value = ''
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      assignSubjectError.value = error.message || 'Failed to assign subject'
    } finally {
      assigningSubject.value = false
    }
  }

  const assignClass = async () => {
    assignClassError.value = ''
    assignClassSuccess.value = false
    if (!selectedClassId.value) return

    assigningClass.value = true
    try {
      const { data } = await useApi('/api/v1/class/assign-teachers', {
        method: 'POST',
        body: JSON.stringify({
          teacher_id: teacherId,
          class_id: selectedClassId.value,
          teacher_ids: [teacherId],
        }),
      }).json()

      if (data.value?.code !== 200) {
        throw new Error(data.value?.message || 'Failed to assign class')
      }

      assignClassSuccess.value = true
      selectedClassId.value = ''
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      assignClassError.value = error.message || 'Failed to assign class'
    } finally {
      assigningClass.value = false
    }
  }

  const unassignSubject = async (subjectId: string) => {
    unassigningSubject.value = subjectId
    try {
      const { data } = await useApi('/api/v1/subject/unassign-teachers', {
        method: 'POST',
        body: JSON.stringify({
          teacher_id: teacherId,
          subject_id: subjectId,
          teacher_ids: [teacherId],
        }),
      }).json()

      if (data.value?.code !== 200) {
        throw new Error('Failed to unassign subject')
      }

      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Failed to unassign subject:', error)
      alert('Failed to unassign subject')
    } finally {
      unassigningSubject.value = ''
    }
  }

  const unassignClass = async (classId: string) => {
    unassigningClass.value = classId
    try {
      const { data } = await useApi('/api/v1/class/unassign-teachers', {
        method: 'POST',
        body: JSON.stringify({
          teacher_id: teacherId,
          class_id: classId,
          teacher_ids: [teacherId],
        }),
      }).json()

      if (data.value?.code !== 200) {
        throw new Error('Failed to unassign class')
      }

      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Failed to unassign class:', error)
      alert('Failed to unassign class')
    } finally {
      unassigningClass.value = ''
    }
  }

  return {
    // Selection state
    selectedSubjectId,
    selectedClassId,
    
    // Loading states
    assigningSubject,
    assigningClass,
    unassigningSubject,
    unassigningClass,
    
    // Error/Success states
    assignSubjectError,
    assignClassError,
    assignSubjectSuccess,
    assignClassSuccess,
    
    // Actions
    assignSubject,
    assignClass,
    unassignSubject,
    unassignClass,
  }
}
