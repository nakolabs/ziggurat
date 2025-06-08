import { ref, watch } from 'vue'
import { schoolService, type UpdateSchoolProfileRequest } from '@/services/schoolService'

export function useSchoolEdit(schoolData: any, onSuccess?: () => void) {
  const isEditMode = ref(false)
  const isSaving = ref(false)
  
  // Image files
  const logoFile = ref<File | null>(null)
  const bannerFile = ref<File | null>(null)
  const removeLogo = ref(false)
  const removeBanner = ref(false)
  
  const editForm = ref<UpdateSchoolProfileRequest>({
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
  })

  // Initialize form when school data loads
  watch(schoolData, (newData) => {
    if (newData) {
      editForm.value = {
        name: newData.name || '',
        level: newData.level || '',
        description: newData.description || '',
        address: newData.address || '',
        city: newData.city || '',
        province: newData.province || '',
        postal_code: newData.postal_code || '',
        phone: newData.phone || '',
        email: newData.email || '',
        website: newData.website || '',
      }
    }
  }, { immediate: true })

  const toggleEditMode = () => {
    isEditMode.value = true
  }

  const cancelEdit = () => {
    isEditMode.value = false
    // Reset form to original data
    if (schoolData.value) {
      editForm.value = {
        name: schoolData.value.name || '',
        level: schoolData.value.level || '',
        description: schoolData.value.description || '',
        address: schoolData.value.address || '',
        city: schoolData.value.city || '',
        province: schoolData.value.province || '',
        postal_code: schoolData.value.postal_code || '',
        phone: schoolData.value.phone || '',
        email: schoolData.value.email || '',
        website: schoolData.value.website || '',
      }
    }
    
    // Reset image states
    logoFile.value = null
    bannerFile.value = null
    removeLogo.value = false
    removeBanner.value = false
  }

  const handleLogoFile = (file: File | null) => {
    logoFile.value = file
    removeLogo.value = false
  }

  const handleBannerFile = (file: File | null) => {
    bannerFile.value = file
    removeBanner.value = false
  }

  const handleRemoveLogo = () => {
    logoFile.value = null
    removeLogo.value = true
  }

  const handleRemoveBanner = () => {
    bannerFile.value = null
    removeBanner.value = true
  }

  const uploadImage = async (file: File, type: 'logo' | 'banner'): Promise<string | null> => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)
    
    try {
      // Replace with your actual image upload API
      const response = await fetch('/api/upload/school-image', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.url
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
    
    return null
  }

  const saveChanges = async (schoolId: string) => {
    if (!editForm.value.name.trim()) {
      alert('School name is required')
      return false
    }

    isSaving.value = true
    try {
      // Prepare the update payload
      let updatePayload = { ...editForm.value }
      
      // Handle logo upload
      if (logoFile.value) {
        const logoUrl = await uploadImage(logoFile.value, 'logo')
        if (logoUrl) {
          updatePayload.logo = logoUrl
        }
      } else if (removeLogo.value) {
        updatePayload.logo = null
      }
      
      // Handle banner upload
      if (bannerFile.value) {
        const bannerUrl = await uploadImage(bannerFile.value, 'banner')
        if (bannerUrl) {
          updatePayload.banner = bannerUrl
        }
      } else if (removeBanner.value) {
        updatePayload.banner = null
      }
      
      const { data: updateData } = await schoolService.updateSchoolProfile(schoolId, updatePayload).json()
      
      if (updateData.value?.code === 200) {
        isEditMode.value = false
        // Reset image states
        logoFile.value = null
        bannerFile.value = null
        removeLogo.value = false
        removeBanner.value = false
        
        alert('School updated successfully!')
        onSuccess?.()
        return true
      } else {
        alert('Failed to update school: ' + (updateData.value?.message || 'Unknown error'))
        return false
      }
    } catch (error) {
      console.error('Failed to update school:', error)
      alert('Failed to update school. Please try again.')
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    isEditMode,
    isSaving,
    editForm,
    logoFile,
    bannerFile,
    toggleEditMode,
    cancelEdit,
    saveChanges,
    handleLogoFile,
    handleBannerFile,
    handleRemoveLogo,
    handleRemoveBanner
  }
}
