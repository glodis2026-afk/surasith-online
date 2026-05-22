import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import SocialSection from '../components/SocialSection'
import PostCard from '../components/PostCard'
import Footer from '../components/Footer'
import { fetchPosts } from '../lib/api'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <Header />

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-6 text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-widest uppercase mb-6">
            Welcome
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
            เรื่องราว <span className="text-accent">คัดสรร</span><br />
            ที่คุณไม่ควรพลาด
          </h2>
          <p className="mt-6 text-neutral-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            บทความ บทวิเคราะห์ และอัปเดตล่าสุด รวบรวมมาเพื่อคุณ
            ในแบบที่อ่านง่าย เข้าใจไว และเชื่อถือได้
          </p>
        </motion.section>

        {/* Social */}
        <SocialSection />

        {/* Posts */}
        <main className="max-w-6xl mx-auto px-6 mt-16 md:mt-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-neutral-900">
                บทความทั้งหมด
              </h3>
              <p className="text-sm text-neutral-500 mt-1">
                {loading ? 'กำลังโหลด...' : `${posts.length} โพสต์`}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-0.5 bg-accent" />
            </div>
          </div>

          {error && (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm">
              เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
              <br />
              <span className="text-xs opacity-75">
                ตรวจสอบว่าได้ตั้งค่า .env และสร้างตาราง posts ใน Supabase แล้วหรือยัง
              </span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl bg-neutral-100 animate-pulse h-80" />
              ))}
            </div>
          ) : posts.length === 0 && !error ? (
            <div className="text-center py-20 text-neutral-400">
              <p className="text-sm">ยังไม่มีโพสต์ในขณะนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}
