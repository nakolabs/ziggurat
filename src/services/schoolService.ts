import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'

export interface UpdateSchoolProfileRequest {
  name: string
  level: string
  description?: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
}

export const schoolService = {
  // Get school profile
  getSchoolProfile(schoolId: string) {
    return useApi(`/api/v1/school/${schoolId}`)
  },

  // Update school profile
  updateSchoolProfile(schoolId: string, data: UpdateSchoolProfileRequest) {
    return useApi(`/api/v1/school/${schoolId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Get schools list
  getSchools() {
    return useApi('/api/v1/school')
  },

  // Create school
  createSchool(data: { name: string; level: string }) {
    return useApi('/api/v1/school', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Delete school
  deleteSchool(schoolId: string) {
    return useApi(`/api/v1/school/${schoolId}`, {
      method: 'DELETE',
    })
  },

  // Switch school
  switchSchool(schoolId: string) {
    return useApi(`/api/v1/school/${schoolId}/switch`)
  },
}
