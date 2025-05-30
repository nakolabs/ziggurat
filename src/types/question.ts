import type { Response } from './response'

export type QuestionType = 'multiple_choice' | 'essay'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type Question = {
  id: string
  question: string
  question_type: QuestionType
  subject_name: string
  subject_id: string
  difficulty_level: DifficultyLevel
  points: number
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
  question_type?: string
  difficulty_level?: string
}
