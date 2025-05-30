import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'

export const subjectService = {
  getSubjects() {
    return useApi(`/api/v1/subject?school_id=${useAuth().schoolId()}`)
  },

  getSubject(id: string) {
    return useApi(`/api/v1/subject/${id}`)
  },

  createSubject(data: any) {
    return useApi('/api/v1/subject')
  },

  updateSubject(id: string, data: any) {
    return useApi(`/api/v1/subject/${id}`)
  },

  deleteSubject(id: string) {
    return useApi(`/api/v1/subject/${id}`)
  },
}
