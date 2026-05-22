export default function Footer() {
  return (
    <footer className="mt-24 mb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-neutral-700">Surasith</span>
            <span className="text-accent font-semibold">.online</span>
            {' '}— All rights reserved.
          </p>
          <p className="text-xs text-neutral-400 tracking-wider uppercase">
            Crafted with care
          </p>
        </div>
      </div>
    </footer>
  )
}
