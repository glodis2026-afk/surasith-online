import { motion } from 'framer-motion'
import { ExternalLink, ImageIcon } from 'lucide-react'

export default function PostCard({ post, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl
                 bg-white/70 backdrop-blur-xl border border-white/60
                 shadow-soft hover:shadow-glass transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
        {/* subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3">
        <h3 className="font-display text-lg md:text-xl font-bold text-neutral-900 leading-snug line-clamp-2">
          {post.title}
        </h3>
        {post.content && (
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        )}

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-neutral-100">
          <time className="text-xs text-neutral-400">
            {post.created_at ? new Date(post.created_at).toLocaleDateString('th-TH', {
              year: 'numeric', month: 'short', day: 'numeric'
            }) : ''}
          </time>

          {post.external_link && (
            <a
              href={post.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent !py-1.5 !px-4 !text-xs"
            >
              อ่านต่อ
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
