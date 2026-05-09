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
      <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 sm:py-14 md:flex md:h-full md:flex-col md:px-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-7 md:mb-10"
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="mono text-[10px] tracking-[0.3em] text-brand-300/80 sm:text-xs">{index}</span>
            <span className="h-px w-8 bg-brand-400/40 sm:w-12" />
            <span className="mono text-[10px] tracking-[0.3em] text-white/50 sm:text-xs">{eyebrow}</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h2>
        </motion.div>
        <div className="md:flex-1 md:min-h-0">{children}</div>
      </div>
    </section>
  )
}
