import type { Response } from './response'

export type Exam = {
  id: string
  name: string
  school_id: string
  subject_id: string
  subject_name: string
  class_id: string
  class_name: string
  multiple_choice_ids: string[]
  essay_question_ids: string[]
  exam_date?: number
  duration?: number
  status: 'draft' | 'published' | 'active' | 'completed'
  created_at: number
  updated_at: number
}

export type ExamQuestion = {
  id: string
  question: string
  question_type: 'multiple_choice' | 'essay'
  options?: QuestionOption[]
  correct_answer?: string
}

export type QuestionOption = {
  id: string
  text: string
}

export type ExamDetail = Exam & {
  questions: ExamQuestion[]
}

export type ExamStudent = {
  id: string
  name: string
  email: string
  grade?: number
  is_graded: boolean
  created_at: number
  updated_at: number
}

export type CreateExamRequest = {
  name: string
  school_id: string
  subject_id: string
  class_id: string
  multiple_choice_ids: string[]
  essay_question_ids: string[]
  exam_date?: string
  duration?: number
}

export type ExamListQuery = {
  school_id: string
  subject_id?: string
  page?: number
  page_size?: number
  order_by?: string
  order?: 'asc' | 'desc'
  search?: string
  status?: string
}

export type ListExamResponse = Response<Exam[]>
