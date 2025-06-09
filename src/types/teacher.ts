import type { Response } from './response'

export type Teacher = {
  id: string
  name: string
  email: string
  subjects: TeacherSubject[]
  classes: TeacherClass[]
  school_id: string
  is_verified: boolean
  created_at: number
  updated_at: number
}

export type ListTeacherResponse = Response<Teacher[]>
export type TeacherDetailResponse = Response<Teacher>
export type TeacherStatisticsResponse = Response<{
  total_teachers: number
  verified_teachers: number
  pending_teachers: number
  active_teachers: number
}>

export type TeacherSubject = {
  id: string
  name: string
  created_at: number
  updated_at: number
}

export type TeacherClass = {
  id: string
  name: string
  created_at: number
  updated_at: number
}
