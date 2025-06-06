import type { Response } from './response'

export type Subject = {
  id: string
  name: string
  school_id: string
  created_at: number
  updated_at: number
}

export type ListSubjectResponse = Response<Subject[]>

export type CreateSubjectRequest = {
  name: string
  school_id: string
}

export type UpdateSubjectRequest = {
  name: string
}
