import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  children: ReactNode
  className?: string
}

export function SectionShell({ id, index, eyebrow, title, children, className }: Props) {
  return (
    <section id={id} className={cn('snap-section grid-bg', className)}>
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-10"
        >
          <div className="flex items-center gap-3">
            <span className="mono text-xs tracking-[0.3em] text-brand-300/80">{index}</span>
            <span className="h-px w-12 bg-brand-400/40" />
            <span className="mono text-xs tracking-[0.3em] text-white/50">{eyebrow}</span>
          </div>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {title}
          </h2>
        </motion.div>
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </section>
  )
}
