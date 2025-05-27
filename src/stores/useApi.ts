import { createFetch } from '@vueuse/core'
import type { RefreshTokenResponse, Response } from '@/types/response.ts'
import { useAuth } from '@/stores/useAuth.ts'

const BASE_URL = import.meta.env.VITE_API_URL
let isRefreshing = false
const refreshSubscribers: Array<() => void> = []

export const useApi = createFetch({
  baseUrl: BASE_URL,
  combination: 'overwrite',
  options: {
    beforeFetch({ options }) {
      const token = localStorage.getItem('access_token')
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
      return { options }
    },
    updateDataOnError: true,
    async onFetchError({ error, data, response, execute }) {
      if (response?.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true

          try {
            const auth = useAuth()
            const refreshResponse = await fetch(BASE_URL + '/api/v1/auth/refresh-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refresh_token: auth.get()?.refreshToken,
              }),
            })

            console.log('refreshResponse', refreshResponse.status)

            if (!refreshResponse.ok) {
              window.location.href = '/login'
              return { data, response }
            }

            const refreshData: RefreshTokenResponse = await refreshResponse.json()
            console.log('refreshData', refreshData)
            const newAccessToken = refreshData.data.access_token
            const newRefreshToken = refreshData.data.refresh_token

            // Set new tokens
            localStorage.setItem('access_token', newAccessToken)
            auth.set(newAccessToken, newRefreshToken)

            // Notify all waiting requests
            refreshSubscribers.forEach((callback) => callback())
            refreshSubscribers.length = 0
            isRefreshing = false

            // Retry original request with new token
            const retryResponse = await execute()
            return retryResponse
          } catch (error) {
            window.location.href = '/login'
            return { data, response }
          }
        } else {
          return new Promise((resolve) => {
            refreshSubscribers.push(async () => {
              const retryResponse = await execute()
              resolve(retryResponse)
            })
          })
        }
      }
      return { data, response }
    },
  },
  fetchOptions: {
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
})
