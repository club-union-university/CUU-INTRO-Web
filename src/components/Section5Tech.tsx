import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { API_DOMAINS, REPOS } from '@/data/content'
import { SectionShell } from './SectionShell'

export function Section5Tech() {
  return (
    <SectionShell
      id="tech"
      index="05"
      eyebrow="TECH STACK & API"
      title={
        <>
          3개의 레포, <span className="brand-text">7개 도메인 API</span>.
        </>
      }
    >
      <div className="grid h-full grid-cols-1 gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col gap-4">
          {REPOS.map((r, i) => (
            <motion.a
              key={r.id}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card group flex items-start justify-between gap-4 rounded-2xl p-5 transition-colors hover:border-brand-400/40"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="chip">{r.role}</span>
                  <span className="mono text-[10px] uppercase tracking-widest text-white/30">
                    {String(i + 1).padStart(2, '0')} / {String(REPOS.length).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mono mt-3 text-lg font-semibold tracking-tight text-white">
                  {r.name}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {r.stack.map((s) => (
                    <li
                      key={s}
                      className="mono rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/70"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <ArrowUpRight
                size={18}
                className="mt-1 text-white/30 transition-colors group-hover:text-brand-300"
              />
            </motion.a>
          ))}
        </div>

        <div className="card flex flex-col rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="mono text-[10px] uppercase tracking-widest text-white/40">
              API Domains
            </span>
            <span className="mono text-[10px] uppercase tracking-widest text-white/30">
              {API_DOMAINS.length} domains · ~30 endpoints
            </span>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-2 overflow-hidden md:grid-cols-2">
            {API_DOMAINS.map((d, i) => (
              <motion.div
                key={d.domain}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="mono text-sm font-semibold text-brand-300">/{d.domain}</span>
                  <span className="mono text-[10px] uppercase tracking-widest text-white/40">
                    {d.server}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {d.endpoints.map((e) => (
                    <li
                      key={e}
                      className="mono truncate text-[11px] leading-relaxed text-white/55"
                      title={e}
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
