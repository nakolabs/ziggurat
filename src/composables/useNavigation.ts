import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Home,
  Building,
  Users,
  GraduationCap,
  BookOpen,
  School,
  HelpCircle,
  FileText,
  UserPlus,
} from 'lucide-vue-next'

export interface NavigationItem {
  name: string
  path: string
  icon: any
}

export interface Breadcrumb {
  name: string
  path: string
}

export function useNavigation() {
  const route = useRoute()

  const navigationItems: NavigationItem[] = [
    {
      name: 'Home',
      path: '/home',
      icon: Home,
    },
    {
      name: 'Schools',
      path: '/school',
      icon: Building,
    },
    {
      name: 'Teachers',
      path: '/teacher',
      icon: Users,
    },
    {
      name: 'Students',
      path: '/student',
      icon: GraduationCap,
    },
    {
      name: 'Subjects',
      path: '/subject',
      icon: BookOpen,
    },
    {
      name: 'Classes',
      path: '/class',
      icon: School,
    },
    {
      name: 'Exams',
      path: '/exam',
      icon: FileText,
    },
    {
      name: 'Questions',
      path: '/question',
      icon: HelpCircle,
    },
    {
      name: 'PPDB',
      path: '/ppdb',
      icon: UserPlus,
    },
  ]

  const isRouteActive = (item: NavigationItem): boolean => {
    if (item.path === '/school') {
      return route.path.startsWith('/school')
    }
    return route.path.startsWith(item.path)
  }

  const breadcrumbs = computed((): Breadcrumb[] => {
    const pathSegments = route.path.split('/').filter(Boolean)
    const crumbs: Breadcrumb[] = []
    
    if (pathSegments.length === 0) return []
    
    const routeHandlers: Record<string, () => void> = {
      school: () => {
        crumbs.push({ name: 'Schools', path: '/school' })
        
        if (pathSegments[1] === 'profile') {
          crumbs.push({ name: 'Profile', path: '/school/profile' })
        } else if (pathSegments[1] === 'create') {
          crumbs.push({ name: 'Create', path: '/school/create' })
        } else if (pathSegments[1] === 'edit' && pathSegments[2]) {
          crumbs.push({ name: 'Edit', path: route.path })
        } else if (pathSegments[1] && pathSegments[1] !== 'create') {
          crumbs.push({ name: 'Details', path: route.path })
        }
      },
      teacher: () => {
        crumbs.push({ name: 'Teachers', path: '/teacher' })
        
        if (pathSegments[1] === 'create') {
          crumbs.push({ name: 'Create', path: '/teacher/create' })
        } else if (pathSegments[1]) {
          crumbs.push({ name: 'Details', path: route.path })
        }
      },
      student: () => {
        crumbs.push({ name: 'Students', path: '/student' })
        
        if (pathSegments[1] === 'create') {
          crumbs.push({ name: 'Create', path: '/student/create' })
        } else if (pathSegments[1]) {
          crumbs.push({ name: 'Details', path: route.path })
        }
      },
      exam: () => {
        crumbs.push({ name: 'Exams', path: '/exam' })
        
        if (pathSegments[1] === 'create') {
          crumbs.push({ name: 'Create', path: '/exam/create' })
        } else if (pathSegments[1] === 'result') {
          crumbs.push({ name: 'Results', path: '/exam/result' })
        } else if (pathSegments[1]) {
          crumbs.push({ name: 'Details', path: route.path })
        }
      },
      question: () => {
        crumbs.push({ name: 'Questions', path: '/question' })
        
        if (pathSegments[1] === 'create') {
          crumbs.push({ name: 'Create', path: '/question/create' })
        } else if (pathSegments[1]) {
          crumbs.push({ name: 'Details', path: route.path })
        }
      }
    }

    const handler = routeHandlers[pathSegments[0]]
    if (handler) {
      handler()
    } else {
      const mainItem = navigationItems.find(item => route.path.startsWith(item.path))
      if (mainItem) {
        crumbs.push({ name: mainItem.name, path: mainItem.path })
      }
    }
    
    return crumbs
  })

  return {
    navigationItems,
    isRouteActive,
    breadcrumbs,
  }
}
