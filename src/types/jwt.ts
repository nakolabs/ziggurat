export type JwtPayload = {
    exp: number,
    iat: number,
    nbf: number,
    iss: string,
    sub: string,
    aud: string,
    user: {
        id: string
        email: string,
        role_id: string,
        school_id: string,
    }
}