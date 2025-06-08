<template>
  <component :is="iconComponent" :class="class" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { 
  Mail, 
  Phone, 
  User, 
  Book, 
  School, 
  Settings,
  Building2,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  Trash2,
  AlertTriangle,
  BarChart3
} from 'lucide-vue-next'

const props = defineProps<{
  name: string
  class?: string
}>()

const iconComponent = computed(() => {
  const iconMap = {
    email: Mail,
    phone: Phone,
    user: User,
    book: Book,
    class: School,
    cog: Settings,
    building: Building2,
    file: FileText,
    users: Users,
    alert: AlertCircle,
    check: CheckCircle,
    plus: Plus,
    x: X,
    trash: Trash2,
    warning: AlertTriangle,
    chart: BarChart3,
  }
  return iconMap[props.name] || User
})
</script>
