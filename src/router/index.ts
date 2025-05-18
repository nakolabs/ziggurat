import {createRouter, createWebHistory} from 'vue-router'

const LandingPage = () => import('@/pages/landing-page/index.vue')
const NotFoundPage = () => import('@/pages/not-found/index.vue')
const About = () => import('@/pages/about/index.vue')
const Register = () => import('@/pages/register/index.vue')
const EmailVerification = () => import('@/pages/email-confirmation/index.vue')
const Login = () => import('@/pages/login/index.vue')
const Dashboard = () => import('@/pages/dashboard/index.vue')

const routes = [
    {path: '/', name: 'LandingPage', component: LandingPage},
    {path: '/about', name: 'about', component: About},
    {path: '/register', name: 'Register', component: Register},
    {path: '/email-verification', name: 'EmailVerification', component: EmailVerification},
    {path: '/login', name: 'Login', component: Login},
    {path: '/dashboard', name: 'Dashboard', component: Dashboard},
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundPage,
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
