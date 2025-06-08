import { ref, nextTick } from 'vue'

export interface CropperConfig {
  outputWidth?: number
  outputHeight?: number
  initialCropRatio?: number
  quality?: number
  outputFormat?: 'image/png' | 'image/jpeg' | 'image/webp'
  minCropSize?: number
  maxCropSize?: number
}

export interface CropState {
  image: HTMLImageElement | null
  cropX: number
  cropY: number
  cropSize: number
  isDragging: boolean
  isResizing: boolean
  resizeHandle: string | null
  startX: number
  startY: number
  startCropX: number
  startCropY: number
  startCropSize: number
  imageWidth: number
  imageHeight: number
  scale: number
}

export function useCropper(config: CropperConfig = {}) {
  const {
    outputWidth = 512,
    outputHeight = 512,
    initialCropRatio = 0.8,
    quality = 0.9,
    outputFormat = 'image/png',
    minCropSize = 50,
    maxCropSize = Infinity
  } = config

  const cropCanvas = ref<HTMLCanvasElement>()
  const previewCanvas = ref<HTMLCanvasElement>()
  
  const cropState = ref<CropState>({
    image: null,
    cropX: 0,
    cropY: 0,
    cropSize: 0,
    isDragging: false,
    isResizing: false,
    resizeHandle: null,
    startX: 0,
    startY: 0,
    startCropX: 0,
    startCropY: 0,
    startCropSize: 0,
    imageWidth: 0,
    imageHeight: 0,
    scale: 1
  })

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      
      img.onload = () => {
        cropState.value.image = img
        URL.revokeObjectURL(objectUrl)
        resolve(img)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Failed to load image'))
      }
      
      img.src = objectUrl
    })
  }

  const initializeCropper = async () => {
    if (!cropCanvas.value || !cropState.value.image) return
    
    await nextTick()
    
    const canvas = cropCanvas.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const img = cropState.value.image
    const containerWidth = canvas.offsetWidth
    const containerHeight = canvas.offsetHeight
    
    // Set canvas size
    canvas.width = containerWidth
    canvas.height = containerHeight
    
    // Calculate scale to fit image in container
    const scaleX = containerWidth / img.width
    const scaleY = containerHeight / img.height
    const scale = Math.min(scaleX, scaleY)
    
    const imageWidth = img.width * scale
    const imageHeight = img.height * scale
    const imageX = (containerWidth - imageWidth) / 2
    const imageY = (containerHeight - imageHeight) / 2
    
    cropState.value.scale = scale
    cropState.value.imageWidth = imageWidth
    cropState.value.imageHeight = imageHeight
    
    // Initialize crop area (square in the center)
    const cropSize = Math.min(imageWidth, imageHeight) * initialCropRatio
    cropState.value.cropSize = cropSize
    cropState.value.cropX = imageX + (imageWidth - cropSize) / 2
    cropState.value.cropY = imageY + (imageHeight - cropSize) / 2
    
    drawCropper()
  }

  const drawCropper = () => {
    if (!cropCanvas.value || !cropState.value.image) return
    
    const canvas = cropCanvas.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const img = cropState.value.image
    const { cropX, cropY, cropSize, imageWidth, imageHeight } = cropState.value
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Calculate image position
    const imageX = (canvas.width - imageWidth) / 2
    const imageY = (canvas.height - imageHeight) / 2
    
    // Draw image (darker version for outside crop area)
    ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight)
    
    // Draw dark overlay over entire image
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Clear the crop area to show bright image
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillRect(cropX, cropY, cropSize, cropSize)
    
    // Redraw the bright image in crop area only
    ctx.globalCompositeOperation = 'source-over'
    ctx.save()
    ctx.beginPath()
    ctx.rect(cropX, cropY, cropSize, cropSize)
    ctx.clip()
    ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight)
    ctx.restore()
    
    // Draw crop border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.strokeRect(cropX, cropY, cropSize, cropSize)
    
    // Draw corner handles (white with shadow for better visibility)
    const handleSize = 12
    
    // Draw shadow for handles
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    const shadowOffset = 2
    const handles = [
      { x: cropX - handleSize/2 + shadowOffset, y: cropY - handleSize/2 + shadowOffset },
      { x: cropX + cropSize - handleSize/2 + shadowOffset, y: cropY - handleSize/2 + shadowOffset },
      { x: cropX - handleSize/2 + shadowOffset, y: cropY + cropSize - handleSize/2 + shadowOffset },
      { x: cropX + cropSize - handleSize/2 + shadowOffset, y: cropY + cropSize - handleSize/2 + shadowOffset }
    ]
    
    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize)
    })
    
    // Draw white handles
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    
    const mainHandles = [
      { x: cropX - handleSize/2, y: cropY - handleSize/2 },
      { x: cropX + cropSize - handleSize/2, y: cropY - handleSize/2 },
      { x: cropX - handleSize/2, y: cropY + cropSize - handleSize/2 },
      { x: cropX + cropSize - handleSize/2, y: cropY + cropSize - handleSize/2 }
    ]
    
    mainHandles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize)
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize)
    })
  }

  const updatePreview = () => {
    if (!previewCanvas.value || !cropState.value.image) return
    
    const previewCtx = previewCanvas.value.getContext('2d')
    if (!previewCtx) return
    
    const { image, cropX, cropY, cropSize, scale, imageWidth, imageHeight } = cropState.value
    const canvas = cropCanvas.value!
    
    // Set preview canvas size
    previewCanvas.value.width = 64
    previewCanvas.value.height = 64
    
    // Calculate source coordinates on original image
    const imageX = (canvas.width - imageWidth) / 2
    const imageY = (canvas.height - imageHeight) / 2
    
    const srcX = (cropX - imageX) / scale
    const srcY = (cropY - imageY) / scale
    const srcSize = cropSize / scale
    
    // Draw cropped image to preview
    previewCtx.drawImage(
      image,
      srcX, srcY, srcSize, srcSize,
      0, 0, 64, 64
    )
  }

  const getResizeHandle = (x: number, y: number): string | null => {
    const { cropX, cropY, cropSize } = cropState.value
    const handleSize = 12
    const tolerance = 6
    
    // Check each corner handle
    const handles = [
      { x: cropX, y: cropY, type: 'nw' },
      { x: cropX + cropSize, y: cropY, type: 'ne' },
      { x: cropX, y: cropY + cropSize, type: 'sw' },
      { x: cropX + cropSize, y: cropY + cropSize, type: 'se' }
    ]
    
    for (const handle of handles) {
      if (Math.abs(x - handle.x) <= tolerance && Math.abs(y - handle.y) <= tolerance) {
        return handle.type
      }
    }
    
    return null
  }

  const isInsideCropArea = (x: number, y: number): boolean => {
    const { cropX, cropY, cropSize } = cropState.value
    return x >= cropX && x <= cropX + cropSize && y >= cropY && y <= cropY + cropSize
  }

  const startCrop = (event: MouseEvent) => {
    const rect = cropCanvas.value!.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const { cropX, cropY, cropSize } = cropState.value
    
    // Check if clicking on a resize handle
    const resizeHandle = getResizeHandle(x, y)
    if (resizeHandle) {
      cropState.value.isResizing = true
      cropState.value.resizeHandle = resizeHandle
      cropState.value.startX = x
      cropState.value.startY = y
      cropState.value.startCropX = cropX
      cropState.value.startCropY = cropY
      cropState.value.startCropSize = cropSize
      return
    }
    
    // Check if clicking inside crop area for dragging
    if (isInsideCropArea(x, y)) {
      cropState.value.isDragging = true
      cropState.value.startX = x - cropX
      cropState.value.startY = y - cropY
    }
  }

  const updateCrop = (event: MouseEvent) => {
    if (!cropState.value.isDragging && !cropState.value.isResizing) return
    
    const rect = cropCanvas.value!.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const canvas = cropCanvas.value!
    const { imageWidth, imageHeight } = cropState.value
    const imageX = (canvas.width - imageWidth) / 2
    const imageY = (canvas.height - imageHeight) / 2
    
    if (cropState.value.isResizing) {
      const { startX, startY, startCropX, startCropY, startCropSize, resizeHandle } = cropState.value
      const deltaX = x - startX
      const deltaY = y - startY
      
      let newCropX = startCropX
      let newCropY = startCropY
      let newCropSize = startCropSize
      
      // Calculate new crop area based on resize handle
      switch (resizeHandle) {
        case 'nw': // top-left
          newCropSize = Math.max(startCropSize - Math.max(deltaX, deltaY), minCropSize)
          newCropX = startCropX + startCropSize - newCropSize
          newCropY = startCropY + startCropSize - newCropSize
          break
        case 'ne': // top-right
          newCropSize = Math.max(startCropSize + Math.max(deltaX, -deltaY), minCropSize)
          newCropY = startCropY + startCropSize - newCropSize
          break
        case 'sw': // bottom-left
          newCropSize = Math.max(startCropSize + Math.max(-deltaX, deltaY), minCropSize)
          newCropX = startCropX + startCropSize - newCropSize
          break
        case 'se': // bottom-right
          newCropSize = Math.max(startCropSize + Math.max(deltaX, deltaY), minCropSize)
          break
      }
      
      // Apply constraints
      const maxAllowedSize = Math.min(imageWidth, imageHeight, maxCropSize)
      newCropSize = Math.min(newCropSize, maxAllowedSize)
      
      // Ensure crop area stays within image bounds
      newCropX = Math.max(imageX, Math.min(imageX + imageWidth - newCropSize, newCropX))
      newCropY = Math.max(imageY, Math.min(imageY + imageHeight - newCropSize, newCropY))
      
      cropState.value.cropX = newCropX
      cropState.value.cropY = newCropY
      cropState.value.cropSize = newCropSize
      
    } else if (cropState.value.isDragging) {
      const { startX, startY, cropSize } = cropState.value
      
      // Calculate new position
      let newX = x - startX
      let newY = y - startY
      
      // Constrain to image bounds
      newX = Math.max(imageX, Math.min(imageX + imageWidth - cropSize, newX))
      newY = Math.max(imageY, Math.min(imageY + imageHeight - cropSize, newY))
      
      cropState.value.cropX = newX
      cropState.value.cropY = newY
    }
    
    drawCropper()
  }

  const endCrop = () => {
    cropState.value.isDragging = false
    cropState.value.isResizing = false
    cropState.value.resizeHandle = null
  }

  const resetCrop = () => {
    if (!cropCanvas.value || !cropState.value.image) return
    
    const canvas = cropCanvas.value
    const { imageWidth, imageHeight } = cropState.value
    
    const imageX = (canvas.width - imageWidth) / 2
    const imageY = (canvas.height - imageHeight) / 2
    const cropSize = Math.min(imageWidth, imageHeight) * initialCropRatio
    
    cropState.value.cropSize = cropSize
    cropState.value.cropX = imageX + (imageWidth - cropSize) / 2
    cropState.value.cropY = imageY + (imageHeight - cropSize) / 2
    
    drawCropper()
  }

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    
    const rect = cropCanvas.value!.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Only resize if mouse is over crop area
    if (!isInsideCropArea(x, y)) return
    
    const { cropX, cropY, cropSize, imageWidth, imageHeight } = cropState.value
    const canvas = cropCanvas.value!
    const imageX = (canvas.width - imageWidth) / 2
    const imageY = (canvas.height - imageHeight) / 2
    
    // Calculate size change (negative wheelDelta means zoom in)
    const sizeChange = event.deltaY > 0 ? -10 : 10
    let newCropSize = Math.max(minCropSize, Math.min(Math.min(imageWidth, imageHeight, maxCropSize), cropSize + sizeChange))
    
    // Calculate new position to keep crop centered around mouse
    const centerX = cropX + cropSize / 2
    const centerY = cropY + cropSize / 2
    let newCropX = centerX - newCropSize / 2
    let newCropY = centerY - newCropSize / 2
    
    // Ensure crop area stays within image bounds
    newCropX = Math.max(imageX, Math.min(imageX + imageWidth - newCropSize, newCropX))
    newCropY = Math.max(imageY, Math.min(imageY + imageHeight - newCropSize, newCropY))
    
    cropState.value.cropX = newCropX
    cropState.value.cropY = newCropY
    cropState.value.cropSize = newCropSize
    
    drawCropper()
  }

  const updateCursor = (event: MouseEvent) => {
    if (!cropCanvas.value) return
    
    const rect = cropCanvas.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const resizeHandle = getResizeHandle(x, y)
    const canvas = cropCanvas.value
    
    if (resizeHandle) {
      switch (resizeHandle) {
        case 'nw':
        case 'se':
          canvas.style.cursor = 'nw-resize'
          break
        case 'ne':
        case 'sw':
          canvas.style.cursor = 'ne-resize'
          break
      }
    } else if (isInsideCropArea(x, y)) {
      canvas.style.cursor = 'move'
    } else {
      canvas.style.cursor = 'default'
    }
  }

  const getCroppedFile = (originalFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!cropState.value.image) {
        reject(new Error('No image loaded'))
        return
      }
      
      const { image, cropX, cropY, cropSize, scale, imageWidth, imageHeight } = cropState.value
      const canvas = cropCanvas.value!
      
      // Calculate source coordinates
      const imageX = (canvas.width - imageWidth) / 2
      const imageY = (canvas.height - imageHeight) / 2
      const srcX = (cropX - imageX) / scale
      const srcY = (cropY - imageY) / scale
      const srcSize = cropSize / scale
      
      // Create final canvas
      const finalCanvas = document.createElement('canvas')
      const finalCtx = finalCanvas.getContext('2d')!
      finalCanvas.width = outputWidth
      finalCanvas.height = outputHeight
      
      // Draw cropped image
      finalCtx.drawImage(
        image,
        srcX, srcY, srcSize, srcSize,
        0, 0, outputWidth, outputHeight
      )
      
      // Convert to blob
      finalCanvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], originalFile.name, {
            type: outputFormat
          })
          resolve(croppedFile)
        } else {
          reject(new Error('Failed to create cropped file'))
        }
      }, outputFormat, quality)
    })
  }

  const reset = () => {
    cropState.value = {
      image: null,
      cropX: 0,
      cropY: 0,
      cropSize: 0,
      isDragging: false,
      isResizing: false,
      resizeHandle: null,
      startX: 0,
      startY: 0,
      startCropX: 0,
      startCropY: 0,
      startCropSize: 0,
      imageWidth: 0,
      imageHeight: 0,
      scale: 1
    }
  }

  return {
    // Refs
    cropCanvas,
    previewCanvas,
    cropState,
    
    // Methods
    loadImage,
    initializeCropper,
    drawCropper,
    updatePreview,
    startCrop,
    updateCrop,
    endCrop,
    resetCrop,
    getCroppedFile,
    reset,
    handleWheel,
    updateCursor
  }
}
