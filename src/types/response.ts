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
