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
    const response = useApi<ListQuestionResponse>(
      '/api/v1/question?school_id=' + useAuth().schoolId(),
    )
    return response
  },

  createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'subject_name'>) {
    const response = useApi('/api/v1/question', {
      method: 'POST',
      body: JSON.stringify(question),
    })
    return response
  },

  updateQuestion(id: string, question: Partial<Question>) {
    const response = useApi<UpdateQuestionResponse>(`/api/v1/question/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    })
    return response
  },

  deleteQuestion(id: string) {
    const response = useApi(`/api/v1/question/${id}`, {
      method: 'DELETE',
    })
    return response
  },
}
