import {defineStore} from 'pinia'
import {jwtDecode} from "jwt-decode";
import type {JwtPayload} from "@/types/jwt.ts";

export const useAuth = defineStore('auth', {
    state: () => ({
        auth: null as null | {
            accessToken: string,
            refreshToken: string,
            payload: JwtPayload
        }
    }),

    getters: {
        isAuthenticated: (state) => !!state.auth,
    },

    actions: {
        get() {
            return this.auth
        },
        set(access: string, refresh: string) {
            const tokenDecoded = jwtDecode<JwtPayload>(access)
            const auth = {
                accessToken: access,
                refreshToken: refresh,
                payload: tokenDecoded,
            }
            this.auth = auth
            localStorage.setItem('auth', JSON.stringify(auth))
        },
        logout() {
            this.auth = null
            localStorage.removeItem('auth')
        },
        init() {
            const auth = localStorage.getItem("auth")
            if (auth) {
                this.auth = JSON.parse(auth)
            }
        }
    },
})
