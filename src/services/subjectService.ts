import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'

export const subjectService = {
  getSubjects() {
    return useApi(`/api/v1/subject?school_id=${useAuth().schoolId()}`)
  },

  getSubject(id: string) {
    return useApi(`/api/v1/subject/${id}`)
  },

  createSubject(data: { name: string; school_id: string }) {
    return useApi('/api/v1/subject', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateSubject(id: string, data: { name: string }) {
    return useApi(`/api/v1/subject/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteSubject(id: string) {
    return useApi(`/api/v1/subject/${id}`, {
      method: 'DELETE',
    })
  },

  // Assign teachers to subject
  assignTeachersToSubject(data: { subject_id: string; teacher_ids: string[] }) {
    return useApi('/api/v1/subject/assign-teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get teachers by subject
  getTeachersBySubject(subjectId: string, query?: { page?: number; page_size?: number }) {
    const searchParams = new URLSearchParams()

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    const url = queryString
      ? `/api/v1/subject/${subjectId}/teachers?${queryString}`
      : `/api/v1/subject/${subjectId}/teachers`

    return useApi(url)
  },

  // Update subject class
  updateSubjectClass(data: { subject_id: string; old_class_id?: string; new_class_id: string }) {
    return useApi('/api/v1/subject/class', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}
