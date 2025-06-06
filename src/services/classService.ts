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
      body: JSON.stringify(data),
    })
  },

  // Update class
  updateClass(classId: string, data: UpdateClassRequest) {
    return useApi(`/api/v1/class/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete class
  deleteClass(classId: string) {
    return useApi(`/api/v1/class/${classId}`, {
      method: 'DELETE',
    })
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
      body: JSON.stringify({ student_id: studentId }),
    })
  },

  // Remove student from class
  removeStudentFromClass(classId: string, studentId: string) {
    return useApi(`/api/v1/class/${classId}/students/${studentId}`, {
      method: 'DELETE',
    })
  },

  // Add students to class (bulk)
  addStudentsToClass(data: { class_id: string; student_ids: string[] }) {
    return useApi('/api/v1/class/add-students', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Remove students from class (bulk)
  removeStudentsFromClass(data: { class_id: string; student_ids: string[] }) {
    return useApi('/api/v1/class/student', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  },

  // Get class teachers
  getClassTeachers(classId: string, query?: { page?: number; page_size?: number }) {
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
      ? `/api/v1/class/${classId}/teachers?${queryString}`
      : `/api/v1/class/${classId}/teachers`

    return useApi(url)
  },

  // Add teachers to class
  addTeachersToClass(data: { class_id: string; teacher_ids: string[] }) {
    return useApi('/api/v1/class/add-teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Remove teachers from class
  removeTeachersFromClass(data: { class_id: string; teacher_ids: string[] }) {
    return useApi('/api/v1/class/teacher', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  },

  // Get class subjects
  getClassSubjects(classId: string, query?: { page?: number; page_size?: number }) {
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
      ? `/api/v1/class/${classId}/subjects?${queryString}`
      : `/api/v1/class/${classId}/subjects`

    return useApi(url)
  },

  // Add subjects to class
  addSubjectsToClass(data: { class_id: string; subject_ids: string[] }) {
    return useApi('/api/v1/class/add-subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Remove subjects from class
  removeSubjectsFromClass(data: { class_id: string; subject_ids: string[] }) {
    return useApi('/api/v1/class/subject', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  },
}
