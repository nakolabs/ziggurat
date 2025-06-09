import { createRouter, createWebHistory } from 'vue-router'

const LandingPage = () => import('@/pages/landing-page/index.vue')
const NotFoundPage = () => import('@/pages/not-found/index.vue')
const About = () => import('@/pages/about/index.vue')
const Register = () => import('@/pages/register/index.vue')
const EmailVerification = () => import('@/pages/email-confirmation/index.vue')
const Login = () => import('@/pages/login/index.vue')
const Home = () => import('@/pages/home/index.vue')
const School = () => import('@/pages/school/index.vue')
const Student = () => import('@/pages/student/index.vue')
const Teacher = () => import('@/pages/teacher/index.vue')
const TeacherDetail = () => import('@/pages/teacher/TeacherDetail.vue')
const Subject = () => import('@/pages/subject/index.vue')
const Class = () => import('@/pages/class/index.vue')
const Question = () => import('@/pages/question/index.vue')
const Exam = () => import('@/pages/exam/index.vue')
const PPDB = () => import('@/pages/ppdb/index.vue')

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/about', name: 'about', component: About },
  { path: '/register', name: 'Register', component: Register },
  { path: '/email-verification', name: 'EmailVerification', component: EmailVerification },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/teacher', name: 'Teacher', component: Teacher, meta: { requiresAuth: true } },
  {
    path: '/teacher/:id',
    name: 'TeacherDetail',
    component: TeacherDetail,
    meta: { requiresAuth: true },
  },
  { path: '/school', name: 'School', component: School, meta: { requiresAuth: true } },
  {
    path: '/school/:id',
    name: 'SchoolDetail',
    component: () => import('@/pages/school/detail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/school/create',
    name: 'CreateSchool',
    component: () => import('@/pages/school/create.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/student', name: 'Student', component: Student, meta: { requiresAuth: true } },
  {
    path: '/student/:id',
    name: 'DetailStudent',
    component: () => import('@/pages/student/detail.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/subject', name: 'Subject', component: Subject, meta: { requiresAuth: true } },
  {
    path: '/subject/:id',
    name: 'DetailSubject',
    component: () => import('@/pages/subject/detail.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/class', name: 'Class', component: Class, meta: { requiresAuth: true } },
  { path: '/question', name: 'Question', component: Question, meta: { requiresAuth: true } },
  { path: '/exam', name: 'Exam', component: Exam, meta: { requiresAuth: true } },
  { path: '/ppdb', name: 'PPDB', component: PPDB, meta: { requiresAuth: true } },
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
