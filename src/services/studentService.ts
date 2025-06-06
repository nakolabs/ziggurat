import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'
import type {
  StudentListQuery,
  ListStudentResponse,
  InviteStudentRequest,
  VerifyStudentEmailRequest,
  UpdateStudentAfterInviteRequest,
  UpdateStudentClassRequest,
} from '@/types/student'

export const studentService = {
  // Get list of students
  getStudents(query: StudentListQuery) {
    const params = new URLSearchParams()
    params.append('school_id', useAuth().schoolId())
    if (query.class_id) params.append('class_id', query.class_id)
    if (query.page) params.append('page', query.page.toString())
    if (query.page_size) params.append('page_size', query.page_size.toString())
    if (query.order_by) params.append('order_by', query.order_by)
    if (query.order) params.append('order', query.order)
    if (query.search) {
      params.append('search', query.search)
      params.append('search_by', 'name')
      params.append('search_by', 'email')
    }
    if (query.grade) params.append('grade', query.grade)
    if (query.is_verified !== undefined) params.append('is_verified', query.is_verified.toString())

    return useApi<ListStudentResponse>(`/api/v1/student?${params}`)
  },

  // Get student detail
  getStudentDetail(studentId: string) {
    return useApi(`/api/v1/student/${studentId}`)
  },

  // Invite student
  inviteStudent(data: InviteStudentRequest) {
    return useApi('/api/v1/student/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Verify student email
  verifyStudentEmail(data: VerifyStudentEmailRequest) {
    return useApi('/api/v1/student/invite/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update student after verification
  updateStudentAfterInvite(data: UpdateStudentAfterInviteRequest) {
    return useApi('/api/v1/student/invite/update', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update student class
  updateStudentClass(data: UpdateStudentClassRequest) {
    return useApi('/api/v1/student/class', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete student
  deleteStudent(studentId: string) {
    return useApi(`/api/v1/student/${studentId}`, {
      method: 'DELETE',
    })
  },

  // Get student exams
  getStudentExams(studentId: string, page = 1, pageSize = 20) {
    return useApi(`/api/v1/student/${studentId}/exams?page=${page}&page_size=${pageSize}`)
  },
}
