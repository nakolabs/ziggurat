import { useApi } from '@/stores/useApi'
import type { CreateExamRequest, ExamListQuery, ListExamResponse } from '@/types/exam'

export const examService = {
  // Get list of exams
  getExams(query: ExamListQuery) {
    const params = new URLSearchParams()
    params.append('school_id', query.school_id)
    if (query.subject_id) params.append('subject_id', query.subject_id)
    if (query.page) params.append('page', query.page.toString())
    if (query.page_size) params.append('page_size', query.page_size.toString())
    if (query.order_by) params.append('order_by', query.order_by)
    if (query.order) params.append('order', query.order)

    const response = useApi<ListExamResponse>(`/api/v1/exam?${params}`)
    return response
  },

  // Get exam detail
  getExamDetail(examId: string) {
    return useApi(`/api/v1/exam/${examId}`)
  },

  // Create new exam
  createExam(data: CreateExamRequest) {
    return useApi('/api/v1/exam', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update exam
  updateExam(examId: string, data: CreateExamRequest) {
    return useApi(`/api/v1/exam/${examId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete exam
  deleteExam(examId: string) {
    return useApi(`/api/v1/exam/${examId}`, {
      method: 'DELETE',
    })
  },

  // Get exam students
  getExamStudents(examId: string, page = 1, pageSize = 20) {
    return useApi(`/api/v1/exam/${examId}/students?page=${page}&page_size=${pageSize}`)
  },

  // Assign exam to class
  assignExamToClass(data: { exam_id: string; class_id: string }) {
    return useApi('/api/v1/exam/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Grade exam
  gradeExam(examId: string, studentId: string, grade: number) {
    return useApi('/api/v1/exam/grade', {
      method: 'POST',
      body: JSON.stringify({
        exam_id: examId,
        student_id: studentId,
        grade,
      }),
    })
  },

  // Student exam endpoints
  getStudentExams() {
    return useApi('/api/v1/student/exam')
  },

  getStudentExamDetail(examId: string) {
    return useApi(`/api/v1/student/exam/${examId}`)
  },

  submitExamAnswers(data: {
    exam_id: string
    answers: Array<{
      question_id: string
      answer: string
      question_type: 'multiple_choice' | 'essay'
    }>
  }) {
    return useApi('/api/v1/student/exam/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
