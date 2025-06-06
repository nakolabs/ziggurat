import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'

export interface TeacherListQuery {
  school_id: string
  page?: number
  page_size?: number
  search?: string
  search_by?: string[]
  is_verified?: boolean
  order_by?: string
  order?: 'asc' | 'desc'
}

export interface InviteTeacherRequest {
  school_id: string
  emails: string[]
}

export interface VerifyTeacherEmailRequest {
  email: string
  token: string
}

export interface UpdateTeacherAfterInviteRequest {
  email: string
  password: string
  name: string
}

export interface UpdateTeacherClassRequest {
  teacher_id: string
  old_class_id?: string
  new_class_id: string
}

export const teacherService = {
  // Get list of teachers
  getTeachers(query: TeacherListQuery) {
    const params = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v.toString()))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    return useApi(`/api/v1/teacher?${params.toString()}`)
  },

  // Get teacher detail
  getTeacherDetail(teacherId: string) {
    return useApi(`/api/v1/teacher/${teacherId}`)
  },

  // Invite teacher
  inviteTeacher(data: InviteTeacherRequest) {
    return useApi('/api/v1/teacher/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Verify teacher email
  verifyTeacherEmail(data: VerifyTeacherEmailRequest) {
    return useApi('/api/v1/teacher/invite/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update teacher after invitation
  updateTeacherAfterInvite(data: UpdateTeacherAfterInviteRequest) {
    return useApi('/api/v1/teacher/invite/update', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update teacher class
  updateTeacherClass(data: UpdateTeacherClassRequest) {
    return useApi('/api/v1/teacher/class', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete teacher
  deleteTeacher(teacherId: string) {
    return useApi(`/api/v1/teacher/${teacherId}`, {
      method: 'DELETE',
    })
  },

  // Get teacher subjects
  getTeacherSubjects(teacherId: string) {
    return useApi(`/api/v1/teacher/${teacherId}/subjects`)
  },
}
