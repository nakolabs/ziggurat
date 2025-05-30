import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'
import type { StudentListQuery, ListStudentResponse } from '@/types/student'

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

    return useApi<ListStudentResponse>(`/api/v1/student?${params}`)
  },

  // Get student detail
  getStudentDetail(studentId: string) {
    return useApi(`/api/v1/student/${studentId}`)
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
