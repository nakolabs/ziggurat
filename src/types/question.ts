import type { Response } from './response'

export type QuestionType = 'multiple_choice' | 'essay'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type Question = {
  id: string
  question: string
  question_type: QuestionType
  subject_name: string
  subject_id: string
  school_id: string
  difficulty_level: DifficultyLevel
  points: number
  options?: Array<{
    id: string
    text: string
  }>
  correct_answer?: string
  essay_answer?: string
  created_at: number
  updated_at: number
}

export type MultipleChoiceOption = {
  id: string
  text: string
}

export type ListQuestionResponse = Response<Question[]>
export type CreateQuestionResponse = Response<Question>
export type UpdateQuestionResponse = Response<Question>

export type ListQuestionQuery = {
  school_id?: string
  subject_id?: string
  question_type?: QuestionType
  difficulty_level?: DifficultyLevel
  page?: number
  page_size?: number
  order_by?: string
  order?: 'asc' | 'desc'
  search?: string
}
