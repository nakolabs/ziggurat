import type { Response } from './response'

export type Teacher = {
  id: string
  name: string
  email: string
  school_id: string
  is_verified: boolean
  created_at: number
  updated_at: number
}

export type ListTeacherResponse = Response<Teacher[]>
export type TeacherDetailResponse = Response<Teacher>

export type TeacherSubject = {
  id: string
  name: string
  created_at: number
  updated_at: number
}
