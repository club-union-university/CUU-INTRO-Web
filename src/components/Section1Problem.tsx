import { motion } from 'framer-motion'
import { PROBLEMS } from '@/data/content'
import { SectionShell } from './SectionShell'

export function Section1Problem() {
  return (
    <SectionShell
      id="problem"
      index="01"
      eyebrow="PROBLEM DEFINITION"
      title={
        <>
          연합동아리 운영은 <span className="brand-text">5번 같은 일을</span> 반복한다.
        </>
      }
    >
      <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="card flex flex-col justify-between rounded-2xl p-8"
          >
            <div>
              <div className="flex items-baseline gap-3">
                <span className="mono text-5xl font-bold brand-text">{p.metric}</span>
                <span className="mono text-xs uppercase tracking-widest text-white/40">
                  {p.metricLabel}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{p.body}</p>
            </div>
            <div className="mt-10 flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/30">
              <span className="mono">PAIN POINT</span>
              <span className="mono">·</span>
              <span className="mono">{String(i + 1).padStart(2, '0')} / 03</span>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  )
}
