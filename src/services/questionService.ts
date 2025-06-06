import { useApi } from '@/stores/useApi'
import { useAuth } from '@/stores/useAuth'
import type {
  ListQuestionQuery,
  ListQuestionResponse,
  Question,
  UpdateQuestionResponse,
} from '@/types/question'

export const questionService = {
  getQuestions(query?: ListQuestionQuery) {
    const params = new URLSearchParams()
    params.append('school_id', useAuth().schoolId())

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }

    return useApi<ListQuestionResponse>(`/api/v1/question?${params.toString()}`)
  },

  createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'subject_name'>) {
    return useApi('/api/v1/question', {
      method: 'POST',
      body: JSON.stringify(question),
    })
  },

  updateQuestion(id: string, question: Partial<Question>) {
    return useApi<UpdateQuestionResponse>(`/api/v1/question/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    })
  },

  deleteQuestion(id: string) {
    return useApi(`/api/v1/question/${id}`, {
      method: 'DELETE',
    })
  },

  getQuestionDetail(id: string) {
    return useApi(`/api/v1/question/${id}`)
  },

  getQuestionsByType(type: 'multiple_choice' | 'essay', schoolId?: string) {
    const params = new URLSearchParams()
    params.append('question_type', type)
    if (schoolId) params.append('school_id', schoolId)
    else params.append('school_id', useAuth().schoolId())

    return useApi(`/api/v1/question/by-type?${params.toString()}`)
  },
}
