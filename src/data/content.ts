export const SECTIONS = [
  { id: 'problem', label: '01 · Problem' },
  { id: 'service', label: '02 · Service' },
  { id: 'features', label: '03 · Features' },
  { id: 'flow', label: '04 · Flow' },
  { id: 'tech', label: '05 · Tech & API' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const PROBLEMS = [
  {
    title: '운영 부담의 5중 발행',
    body: '회장 한 명이 행사 하나 알리려고 행사방 · 동아리 게시판 · 학교 게시판에 같은 글을 5번씩 따로 올린다. 핵심 정보가 빠지거나 일정이 어긋나는 사고가 잦다.',
    metric: '5x',
    metricLabel: '중복 발행',
  },
  {
    title: '연합의 정보 비대칭',
    body: '옆 학교 동아리가 무엇을 하고 있는지 모른다. "같이 하자"는 말이 나올 수 없으니 연합 행사 자체가 시작되지 않는다.',
    metric: '0',
    metricLabel: '발견 채널',
  },
  {
    title: '느린 기획·승인 사이클',
    body: '카톡 단톡 → 노션 정리 → 양쪽 회장 회의 → 다시 정리 → 공지. 한 번 합동 행사 잡는 데 평균 2주가 사라진다.',
    metric: '14d',
    metricLabel: '평균 리드타임',
  },
] as const

export const SERVICE_PILLARS = [
  {
    head: '자연어 한 줄',
    sub: '회장이 평소처럼 말한다',
    sample: '"한양에리카랑 인하대 멋사가 6월 중순에 합동 해커톤"',
  },
  {
    head: '3-step 위저드',
    sub: 'Gemini가 정제한 초안을 회장이 검토만 하면 됨',
    sample: '제목 / 분류 / 일정 / 장소 / 공지글까지 자동 생성',
  },
  {
    head: '3중 노출 발행',
    sub: '승인 1번 → 5개 채널 동시 발행',
    sample: '행사 게시판 + 동아리 ×2 + 학교 ×2',
  },
] as const

export const FEATURES = [
  {
    tag: 'Wizard',
    title: '3-step 행사 생성 위저드',
    desc: 'Step 1 자연어 → 기본 정보 / Step 2 카테고리 + 공지글 + Maps 장소 자동 / Step 3 양 동아리 승인. 각 Step은 좌측 폼 + 우측 미리보기, 즉시 편집 가능, "다시 생성" 토글.',
    bullets: [
      '입력에 없는 정보는 추측 금지 (가드레일)',
      'Step 2 결과는 Firestore 캐싱 → 재호출 절감',
      '비대칭 승인 흐름 (A 신청 → B 수락 = 끝)',
    ],
  },
  {
    tag: 'Distribution',
    title: '3중 노출 자동 발행',
    desc: '승인되는 순간 행사 전용 게시판이 생성되고, 양쪽 동아리 게시판과 양쪽 학교 게시판에 카드가 동시에 박힌다. "수도권 결속"의 트리거 — 다른 동아리가 무엇을 하는지 자동으로 가시화.',
    bullets: [
      '행사 게시판: 공지 / 일정 / 팀빌딩 / Q&A / 자료실',
      '동아리·학교 게시판은 "노출 슬롯"으로만 구현 (P0 스코프 폭발 방지)',
      '1입력 → 5채널 발행 = 회장 운영 부담을 0으로',
    ],
  },
] as const

export const FLOW_STEPS = [
  {
    n: '01',
    title: '회장의 자연어 입력',
    body: '"6월 중순 합동 해커톤 24시간 송도에서"',
    actor: '한양에리카 멋사 회장',
  },
  {
    n: '02',
    title: 'Step 1 — Gemini 정제',
    body: '제목 / 분류 / 내용 / 형태 자동 채움',
    actor: 'AI Server (NestJS + Gemini)',
  },
  {
    n: '03',
    title: 'Step 2 — 카테고리 + 공지글 + 장소',
    body: 'Maps Distance Matrix + Places로 양 학교 중간지점 추천',
    actor: 'AI + Google Maps',
  },
  {
    n: '04',
    title: 'Step 3 — 양 동아리 승인',
    body: 'A 신청 → B에게 알림 → B 수락 = 즉시 생성',
    actor: '인하대 멋사 회장',
  },
  {
    n: '05',
    title: '5채널 동시 발행',
    body: '행사방 / 동아리 ×2 / 학교 ×2 자동 노출',
    actor: 'Spring Backend',
  },
] as const

export const PUBLISH_TARGETS = [
  { id: 'event', label: '행사 전용 게시판', detail: '공지 + 일정 + 팀빌딩 + Q&A + 자료실' },
  { id: 'clubA', label: '한양에리카 멋사', detail: '동아리 게시판 — 진행 중 합동 행사 카드' },
  { id: 'clubB', label: '인하대 멋사', detail: '동아리 게시판 — 진행 중 합동 행사 카드' },
  { id: 'schoolA', label: '한양에리카', detail: '학교 게시판 — 우리 학교 연합 행사 카드' },
  { id: 'schoolB', label: '인하대', detail: '학교 게시판 — 우리 학교 연합 행사 카드' },
] as const

export const REPOS = [
  {
    id: 'front',
    name: 'CUU-FRONT-React',
    role: 'Frontend',
    href: 'https://github.com/club-union-university/CUU-FRONT-React',
    stack: [
      'React 19',
      'TypeScript',
      'Vite 6',
      'TanStack Router',
      'TanStack Query',
      'Tailwind + shadcn/ui',
      'Zustand',
      'react-hook-form + zod',
      'Firebase Auth',
      'MSW',
    ],
  },
  {
    id: 'spring',
    name: 'CUU-BACK-Spring',
    role: 'Backend (Core)',
    href: 'https://github.com/club-union-university/CUU-BACK-Spring',
    stack: [
      'Spring Boot 4.0.6',
      'Java 17',
      'Spring Data JPA',
      'Spring Security',
      'JWT (jjwt)',
      'H2 / Postgres',
      'Firebase Admin SDK',
      'Lombok',
      'Gradle + Railway',
    ],
  },
  {
    id: 'ai',
    name: 'CUU-BACK-Ai',
    role: 'Backend (AI)',
    href: 'https://github.com/club-union-university/CUU-BACK-Ai',
    stack: [
      'NestJS',
      'TypeScript',
      'Gemini API',
      'Google Maps Platform',
      'Distance Matrix + Places',
      'Mock Store (dev)',
    ],
  },
] as const

export const API_DOMAINS = [
  {
    domain: 'auth',
    server: 'Spring',
    endpoints: [
      'POST /auth/signup',
      'POST /auth/login',
      'POST /auth/firebase-verify',
      'POST /auth/refresh',
    ],
  },
  {
    domain: 'club',
    server: 'Spring',
    endpoints: [
      'POST /clubs (등록 신청)',
      'GET /clubs?status=pending',
      'POST /clubs/{id}/approve',
      'POST /clubs/{id}/join',
    ],
  },
  {
    domain: 'event',
    server: 'Spring',
    endpoints: [
      'POST /events/draft',
      'POST /events/{id}/partner-respond',
      'GET /events?status=approved',
      'POST /events/{id}/participants/apply',
    ],
  },
  {
    domain: 'post',
    server: 'Spring',
    endpoints: [
      'GET /boards/{type}/{id}/posts',
      'POST /posts',
      'POST /posts/{id}/comments',
      'GET /posts/{id}',
    ],
  },
  {
    domain: 'school',
    server: 'Spring',
    endpoints: [
      'GET /schools',
      'GET /schools/{id}',
      'GET /schools/{id}/facilities',
    ],
  },
  {
    domain: 'notification',
    server: 'Spring',
    endpoints: [
      'GET /notifications',
      'POST /notifications/{id}/read',
    ],
  },
  {
    domain: 'ai',
    server: 'NestJS',
    endpoints: [
      'POST /ai/event/step1 — 자연어 정제',
      'POST /ai/event/step2 — 카테고리+공지+장소',
      'POST /ai/post/categorize',
    ],
  },
] as const
