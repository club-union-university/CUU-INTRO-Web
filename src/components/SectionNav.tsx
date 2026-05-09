import { motion } from 'framer-motion'
import { SECTIONS, type SectionId } from '@/data/content'
import { cn } from '@/lib/cn'

type Props = {
  active: SectionId
  onJump: (id: SectionId) => void
}

export function SectionNav({ active, onJump }: Props) {
  return (
    <nav className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 md:block">
      <ul className="pointer-events-auto flex flex-col gap-3">
        {SECTIONS.map((s) => {
          const isActive = s.id === active
          return (
            <li key={s.id} className="relative flex items-center justify-end">
              <motion.button
                onClick={() => onJump(s.id)}
                className="group flex items-center gap-3"
                whileHover={{ x: -2 }}
              >
                <span
                  className={cn(
                    'mono text-[10px] tracking-widest text-white/30 transition-opacity',
                    isActive ? 'opacity-100 text-brand-300' : 'opacity-0 group-hover:opacity-60',
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    'block h-1.5 w-1.5 rounded-full transition-all',
                    isActive
                      ? 'h-2 w-6 bg-brand-400 shadow-[0_0_12px_rgba(129,140,248,0.7)]'
                      : 'bg-white/30 group-hover:bg-white/60',
                  )}
                />
              </motion.button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
