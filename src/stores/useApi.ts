import {createFetch} from "@vueuse/core";

const BASE_URL = import.meta.env.VITE_API_URL

export const useApi = createFetch({
    baseUrl: BASE_URL,
    combination: 'overwrite',
    options: {
        beforeFetch({options}) {
            console.log(options, "123")
            const token = localStorage.getItem("access_token");
            console.log(options.headers);
            // options.headers.Auh = `Bearer ${token}`;
            options.headers = {
                ...options.headers,
                "Authorization": `Bearer ${token}`,
            }
            //         // options?.headers[Authorization] = `Bearer ${token}`
            return {options}
        },
    },
    fetchOptions: {
        mode: "cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    }
})