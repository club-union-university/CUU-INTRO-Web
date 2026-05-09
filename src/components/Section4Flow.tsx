import { motion } from 'framer-motion'
import { FLOW_STEPS, PUBLISH_TARGETS } from '@/data/content'
import { SectionShell } from './SectionShell'

export function Section4Flow() {
  return (
    <SectionShell
      id="flow"
      index="04"
      eyebrow="SERVICE FLOW"
      title={
        <>
          1번의 입력이 <span className="brand-text">5개 채널</span>로 흩어지는 순간.
        </>
      }
    >
      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="card flex flex-col rounded-2xl p-6">
          <div className="mono mb-4 text-[10px] uppercase tracking-widest text-white/40">
            Pipeline · 5 steps
          </div>
          <ol className="relative flex flex-1 flex-col">
            <span className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-brand-400/60 via-white/10 to-transparent" />
            {FLOW_STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative flex gap-5 py-3"
              >
                <span className="z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-400/50 bg-ink-950 text-[11px] font-semibold text-brand-300 shadow-[0_0_12px_rgba(129,140,248,0.4)]">
                  {s.n}
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-base font-semibold tracking-tight">{s.title}</h4>
                    <span className="mono text-[10px] uppercase tracking-widest text-white/30">
                      {s.actor}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <PublishFanout />
      </div>
    </SectionShell>
  )
}

function PublishFanout() {
  return (
    <div className="card relative flex flex-col rounded-2xl p-6">
      <div className="mono mb-4 text-[10px] uppercase tracking-widest text-white/40">
        Fan-out · 1 input → 5 channels
      </div>
      <div className="relative flex-1">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="absolute left-1/2 top-6 -translate-x-1/2"
        >
          <div className="relative">
            <div className="brand-glow rounded-2xl bg-ink-900/80 px-5 py-3">
              <div className="mono text-[10px] uppercase tracking-widest text-brand-300/80">
                approval
              </div>
              <div className="mt-1 text-sm font-semibold">행사 승인 1회</div>
            </div>
          </div>
        </motion.div>

        <svg
          viewBox="0 0 480 280"
          className="absolute inset-x-0 top-[68px] mx-auto h-[160px] w-full"
          fill="none"
        >
          {[
            'M240 0 C 240 60, 60 80, 60 200',
            'M240 0 C 240 60, 160 90, 160 200',
            'M240 0 C 240 100, 240 150, 240 200',
            'M240 0 C 240 60, 320 90, 320 200',
            'M240 0 C 240 60, 420 80, 420 200',
          ].map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="url(#brandStroke)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ amount: 0.4 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
            />
          ))}
          <defs>
            <linearGradient id="brandStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-x-0 bottom-0 grid grid-cols-5 gap-2 px-1">
          {PUBLISH_TARGETS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ amount: 0.4 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.45 }}
              className="card flex flex-col rounded-xl p-2.5"
            >
              <span className="mono text-[9px] uppercase tracking-widest text-brand-300/80">
                ch {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-1 text-[12px] font-semibold leading-tight">{t.label}</span>
              <span className="mt-1 text-[10px] leading-snug text-white/50">{t.detail}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
