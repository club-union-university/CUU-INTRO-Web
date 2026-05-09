import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section id="hero" className="snap-section grid-bg">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24 md:flex md:h-full md:flex-col md:justify-center md:px-12 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span className="chip">CUU</span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl">
            경인권 연합동아리,<br />
            <span className="brand-text">한 줄의 자연어</span>로 운영한다.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:mt-8 sm:text-lg">
            회장이 평소처럼 한 문장 던지면, 행사가 만들어지고 5개 채널에 동시 발행된다.
            정보 비대칭과 운영 부담을 동시에 푸는 연합동아리 자동화 플랫폼.
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs text-white/40 sm:mt-12 sm:gap-6">
            <span className="mono tracking-widest">SCROLL TO START</span>
            <motion.span
              className="h-px w-12 bg-white/40 sm:w-16"
              animate={{ scaleX: [0.3, 1, 0.3], originX: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
