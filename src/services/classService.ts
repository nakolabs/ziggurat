import { useApi } from '@/stores/useApi'
import type { CreateClassRequest, GetClassesQuery, UpdateClassRequest } from '@/types/class'

export const classService = {
  // Get list of classes
  getClasses(query: GetClassesQuery) {
    const searchParams = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    return useApi(`/api/v1/class?${searchParams.toString()}`)
  },

  // Get class detail
  getClassDetail(classId: string) {
    return useApi(`/api/v1/class/${classId}`)
  },

  // Create new class
  createClass(data: CreateClassRequest) {
    return useApi('/api/v1/class', {
      method: 'POST',
    }).post(data)
  },

  // Update class
  updateClass(classId: string, data: UpdateClassRequest) {
    return useApi(`/api/v1/class/${classId}`, {
      method: 'PUT',
    }).put(data)
  },

  // Delete class
  deleteClass(classId: string) {
    return useApi(`/api/v1/class/${classId}`, {
      method: 'DELETE',
    }).delete()
  },

  // Get class students
  getClassStudents(classId: string, query?: { page?: number; page_size?: number }) {
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
      ? `/api/v1/class/${classId}/students?${queryString}`
      : `/api/v1/class/${classId}/students`

    return useApi(url)
  },

  // Add student to class
  addStudentToClass(classId: string, studentId: string) {
    return useApi(`/api/v1/class/${classId}/students`, {
      method: 'POST',
    }).post({ student_id: studentId })
  },

  // Remove student from class
  removeStudentFromClass(classId: string, studentId: string) {
    return useApi(`/api/v1/class/${classId}/students/${studentId}`, {
      method: 'DELETE',
    }).delete()
  },
}
