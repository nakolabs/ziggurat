export type Response<T> = {
    code: number;
    message: string;
    errors: { [key: string]: string };
    data: T,
    meta: any,
}

export type RegisterResponse = Response<{
    name: string,
    email: string,
    password: string,
    username: string,
}>

export type LoginResponse = Response<{
    access_token: string,
    refresh_token: string,
}>