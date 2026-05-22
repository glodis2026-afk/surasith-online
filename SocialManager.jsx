import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Check, Facebook, Instagram, Youtube } from 'lucide-react'
import { fetchPlatformLinks, upsertPlatformLink } from '../../lib/api'

const PLATFORMS = [
  { key: 'facebook',  label: 'Facebook',  Icon: Facebook,  placeholder: 'https://facebook.com/your-page' },
  { key: 'tiktok',    label: 'TikTok',    Icon: TikTokSvg, placeholder: 'https://tiktok.com/@your-account' },
  { key: 'instagram', label: 'Instagram', Icon: Instagram, placeholder: 'https://instagram.com/your-handle' },
  { key: 'x',         label: 'X (Twitter)', Icon: XSvg,    placeholder: 'https://x.com/your-handle' },
  { key: 'youtube',   label: 'YouTube',   Icon: Youtube,   placeholder: 'https://youtube.com/@your-channel' }
]

function TikTokSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
    </svg>
  )
}
function XSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

export default function SocialManager() {
  const [links, setLinks] = useState({}) // { facebook: 'url', tiktok: 'url', ... }
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState(null)
  const [savedKey, setSavedKey] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPlatformLinks()
      .then((data) => {
        const map = {}
        data.forEach((l) => { map[l.platform] = l.url || '' })
        setLinks(map)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  function setVal(key, val) {
    setLinks((s) => ({ ...s, [key]: val }))
    setSavedKey(null)
  }

  async function save(platform, order) {
    setSavingKey(platform)
    setError(null)
    try {
      await upsertPlatformLink({
        platform,
        url: links[platform] || '',
        display_order: order
      })
      setSavedKey(platform)
      setTimeout(() => setSavedKey(null), 1800)
    } catch (e) {
      setError(`บันทึก ${platform} ไม่สำเร็จ: ${e.message}`)
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-neutral-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-neutral-900">ลิงก์โซเชียลมีเดีย</h2>
        <p className="text-sm text-neutral-500 mt-1">ใส่ลิงก์ของแต่ละแพลตฟอร์ม (ปล่อยว่างเพื่อซ่อนไอคอน)</p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {PLATFORMS.map((p, i) => {
          const Icon = p.Icon
          const isSaving = savingKey === p.key
          const justSaved = savedKey === p.key
          return (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-2xl"
            >
              <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  {p.label}
                </label>
                <input
                  type="url"
                  value={links[p.key] || ''}
                  onChange={(e) => setVal(p.key, e.target.value)}
                  placeholder={p.placeholder}
                  className="w-full mt-1 bg-transparent text-sm outline-none placeholder:text-neutral-300"
                />
              </div>
              <button
                onClick={() => save(p.key, i)}
                disabled={isSaving}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5
                            ${justSaved
                              ? 'bg-green-100 text-green-700'
                              : 'bg-accent text-white hover:bg-accent-hover'}`}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : justSaved ? (
                  <><Check className="w-4 h-4" /> บันทึกแล้ว</>
                ) : (
                  <><Save className="w-4 h-4" /> บันทึก</>
                )}
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
