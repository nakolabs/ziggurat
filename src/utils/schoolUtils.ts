export const formatLevel = (level: string) => {
  const levelMap: Record<string, string> = {
    'elementary': 'Elementary School',
    'junior': 'Junior High School',
    'senior': 'Senior High School',
    'university': 'University'
  }
  return levelMap[level] || level
}

export const getLevelColor = (level: string) => {
  const colorMap: Record<string, string> = {
    'elementary': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    'junior': 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    'senior': 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    'university': 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
  }
  return colorMap[level] || 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
}

export const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export const getStatusDotColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'active': 'bg-green-500',
    'inactive': 'bg-red-500',
    'pending': 'bg-yellow-500'
  }
  return colorMap[status] || 'bg-gray-500'
}
