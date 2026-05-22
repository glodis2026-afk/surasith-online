import { supabase } from './supabaseClient'

/* ============================================================
 *  POSTS API
 * ============================================================ */

export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function fetchPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createPost(payload) {
  const { data, error } = await supabase
    .from('posts')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePost(id, payload) {
  const { data, error } = await supabase
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
  return true
}

/* ============================================================
 *  STORAGE — Image Upload
 * ============================================================ */

const BUCKET = 'post-images'

export async function uploadPostImage(file) {
  if (!file) return null
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
  return data.publicUrl
}

export async function deletePostImage(publicUrl) {
  if (!publicUrl) return
  // extract filename from public URL
  const parts = publicUrl.split(`${BUCKET}/`)
  if (parts.length < 2) return
  const fileName = parts[1]
  await supabase.storage.from(BUCKET).remove([fileName])
}

/* ============================================================
 *  PLATFORM LINKS API
 * ============================================================ */

export async function fetchPlatformLinks() {
  const { data, error } = await supabase
    .from('platform_links')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function upsertPlatformLink(payload) {
  // payload: { platform, url, display_order }
  const { data, error } = await supabase
    .from('platform_links')
    .upsert(payload, { onConflict: 'platform' })
    .select()
    .single()
  if (error) throw error
  return data
}

/* ============================================================
 *  AUTH API
 * ============================================================ */

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}
