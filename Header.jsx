import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Shield, LogIn } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-4 z-50 mx-4 md:mx-8"
    >
      <div className="glass rounded-2xl px-5 md:px-8 py-3 md:py-4 flex items-center justify-between">
        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          aria-label="เปิดเมนู"
          className="p-2 rounded-xl hover:bg-white/60 active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5 text-neutral-800" />
        </button>

        {/* Brand */}
        <Link to="/" className="group">
          <h1 className="font-display text-xl md:text-2xl font-extrabold tracking-tight">
            <span className="text-neutral-900">Surasith</span>
            <span className="text-accent">.online</span>
          </h1>
        </Link>

        {/* Spacer (keep brand centered) */}
        <div className="w-9 h-9" />
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 p-5"
            >
              <div className="glass h-full rounded-3xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display font-bold text-lg">เมนู</span>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/60"
                    aria-label="ปิดเมนู"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  <MenuItem icon={<Home className="w-4 h-4" />} onClick={() => { navigate('/'); setOpen(false) }}>
                    หน้าแรก
                  </MenuItem>
                  <MenuItem icon={<Shield className="w-4 h-4" />} onClick={() => { navigate('/admin'); setOpen(false) }}>
                    หลังบ้าน (Admin)
                  </MenuItem>
                  <MenuItem icon={<LogIn className="w-4 h-4" />} onClick={() => { navigate('/login'); setOpen(false) }}>
                    เข้าสู่ระบบ
                  </MenuItem>
                </nav>

                <div className="mt-auto pt-6 text-xs text-neutral-500">
                  © {new Date().getFullYear()} Surasith.online
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function MenuItem({ icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                 text-left text-sm font-medium text-neutral-700
                 hover:bg-white/70 hover:text-accent
                 transition-all"
    >
      <span className="text-neutral-500">{icon}</span>
      {children}
    </button>
  )
}
