import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Upload, Loader2, ExternalLink, ImageIcon } from 'lucide-react'
import {
  fetchPosts, createPost, updatePost, deletePost,
  uploadPostImage, deletePostImage
} from '../../lib/api'

const EMPTY_FORM = { title: '', content: '', external_link: '', image_url: '' }

export default function PostsManager() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null) // post object or null
  const [form, setForm] = useState(EMPTY_FORM)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await fetchPosts()
      setPosts(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }
  function openEdit(post) {
    setEditing(post)
    setForm({
      title: post.title || '',
      content: post.content || '',
      external_link: post.external_link || '',
      image_url: post.image_url || ''
    })
    setShowForm(true)
  }
  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setError(null)
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadPostImage(file)
      setForm((f) => ({ ...f, image_url: url }))
    } catch (err) {
      setError('อัปโหลดรูปไม่สำเร็จ: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        external_link: form.external_link.trim() || null,
        image_url: form.image_url || null
      }
      if (editing) {
        await updatePost(editing.id, payload)
      } else {
        await createPost(payload)
      }
      closeForm()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(post) {
    if (!confirm(`ต้องการลบโพสต์ "${post.title}" ใช่ไหม?`)) return
    try {
      await deletePost(post.id)
      if (post.image_url) await deletePostImage(post.image_url).catch(() => {})
      load()
    } catch (err) {
      alert('ลบไม่สำเร็จ: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-neutral-900">จัดการโพสต์</h2>
          <p className="text-sm text-neutral-500 mt-1">เพิ่ม แก้ไข หรือลบโพสต์บนหน้าเว็บ</p>
        </div>
        <button onClick={openNew} className="btn-accent">
          <Plus className="w-4 h-4" /> เพิ่มโพสต์ใหม่
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
          <p className="text-neutral-400 text-sm">ยังไม่มีโพสต์ — เริ่มสร้างโพสต์แรกของคุณ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-2xl hover:shadow-soft transition-all"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                {post.image_url ? (
                  <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 truncate">{post.title}</h3>
                <p className="text-sm text-neutral-500 line-clamp-1 mt-0.5">{post.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                  <span>{new Date(post.created_at).toLocaleDateString('th-TH')}</span>
                  {post.external_link && (
                    <a href={post.external_link} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-accent hover:underline">
                      <ExternalLink className="w-3 h-3" /> ลิงก์ภายนอก
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(post)}
                  className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
                  aria-label="แก้ไข"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                  aria-label="ลบ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeForm}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <form
                onSubmit={handleSubmit}
                className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                  <h3 className="font-display font-bold text-lg">
                    {editing ? 'แก้ไขโพสต์' : 'เพิ่มโพสต์ใหม่'}
                  </h3>
                  <button type="button" onClick={closeForm}
                          className="p-2 rounded-lg hover:bg-neutral-100">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <Field label="ชื่อเรื่อง (Title)" required>
                    <input
                      className="input-base"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="หัวข้อของโพสต์"
                    />
                  </Field>

                  <Field label="เนื้อหา (Content)">
                    <textarea
                      rows={5}
                      className="input-base resize-none"
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="เขียนเนื้อหาของโพสต์..."
                    />
                  </Field>

                  <Field label="ลิงก์ภายนอก (External Link)">
                    <input
                      type="url"
                      className="input-base"
                      value={form.external_link}
                      onChange={(e) => setForm({ ...form, external_link: e.target.value })}
                      placeholder="https://..."
                    />
                  </Field>

                  <Field label="รูปภาพหน้าปก">
                    <div className="flex items-start gap-4">
                      {form.image_url ? (
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-neutral-100">
                          <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, image_url: '' })}
                            className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-32 h-32 border-2 border-dashed border-neutral-200 rounded-xl
                                          flex flex-col items-center justify-center gap-2
                                          cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                          {uploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-accent" />
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-neutral-400" />
                              <span className="text-xs text-neutral-500">อัปโหลด</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFile}
                            disabled={uploading}
                          />
                        </label>
                      )}
                      <div className="text-xs text-neutral-500 flex-1">
                        <p>ไฟล์จะถูกบันทึกใน Supabase Storage</p>
                        <p className="mt-1">bucket: <code className="px-1.5 py-0.5 bg-neutral-100 rounded">post-images</code></p>
                      </div>
                    </div>
                  </Field>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-6 py-4 flex items-center justify-end gap-2 rounded-b-3xl">
                  <button type="button" onClick={closeForm} className="btn-ghost">
                    ยกเลิก
                  </button>
                  <button type="submit" disabled={submitting} className="btn-accent disabled:opacity-60">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing ? 'บันทึก' : 'สร้างโพสต์')}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700 mb-1.5 inline-block">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  )
}
