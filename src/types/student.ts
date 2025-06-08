import type { Response } from './response'

export type Student = {
  id: string
  name: string
  email: string
  grade?: string
  class_id?: string
  class_name?: string
  is_verified: boolean
  created_at: number
  updated_at: number
}

export type StudentListQuery = {
  school_id: string
  class_id?: string
  page?: number
  page_size?: number
  order_by?: string
  order?: 'asc' | 'desc'
  search?: string
  grade?: string
  is_verified?: boolean
}

export type ListStudentResponse = Response<Student[]>

export type InviteStudentRequest = {
  school_id: string
  emails: string[]
  grade?: string
}

export type VerifyStudentEmailRequest = {
  email: string
  token: string
}

export type UpdateStudentAfterInviteRequest = {
  email: string
  password: string
  name: string
}

export type UpdateStudentClassRequest = {
  student_id: string
  old_class_id?: string
  new_class_id: string
}

export type DetailStudentResponse = Response<Student>