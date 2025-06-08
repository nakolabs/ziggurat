import type { Response } from "./response"

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
}

export type DetailSchoolResponse = Response<School>
export type ListSchoolResponse = Response<School[]>