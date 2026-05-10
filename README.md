# CUU-INTRO-Web

> CUU(Club Union University) — 경인권 연합동아리 운영 자동화 플랫폼의 **발표용 랜딩 페이지**.

본 서비스 레포 3종과 별개로, 시연·홍보·공유용 단일 스크롤 사이트.

## 관련 레포

| 역할 | 레포 | 스택 |
|---|---|---|
| Frontend | [CUU-FRONT-React](https://github.com/club-union-university/CUU-FRONT-React) | React 19 · Vite 6 · TanStack Router/Query · Tailwind + shadcn/ui · Firebase Auth · MSW |
| Backend Core | [CUU-BACK-Spring](https://github.com/club-union-university/CUU-BACK-Spring) | Spring Boot 4 · Java 17 · JPA · Security · JWT · Firebase Admin SDK |
| Backend AI | [CUU-BACK-Ai](https://github.com/club-union-university/CUU-BACK-Ai) | NestJS · Google Gemini · Google Maps Platform |

## 페이지 구성

세로 스크롤 5섹션 (데스크탑은 fullscreen snap, 모바일은 자유 스크롤).

| # | 섹션 | 핵심 메시지 |
|---|---|---|
| 00 | Hero | "한 줄의 자연어로 운영한다" |
| 01 | Problem | 5중 발행 · 정보 비대칭 · 14일 리드타임 |
| 02 | Service | CUU 3-pillar (자연어 / 위저드 / 3중 노출) + 가드레일 |
| 03 | Features | 3-step 행사 생성 위저드, 3중 노출 자동 발행 |
| 04 | Flow | 5-step 파이프라인 + Fan-out (1 입력 → 5 채널) |
| 05 | Tech & API | 3 레포 스택 + 7 도메인 API |

## 스택

- **Build** — Vite 6, React 19, TypeScript 5.7
- **Style** — Tailwind CSS 3 (인디고 다크 토큰, 본 프론트와 동일축)
- **Motion** — Framer Motion 11 (스크롤 진입 애니메이션, Section 4 SVG fan-out)
- **Icons** — Lucide React
- **Font** — Pretendard Variable, JetBrains Mono
- **Diagrams** — Mermaid CLI(PNG) + 직접 빌드한 Excalidraw 씬

## 빠른 실행

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # 정적 SPA → dist/
pnpm typecheck
```

## 디렉토리

```
src/
├── App.tsx                  # 스크롤 셸 + 섹션 IntersectionObserver
├── main.tsx
├── styles.css               # 인디고 토큰 + 스크롤-스냅 + 모바일 미디어 쿼리
├── components/
│   ├── Hero.tsx
│   ├── SectionShell.tsx     # 공통 섹션 래퍼 (반응형 padding/font)
│   ├── SectionNav.tsx       # 우측 도트 네비 (md+ only)
│   ├── Section1Problem.tsx
│   ├── Section2Service.tsx
│   ├── Section3Features.tsx
│   ├── Section4Flow.tsx     # 5-step 파이프라인 + Fan-out
│   └── Section5Tech.tsx     # 레포 카드 + API 도메인 그리드
├── data/content.ts          # 모든 섹션 콘텐츠 단일 소스
└── lib/cn.ts

diagrams/                    # PPT 붙여넣기용 자료
├── architecture.png         # 시스템 아키텍처 / 서버 흐름
├── tech-stack.png           # 3 레포 스택 카드
├── api-spec.png             # Spring 6 도메인 + NestJS /ai
├── *.mmd                    # 위 PNG의 Mermaid 소스
├── *.excalidraw             # 손-빌드한 Excalidraw 씬
├── import-ready/            # frontmatter 제거한 Excalidraw 임포트용 mmd
├── puppeteer-config.json    # mmdc가 시스템 Chrome 쓰게 하는 설정
└── HOW-TO-EXCALIDRAW.md

scripts/
├── build-excalidraw.mjs     # .excalidraw JSON을 element 좌표로 직접 생성
└── mmd-to-excalidraw.mjs    # 실험적 mermaid → excalidraw 변환 (Node 환경 한계로 미완)
```

## 다이어그램 재생성

PNG (시스템 Chrome 필요, macOS 기준 `/Applications/Google Chrome.app`):

```bash
pnpm exec mmdc -i diagrams/architecture.mmd -o diagrams/architecture.png \
  -w 2200 -b transparent -p diagrams/puppeteer-config.json
pnpm exec mmdc -i diagrams/tech-stack.mmd -o diagrams/tech-stack.png \
  -w 2200 -b transparent -p diagrams/puppeteer-config.json
pnpm exec mmdc -i diagrams/api-spec.mmd -o diagrams/api-spec.png \
  -w 2200 -b transparent -p diagrams/puppeteer-config.json
```

Excalidraw 씬:

```bash
node scripts/build-excalidraw.mjs
```

생성된 `.excalidraw` 파일은 https://excalidraw.com 에서 메뉴 → Open으로 임포트.

## 톤 & 매너

- 배경 `#070814` 거의 검정
- 강조 컬러 `#a5b4fc / #818cf8` (인디고 300/400) — 본 프론트의 다크 primary와 동축
- 카드는 1px white/7% 보더 + 살짝 글래스, 클러스터(섹션 그룹)는 dashed 인디고 보더
- 다이어그램 PNG는 transparent 배경 — PPT의 어떤 인디고 셰이드 위에서도 자연스럽게 합쳐짐

## 배포

정적 SPA 빌드 결과물(`dist/`)을 그대로 Vercel · Netlify · GitHub Pages 어디든. 별도 환경변수·서버 의존성 없음.
