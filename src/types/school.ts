import type { Response } from './response'

export type School = {
  id: string
  name: string
  level: string
  description: string
  address: string
  city: string
  province: string
  postal_code: string
  phone: string
  email: string
  website: string
  logo: string
  banner: string
  created_at: number
  created_by: string
  updated_at: number
  student_count: number
  teacher_count: number
  status: string
}

export type SchoolStatistics = {
  student_count: number
  teacher_count: number
  class_count: number
  subject_count: number
  exam_count: number
  pending_students: number
  teacher_ratio: number
  avg_class_size: number
}

export type DetailSchoolResponse = Response<
  School & {
    statistics: SchoolStatistics
  }
>
export type ListSchoolResponse = Response<School[]>

export type ListSchoolStatisticsResponse = Response<{
  total_schools: number
  total_students: number
  total_teachers: number
  active_schools: number
}>
