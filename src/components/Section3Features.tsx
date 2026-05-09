import { motion } from 'framer-motion'
import { FEATURES } from '@/data/content'
import { SectionShell } from './SectionShell'

export function Section3Features() {
  return (
    <SectionShell
      id="features"
      index="03"
      eyebrow="CORE FEATURES"
      title={
        <>
          위저드, 그리고 <span className="brand-text">다중 노출 발행</span>.
        </>
      }
    >
      <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        {FEATURES.map((f, i) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="card group relative flex flex-col overflow-hidden rounded-2xl p-7"
          >
            <div className="flex items-center justify-between">
              <span className="chip">{f.tag}</span>
              <span className="mono text-[10px] tracking-widest text-white/30">
                {String(i + 1).padStart(2, '0')} / 02
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{f.desc}</p>
            <ul className="mt-5 space-y-2 text-[13px] text-white/70">
              {f.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.article>
        ))}
      </div>
    </SectionShell>
  )
}
