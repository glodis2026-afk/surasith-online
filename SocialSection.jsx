import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import { fetchPlatformLinks } from '../lib/api'

/* TikTok and X (Twitter) — using lucide-react custom SVGs since they're not standard */
function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
    </svg>
  )
}
function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

const ICON_MAP = {
  facebook: { Icon: Facebook, label: 'Facebook', color: 'hover:text-[#1877F2]' },
  tiktok: { Icon: TikTokIcon, label: 'TikTok', color: 'hover:text-black' },
  instagram: { Icon: Instagram, label: 'Instagram', color: 'hover:text-[#E4405F]' },
  x: { Icon: XIcon, label: 'X', color: 'hover:text-black' },
  twitter: { Icon: XIcon, label: 'X', color: 'hover:text-black' },
  youtube: { Icon: Youtube, label: 'YouTube', color: 'hover:text-[#FF0000]' }
}

export default function SocialSection() {
  const [links, setLinks] = useState([])

  useEffect(() => {
    fetchPlatformLinks()
      .then(setLinks)
      .catch((e) => console.error('Load platform_links failed:', e.message))
  }, [])

  const visible = links.filter((l) => l.url && l.url.trim() !== '')

  if (visible.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="max-w-5xl mx-auto px-6 mt-8 md:mt-12"
    >
      <div className="glass rounded-2xl px-6 py-4 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
        <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mr-2">
          Follow
        </span>
        {visible.map((link, idx) => {
          const meta = ICON_MAP[link.platform?.toLowerCase()]
          if (!meta) return null
          const { Icon, label, color } = meta
          return (
            <motion.a
              key={link.id || link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              className={`w-10 h-10 flex items-center justify-center rounded-full
                          bg-white/70 border border-white/60 text-neutral-700
                          shadow-sm transition-colors ${color}`}
            >
              <Icon className="w-4 h-4" />
            </motion.a>
          )
        })}
      </div>
    </motion.section>
  )
}
