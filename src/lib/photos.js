import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase-admin.js'

/** Upload an image to Firebase Storage under `folder/` and return { path, url }. */
export async function uploadPhoto(file, folder) {
  if (!storage) throw new Error('Firebase Storage is not configured (VITE_FIREBASE_STORAGE_BUCKET).')
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const r = ref(storage, path)
  await uploadBytes(r, file, { contentType: file.type, cacheControl: 'public, max-age=31536000' })
  return { path, url: await getDownloadURL(r) }
}

export async function deletePhoto(path) {
  if (!storage || !path) return
  try {
    await deleteObject(ref(storage, path))
  } catch (err) {
    if (err?.code !== 'storage/object-not-found') throw err
  }
}
