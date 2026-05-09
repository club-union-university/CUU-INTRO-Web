import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section id="hero" className="snap-section grid-bg">
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col justify-center px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span className="chip">CUU · Crew</span>
          <h1 className="mt-8 text-6xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            경인권 연합동아리,<br />
            <span className="brand-text">한 줄의 자연어</span>로 운영한다.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
            회장이 평소처럼 한 문장 던지면, 행사가 만들어지고 5개 채널에 동시 발행된다.
            정보 비대칭과 운영 부담을 동시에 푸는 연합동아리 자동화 플랫폼.
          </p>
          <div className="mt-12 flex items-center gap-6 text-xs text-white/40">
            <span className="mono tracking-widest">SCROLL TO START</span>
            <motion.span
              className="h-px w-16 bg-white/40"
              animate={{ scaleX: [0.3, 1, 0.3], originX: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
