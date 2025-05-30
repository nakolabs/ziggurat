import type { Response } from './response'

type Register = {
  name: string
  email: string
  password: string
  username: string
}

export type RegisterResponse = Response<Register>
