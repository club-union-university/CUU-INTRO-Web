import { motion } from 'framer-motion'
import { SERVICE_PILLARS } from '@/data/content'
import { SectionShell } from './SectionShell'

export function Section2Service() {
  return (
    <SectionShell
      id="service"
      index="02"
      eyebrow="SERVICE"
      title={
        <>
          <span className="brand-text">CUU</span> — 자연어 한 줄에서 5채널 발행까지.
        </>
      }
    >
      <div className="flex h-full flex-col gap-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-lg leading-relaxed text-white/60"
        >
          회장이 단톡에 던지듯 한 문장을 입력하면 Gemini가 행사 초안을 만들고,
          Maps가 양 학교 중간 지점을 추천하고, 양 동아리 회장 승인 한 번으로
          행사방·동아리·학교 게시판이 동시에 발행된다.
          <span className="text-white"> 자연어 → 위저드 → 다중 노출 → 통합 UI</span>의 4단 자동화.
        </motion.p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVICE_PILLARS.map((p, i) => (
            <motion.div
              key={p.head}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              className="card relative overflow-hidden rounded-2xl p-6"
            >
              <span className="mono absolute right-5 top-5 text-[10px] tracking-widest text-white/30">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="mt-4 text-xs uppercase tracking-widest text-brand-300/80">
                {p.sub}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.head}</h3>
              <div className="mt-4 h-px w-8 bg-brand-400/40" />
              <p className="mono mt-4 text-[11px] leading-relaxed text-white/50">{p.sample}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.4 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="card mt-auto rounded-2xl p-6"
        >
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest text-white/40">
            <span className="mono text-brand-300">SCOPE GUARDRAIL</span>
            <span>·</span>
            <span>학교/동아리 게시판은 노출 슬롯으로만 구현</span>
            <span>·</span>
            <span>모바일 반응형 / 일반 글 기능은 v2 로드맵</span>
            <span>·</span>
            <span>양방향 협의 흐름은 P2</span>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
