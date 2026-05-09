import { useEffect, useRef, useState } from 'react'
import { Hero } from './components/Hero'
import { Section1Problem } from './components/Section1Problem'
import { Section2Service } from './components/Section2Service'
import { Section3Features } from './components/Section3Features'
import { Section4Flow } from './components/Section4Flow'
import { Section5Tech } from './components/Section5Tech'
import { SectionNav } from './components/SectionNav'
import { SECTIONS, type SectionId } from './data/content'

const ALL_IDS: (SectionId | 'hero')[] = ['hero', ...SECTIONS.map((s) => s.id)]

export default function App() {
  const shellRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<SectionId>('problem')

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            const id = e.target.id
            if (SECTIONS.some((s) => s.id === id)) {
              setActive(id as SectionId)
            }
          }
        })
      },
      { root: shell, threshold: [0.55, 0.75] },
    )
    ALL_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function handleJump(id: SectionId) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 px-8 pt-8">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <div className="pointer-events-auto flex items-center gap-3">
            <span className="mono inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-400/50 text-xs font-bold text-brand-300">
              C
            </span>
            <span className="mono text-sm font-semibold tracking-widest text-white/80">
              CREW
            </span>
            <span className="mono text-[10px] uppercase tracking-widest text-white/30">
              · CUU 2026
            </span>
          </div>
          <div className="pointer-events-auto hidden items-center gap-5 text-[11px] uppercase tracking-widest text-white/40 md:flex">
            <span className="mono">경인권 연합동아리 운영 자동화</span>
            <span className="mono text-brand-300/80">PRESENTATION DECK</span>
          </div>
        </div>
      </header>

      <SectionNav active={active} onJump={handleJump} />

      <main ref={shellRef} className="scroll-shell">
        <Hero />
        <Section1Problem />
        <Section2Service />
        <Section3Features />
        <Section4Flow />
        <Section5Tech />
      </main>
    </div>
  )
}
