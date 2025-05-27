import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import {router} from '@/router'
import {useAuth} from "@/stores/useAuth.ts";

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

const auth = useAuth()
auth.init()

router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth
    if (requiresAuth && !auth.isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

app.use(router)
app.mount('#app')

