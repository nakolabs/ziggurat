import { useApi } from '@/stores/useApi'

export interface StoreImageRequest {
  file: File
  folder?: string
  public_id?: string
}

export interface StoreVideoRequest {
  file: File
  folder?: string
  public_id?: string
}

export interface StoreDocumentRequest {
  file: File
  folder?: string
  public_id?: string
}

export interface DeleteFileRequest {
  public_id: string
  resource_type: 'image' | 'video' | 'raw'
}

export const storageService = {
  // Store image
  storeImage(data: StoreImageRequest) {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.folder) formData.append('folder', data.folder)
    if (data.public_id) formData.append('public_id', data.public_id)

    return useApi('/api/v1/storage/image', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let browser set it with boundary
      },
    })
  },

  // Store video
  storeVideo(data: StoreVideoRequest) {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.folder) formData.append('folder', data.folder)
    if (data.public_id) formData.append('public_id', data.public_id)

    return useApi('/api/v1/storage/video', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let browser set it with boundary
      },
    })
  },

  // Store document
  storeDocument(data: StoreDocumentRequest) {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.folder) formData.append('folder', data.folder)
    if (data.public_id) formData.append('public_id', data.public_id)

    return useApi('/api/v1/storage/document', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let browser set it with boundary
      },
    })
  },

  // Delete file
  deleteFile(data: DeleteFileRequest) {
    return useApi('/api/v1/storage/file', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  },

  // Get file
  getFile(publicId: string) {
    return useApi(`/api/v1/storage/file/${publicId}`)
  },

  // Get storage history
  getStorageHistory(query?: {
    file_type?: string
    page?: number
    page_size?: number
    order_by?: string
    order?: 'asc' | 'desc'
  }) {
    const params = new URLSearchParams()

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    return useApi(`/api/v1/storage/history?${params.toString()}`)
  },

  // Get storage history by type
  getStorageHistoryByType(
    fileType: string,
    query?: {
      page?: number
      page_size?: number
      order_by?: string
      order?: 'asc' | 'desc'
    },
  ) {
    const params = new URLSearchParams()

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    return useApi(`/api/v1/storage/history/${fileType}?${params.toString()}`)
  },
}
