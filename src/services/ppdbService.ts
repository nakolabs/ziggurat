import { useApi } from '@/stores/useApi'

export interface CreatePPDBRequest {
  name: string
  description: string
  start_date: string
  end_date: string
  max_registrants: number
  requirements?: string[]
  school_id: string
}

export interface UpdatePPDBRequest extends CreatePPDBRequest {
  id: string
}

export interface PPDBListQuery {
  school_id: string
  page?: number
  page_size?: number
  search?: string
  status?: 'active' | 'upcoming' | 'closed'
}

export interface PPDBRegistrantsQuery {
  ppdb_id: string
  page?: number
  page_size?: number
}

export interface RegisterPPDBRequest {
  ppdb_id: string
  student_name: string
  parent_name: string
  parent_phone: string
  parent_email: string
  address: string
  birth_date: string
  previous_school?: string
  documents: string[] // Array of file URLs
}

export interface PPDBSelectionRequest {
  ppdb_id: string
  selected_student_ids: string[]
}

export const ppdbService = {
  // Get list of PPDB programs
  getListPPDB(query: PPDBListQuery) {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    return useApi(`/api/v1/ppdb?${params.toString()}`)
  },

  // Get PPDB detail
  getPPDBDetail(ppdbId: string) {
    return useApi(`/api/v1/ppdb/${ppdbId}`)
  },

  // Create new PPDB
  createPPDB(data: CreatePPDBRequest) {
    return useApi('/api/v1/ppdb', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update PPDB
  updatePPDB(data: UpdatePPDBRequest) {
    return useApi(`/api/v1/ppdb/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete PPDB
  deletePPDB(ppdbId: string) {
    return useApi(`/api/v1/ppdb/${ppdbId}`, {
      method: 'DELETE',
    })
  },

  // Register for PPDB
  registerPPDB(data: RegisterPPDBRequest) {
    return useApi('/api/v1/ppdb/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get PPDB registrants
  getPPDBRegistrants(query: PPDBRegistrantsQuery) {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    return useApi(`/api/v1/ppdb/registrants?${params.toString()}`)
  },

  // Select PPDB students
  selectPPDBStudents(data: PPDBSelectionRequest) {
    return useApi('/api/v1/ppdb/select', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Export registrants data
  exportRegistrants(ppdbId: string) {
    return useApi(`/api/v1/ppdb/${ppdbId}/export`, {
      method: 'GET',
    })
  },
}
