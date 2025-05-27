export type Response<T> = {
  code: number
  message: string
  errors: { [key: string]: string }
  data: T
  meta: Meta
}

export type Meta = {
  pagination: {
    total_data: number
    total_page: number
    page_num: number
    page_size: number
  }
  filter: {
    end_date: number
    school_id: string
    search: string
    search_by: string[]
    start_date: number
  }
  order: {
    order: 'asc' | 'desc'
    order_by: string
  }
}

export type RegisterResponse = Response<{
  name: string
  email: string
  password: string
  username: string
}>

type TokenResponse = {
  access_token: string
  refresh_token: string
}
export type LoginResponse = Response<TokenResponse>
export type RefreshTokenResponse = Response<TokenResponse>

export type Teacher = {
  id: string
  name: string
  email: string
  is_verified: boolean
  created_at: number
  updated_at: number
}

export type ListTeacherResponse = Response<Teacher[]>

export type TeacherDetailResponse = Response<Teacher>
