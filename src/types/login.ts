import type { Response } from './response'

type TokenResponse = {
  access_token: string
  refresh_token: string
}

export type LoginResponse = Response<TokenResponse>
export type RefreshTokenResponse = Response<TokenResponse>
