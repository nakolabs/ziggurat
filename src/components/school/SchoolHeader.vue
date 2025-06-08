<template>
  <div class="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
    <!-- Simplified logo -->
    <div class="relative group">
      <div class="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
        <img 
          v-if="school?.logo" 
          :src="school.logo" 
          :alt="school.name" 
          class="w-full h-full object-cover" 
        />
        <div 
          v-else 
          class="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center"
        >
          <span class="text-white font-semibold text-lg">{{ school?.name?.charAt(0) || 'S' }}</span>
        </div>
      </div>
      
      <!-- Edit button -->
      <button
        @click="$emit('edit-logo')"
        class="absolute -top-1 -right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <span class="text-xs">✏️</span>
      </button>
    </div>
    
    <!-- School info -->
    <div>
      <h2 class="text-lg font-semibold text-white mb-1">
        {{ school?.name || 'School Details' }}
      </h2>
      <div class="flex items-center gap-2 text-sm text-white/80">
        <span>{{ formatLevel(school?.level) }}</span>
        <span>•</span>
        <span>{{ formatDate(school?.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  school?: any
}

defineProps<Props>()

defineEmits<{
  'edit-logo': []
}>()

const formatLevel = (level: string) => {
  if (!level) return '-'
  
  const levelMap: Record<string, string> = {
    'elementary': 'Elementary School',
    'junior': 'Junior High School', 
    'senior': 'Senior High School',
    'university': 'University'
  }
  
  return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1)
}

const formatDate = (timestamp: number | string) => {
  if (!timestamp || timestamp === 0) return '-'
  
  const date = typeof timestamp === 'string' ? new Date(parseInt(timestamp)) : new Date(timestamp)
  
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
