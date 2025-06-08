import { ref, computed } from 'vue'
import { schoolService, type UpdateSchoolProfileRequest } from '@/services/schoolService'

export function useSchoolForm() {
  const formData = ref<UpdateSchoolProfileRequest & { status: string }>({
    name: '',
    level: '',
    description: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    status: 'active'
  })

  const errors = ref<Record<string, string>>({})

  const validateField = (field: string) => {
    switch (field) {
      case 'name':
        if (!formData.value.name.trim()) {
          errors.value.name = 'School name is required'
        } else if (formData.value.name.trim().length < 2) {
          errors.value.name = 'School name must be at least 2 characters'
        } else {
          delete errors.value.name
        }
        break
      case 'level':
        if (!formData.value.level) {
          errors.value.level = 'Education level is required'
        } else {
          delete errors.value.level
        }
        break
    }
  }

  const isFormValid = computed(() => {
    return formData.value.name.trim().length >= 2 && 
           formData.value.level && 
           Object.keys(errors.value).length === 0
  })

  const submitForm = async () => {
    validateField('name')
    validateField('level')
    
    if (!isFormValid.value) {
      throw new Error('Form validation failed')
    }

    const { status, ...schoolData } = formData.value
    return await schoolService.createSchool(schoolData).json()
  }

  return {
    formData,
    errors,
    validateField,
    isFormValid,
    submitForm
  }
}
