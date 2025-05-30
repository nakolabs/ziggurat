import type { Response } from './response'

export type Student = {
  id: string
  name: string
  email: string
  class_id?: string
  class_name?: string
  created_at: number
  updated_at: number
}

export type StudentListQuery = {
  class_id?: string
  page?: number
  page_size?: number
  order_by?: string
  order?: 'asc' | 'desc'
}

export type ListStudentResponse = Response<Student[]>
