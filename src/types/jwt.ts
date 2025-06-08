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
        school_role: string,
        school_id: string,
        user_role: string
    }
}