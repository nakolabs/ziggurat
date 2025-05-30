import type { Response } from './response'

export type Subject = {
  id: string
  name: string
  school_id: string
  created_at: string
  updated_at: string
}

export type ListSubjectResponse = Response<Subject[]>
