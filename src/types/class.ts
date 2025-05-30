import type { Response } from './response'

export type Class = {
  id: string
  name: string
  school_id: string
  created_at: number
  updated_at: number
}

export type CreateClassRequest = {
  name: string
  school_id: string
}

export type UpdateClassRequest = {
  name: string
}

export type GetClassesQuery = {
  school_id: string
  page?: number
  page_size?: number
  order_by?: string
  order?: 'asc' | 'desc'
  search?: string
}

export type ListClassResponse = Response<Class[]>

export type ClassDetailResponse = Response<Class>

export type ClassStudent = {
  id: string
  name: string
  email: string
  created_at: number
  updated_at: number
}

export type ListClassStudentsResponse = Response<ClassStudent[]>
