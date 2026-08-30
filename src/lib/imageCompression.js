/**
 * Compresses an image file client-side before upload — resizes to a sane max
 * dimension and re-encodes as JPEG. This matters a lot on Supabase's free
 * tier, where storage and bandwidth are capped — an uncompressed 8-15MB
 * phone photo burns through that quota fast with zero visible benefit,
 * since no web page ever needs more than ~2000px on the long edge anyway.
 *
 * Skips compression for files already reasonably small, so an already
 * web-sized image doesn't get needlessly re-encoded for no benefit.
 */
const MAX_DIMENSION = 2000
const JPEG_QUALITY = 0.82
const SKIP_THRESHOLD_BYTES = 350 * 1024 // ~350KB

export async function compressImage(file) {
  if (!file.type.startsWith('image/')) return file
  if (file.size <= SKIP_THRESHOLD_BYTES) return file

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })

    let { width, height } = bitmap
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / Math.max(width, height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    )

    // If encoding failed, or the "compressed" version is somehow bigger
    // (rare, but possible for already-optimized images), keep the original.
    if (!blob || blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
      type: 'image/jpeg',
    })
  } catch (err) {
    // Any failure here (unsupported format, corrupt file, etc.) should never
    // block the upload — just fall back to the original file.
    console.error('Image compression failed, using original file:', err)
    return file
  }
}