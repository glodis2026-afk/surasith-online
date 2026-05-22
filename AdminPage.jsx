import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Share2, LogOut, Home } from 'lucide-react'
import { signOut } from '../lib/api'
import PostsManager from '../components/admin/PostsManager'
import SocialManager from '../components/admin/SocialManager'

export default function AdminPage({ session }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('posts')

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50 relative">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display font-extrabold text-lg">
              <span className="text-neutral-900">Surasith</span>
              <span className="text-accent">.online</span>
            </Link>
            <span className="hidden md:inline text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium tracking-wider uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-neutral-500">
              {session?.user?.email}
            </span>
            <Link to="/" className="btn-ghost">
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">หน้าแรก</span>
            </Link>
            <button onClick={handleLogout} className="btn-ghost text-accent">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="inline-flex gap-1 p-1 bg-white border border-neutral-200 rounded-2xl shadow-sm">
          <TabButton active={tab === 'posts'} onClick={() => setTab('posts')} icon={<FileText className="w-4 h-4" />}>
            จัดการโพสต์
          </TabButton>
          <TabButton active={tab === 'social'} onClick={() => setTab('social')} icon={<Share2 className="w-4 h-4" />}>
            ลิงก์โซเชียล
          </TabButton>
        </div>
      </div>

      {/* Content */}
      <motion.main
        key={tab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto px-6 py-8"
      >
        {tab === 'posts' && <PostsManager />}
        {tab === 'social' && <SocialManager />}
      </motion.main>
    </div>
  )
}

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-neutral-600 hover:text-accent hover:bg-neutral-50'}`}
    >
      {icon}
      {children}
    </button>
  )
}
