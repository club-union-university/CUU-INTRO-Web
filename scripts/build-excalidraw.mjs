#!/usr/bin/env node
/**
 * Hand-build .excalidraw scenes for the CUU presentation.
 * No mermaid runtime — pure element JSON written with explicit coords.
 *
 * Output:
 *   diagrams/architecture.excalidraw
 *   diagrams/tech-stack.excalidraw
 *   diagrams/api-spec.excalidraw
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const PALETTE = {
  bg: 'transparent',
  nodeFill: '#3730a3',
  nodeFillExt: '#1e1b4b',
  nodeStroke: '#c7d2fe',
  textColor: '#ffffff',
  edge: '#c7d2fe',
  cluster: 'transparent',
  clusterStroke: '#a5b4fc',
}

const FONT_HELVETICA = 2

const rid = () => crypto.randomBytes(10).toString('hex')
const rseed = () => Math.floor(Math.random() * 2 ** 31)

function baseProps() {
  return {
    angle: 0,
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    isDeleted: false,
    seed: rseed(),
    version: 1,
    versionNonce: rseed(),
    customData: null,
  }
}

function rect({ x, y, w, h, kind = 'node' }) {
  const fill =
    kind === 'cluster'
      ? PALETTE.cluster
      : kind === 'ext'
        ? PALETTE.nodeFillExt
        : PALETTE.nodeFill
  const stroke = kind === 'cluster' ? PALETTE.clusterStroke : PALETTE.nodeStroke
  const dashed = kind === 'cluster' || kind === 'ext'
  return {
    id: rid(),
    type: 'rectangle',
    x,
    y,
    width: w,
    height: h,
    strokeColor: stroke,
    backgroundColor: fill,
    fillStyle: 'solid',
    roundness: { type: 3 },
    ...baseProps(),
    strokeStyle: dashed ? 'dashed' : 'solid',
  }
}

function text({
  x,
  y,
  w,
  h,
  content,
  fontSize = 16,
  containerId = null,
  color = PALETTE.textColor,
  align = 'center',
}) {
  return {
    id: rid(),
    type: 'text',
    x,
    y,
    width: w,
    height: h,
    text: content,
    originalText: content,
    fontSize,
    fontFamily: FONT_HELVETICA,
    textAlign: align,
    verticalAlign: 'middle',
    baseline: Math.round(fontSize * 0.92),
    lineHeight: 1.25,
    containerId,
    strokeColor: color,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    roundness: null,
    ...baseProps(),
  }
}

function bindText(container, t) {
  container.boundElements.push({ id: t.id, type: 'text' })
}

function rectWithText({ x, y, w, h, content, kind = 'node', fontSize = 16, padding = 12 }) {
  const r = rect({ x, y, w, h, kind })
  const lines = content.split('\n')
  const lineH = fontSize * 1.25
  const blockH = lines.length * lineH
  const t = text({
    x: x + padding,
    y: y + (h - blockH) / 2,
    w: w - padding * 2,
    h: blockH,
    content,
    fontSize,
    containerId: r.id,
  })
  bindText(r, t)
  return [r, t]
}

function arrow({ from, to, label, dashed = false }) {
  const fx = from.x + from.width / 2
  const fy = from.y + from.height / 2
  const tx = to.x + to.width / 2
  const ty = to.y + to.height / 2
  const a = {
    id: rid(),
    type: 'arrow',
    x: fx,
    y: fy,
    width: tx - fx,
    height: ty - fy,
    strokeColor: PALETTE.edge,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    roundness: { type: 2 },
    points: [[0, 0], [tx - fx, ty - fy]],
    lastCommittedPoint: null,
    startBinding: { elementId: from.id, focus: 0, gap: 6 },
    endBinding: { elementId: to.id, focus: 0, gap: 6 },
    startArrowhead: null,
    endArrowhead: 'arrow',
    elbowed: false,
    ...baseProps(),
    strokeStyle: dashed ? 'dashed' : 'solid',
  }
  from.boundElements.push({ id: a.id, type: 'arrow' })
  to.boundElements.push({ id: a.id, type: 'arrow' })

  const out = [a]
  if (label) {
    const fontSize = 13
    const w = label.length * fontSize * 0.7 + 16
    const h = fontSize * 1.6
    const cx = (fx + tx) / 2
    const cy = (fy + ty) / 2
    const t = text({
      x: cx - w / 2,
      y: cy - h / 2,
      w,
      h,
      content: label,
      fontSize,
      color: PALETTE.textColor,
      containerId: a.id,
    })
    a.boundElements.push({ id: t.id, type: 'text' })
    out.push(t)
  }
  return out
}

function clusterTitle({ x, y, content }) {
  return text({
    x: x + 16,
    y: y + 12,
    w: content.length * 14,
    h: 24,
    content,
    fontSize: 16,
    color: PALETTE.clusterStroke,
    align: 'left',
  })
}

function scene(elements) {
  return {
    type: 'excalidraw',
    version: 2,
    source: 'cuu-intro-web · build-excalidraw',
    elements,
    appState: { viewBackgroundColor: PALETTE.bg, gridSize: null, theme: 'dark' },
    files: {},
  }
}

// ───────────────────────────────────────────────────────────────────
// 1. Tech Stack — 3 cards horizontal
// ───────────────────────────────────────────────────────────────────
function buildTechStack() {
  const els = []
  const cards = [
    {
      content:
        'Frontend · CUU-FRONT-React\n\nReact 19\nTypeScript 5.7\nVite 6\nTanStack Router · Query\nTailwind CSS · shadcn/ui\nZustand · Zod · React Hook Form\nFirebase Auth (Client SDK)\nMSW · Vercel',
    },
    {
      content:
        'Backend Core · CUU-BACK-Spring\n\nSpring Boot 4.0.6\nJava 17\nSpring Data JPA\nSpring Security\nJWT (jjwt 0.11)\nH2 / Postgres\nFirebase Admin SDK 9\nLombok\nGradle · Railway · Docker',
    },
    {
      content:
        'Backend AI · CUU-BACK-Ai\n\nNestJS\nTypeScript\nGoogle Gemini API\nGoogle Maps Platform\nDistance Matrix · Places\nMock Store (dev)',
    },
  ]
  const w = 380
  const h = 460
  const gap = 120
  const startX = 60
  const startY = 60
  const rects = []
  for (let i = 0; i < cards.length; i++) {
    const x = startX + i * (w + gap)
    const [r, t] = rectWithText({ x, y: startY, w, h, content: cards[i].content, fontSize: 16 })
    rects.push(r)
    els.push(r, t)
  }
  els.push(...arrow({ from: rects[0], to: rects[1], label: 'REST + JWT', dashed: true }))
  els.push(...arrow({ from: rects[1], to: rects[2], label: 'HTTP JSON', dashed: true }))
  return scene(els)
}

// ───────────────────────────────────────────────────────────────────
// 2. API Spec — Spring (6 cards 2x3) + Nest (1 card)
// ───────────────────────────────────────────────────────────────────
function buildApiSpec() {
  const els = []
  const springX = 60
  const springY = 60
  const springW = 1280
  const springH = 720
  const springCluster = rect({ x: springX, y: springY, w: springW, h: springH, kind: 'cluster' })
  els.push(springCluster, clusterTitle({ x: springX, y: springY, content: 'Spring Backend · Core API' }))

  const cards = [
    { title: '/auth', body: 'POST /signup\nPOST /login\nPOST /firebase-verify\nPOST /refresh' },
    {
      title: '/clubs',
      body: 'POST /  ·  등록 신청\nGET /?status=pending\nPOST /{id}/approve\nPOST /{id}/join',
    },
    {
      title: '/events',
      body:
        'POST /draft\nPOST /{id}/partner-respond\nGET /?status=approved\nPOST /{id}/participants/apply',
    },
    {
      title: '/posts · /boards',
      body:
        'GET /boards/{type}/{id}/posts\nPOST /posts\nPOST /posts/{id}/comments\nGET /posts/{id}',
    },
    { title: '/schools', body: 'GET /\nGET /{id}\nGET /{id}/facilities' },
    { title: '/notifications', body: 'GET /\nPOST /{id}/read' },
  ]
  const cw = 380
  const ch = 290
  const cgapX = 40
  const cgapY = 40
  const innerStartX = springX + 30
  const innerStartY = springY + 60
  for (let i = 0; i < cards.length; i++) {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = innerStartX + col * (cw + cgapX)
    const y = innerStartY + row * (ch + cgapY)

    const r = rect({ x, y, w: cw, h: ch, kind: 'node' })
    els.push(r)
    const titleT = text({
      x: x + 12,
      y: y + 16,
      w: cw - 24,
      h: 32,
      content: cards[i].title,
      fontSize: 22,
      color: PALETTE.textColor,
    })
    els.push(titleT)
    const bodyT = text({
      x: x + 12,
      y: y + 70,
      w: cw - 24,
      h: ch - 80,
      content: cards[i].body,
      fontSize: 15,
      color: PALETTE.textColor,
    })
    els.push(bodyT)
  }

  const nestX = springX + springW + 100
  const nestY = springY + 200
  const nestW = 460
  const nestH = 380
  const nestCluster = rect({ x: nestX, y: nestY, w: nestW, h: nestH, kind: 'cluster' })
  els.push(nestCluster, clusterTitle({ x: nestX, y: nestY, content: 'NestJS · AI Server' }))

  const aiX = nestX + 30
  const aiY = nestY + 60
  const aiW = nestW - 60
  const aiH = nestH - 90
  const aiCard = rect({ x: aiX, y: aiY, w: aiW, h: aiH, kind: 'node' })
  els.push(aiCard)
  els.push(
    text({
      x: aiX + 12,
      y: aiY + 16,
      w: aiW - 24,
      h: 32,
      content: '/ai',
      fontSize: 22,
      color: PALETTE.textColor,
    }),
  )
  els.push(
    text({
      x: aiX + 12,
      y: aiY + 70,
      w: aiW - 24,
      h: aiH - 80,
      content:
        'POST /event/step1\n  · 자연어 → 제목 / 분류 / 내용\n\nPOST /event/step2\n  · 카테고리 + 공지글 + 장소\n\nPOST /post/categorize',
      fontSize: 15,
      color: PALETTE.textColor,
    }),
  )

  els.push(...arrow({ from: springCluster, to: nestCluster, label: 'AiClient', dashed: true }))
  return scene(els)
}

// ───────────────────────────────────────────────────────────────────
// 3. Architecture — User · FE · Core · AI · External
// ───────────────────────────────────────────────────────────────────
function buildArchitecture() {
  const els = []

  const user = rect({ x: 760, y: 40, w: 240, h: 80, kind: 'node' })
  const userT = text({
    x: 760 + 8,
    y: 40 + 18,
    w: 240 - 16,
    h: 44,
    content: '회장 / 부원\n(웹 브라우저)',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: user.id,
  })
  bindText(user, userT)
  els.push(user, userT)

  // FE cluster
  const feX = 940
  const feY = 200
  const feW = 620
  const feH = 380
  const feCluster = rect({ x: feX, y: feY, w: feW, h: feH, kind: 'cluster' })
  els.push(feCluster, clusterTitle({ x: feX, y: feY, content: 'Frontend · CUU-FRONT-React' }))

  const reactCard = rect({ x: feX + 30, y: feY + 60, w: 280, h: 160, kind: 'node' })
  const reactT = text({
    x: feX + 30 + 8,
    y: feY + 60 + 24,
    w: 280 - 16,
    h: 110,
    content: 'React 19 + Vite 6\nTanStack Router/Query\nTailwind + shadcn/ui\nZustand · Zod · RHF',
    fontSize: 15,
    color: PALETTE.textColor,
    containerId: reactCard.id,
  })
  bindText(reactCard, reactT)
  els.push(reactCard, reactT)

  const mswCard = rect({ x: feX + 30, y: feY + 250, w: 280, h: 90, kind: 'node' })
  const mswT = text({
    x: feX + 30 + 8,
    y: feY + 250 + 32,
    w: 280 - 16,
    h: 26,
    content: 'MSW (dev mock)',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: mswCard.id,
  })
  bindText(mswCard, mswT)
  els.push(mswCard, mswT)

  const fbClientCard = rect({ x: feX + 340, y: feY + 60, w: 250, h: 130, kind: 'node' })
  const fbClientT = text({
    x: feX + 340 + 8,
    y: feY + 60 + 35,
    w: 250 - 16,
    h: 60,
    content: 'Firebase Auth\n(Client SDK)',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: fbClientCard.id,
  })
  bindText(fbClientCard, fbClientT)
  els.push(fbClientCard, fbClientT)

  // Core cluster
  const coreX = 60
  const coreY = 700
  const coreW = 1180
  const coreH = 400
  const coreCluster = rect({ x: coreX, y: coreY, w: coreW, h: coreH, kind: 'cluster' })
  els.push(coreCluster, clusterTitle({ x: coreX, y: coreY, content: 'Backend Core · CUU-BACK-Spring' }))

  const springCard = rect({ x: coreX + 420, y: coreY + 60, w: 320, h: 110, kind: 'node' })
  const springT = text({
    x: coreX + 420 + 8,
    y: coreY + 60 + 28,
    w: 320 - 16,
    h: 54,
    content: 'Spring Boot 4 · Java 17\nJPA · Security · JWT',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: springCard.id,
  })
  bindText(springCard, springT)
  els.push(springCard, springT)

  const aiClientCard = rect({ x: coreX + 30, y: coreY + 230, w: 240, h: 110, kind: 'node' })
  const aiClientT = text({
    x: coreX + 30 + 8,
    y: coreY + 230 + 28,
    w: 240 - 16,
    h: 54,
    content: 'AiClient\n(Spring → Nest)',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: aiClientCard.id,
  })
  bindText(aiClientCard, aiClientT)
  els.push(aiClientCard, aiClientT)

  const dbCard = rect({ x: coreX + 320, y: coreY + 230, w: 380, h: 130, kind: 'node' })
  const dbT = text({
    x: coreX + 320 + 8,
    y: coreY + 230 + 24,
    w: 380 - 16,
    h: 84,
    content: 'RDB\nclub / event / post\nschool / user / notification',
    fontSize: 15,
    color: PALETTE.textColor,
    containerId: dbCard.id,
  })
  bindText(dbCard, dbT)
  els.push(dbCard, dbT)

  const fbAdminCard = rect({ x: coreX + 760, y: coreY + 230, w: 320, h: 110, kind: 'node' })
  const fbAdminT = text({
    x: coreX + 760 + 8,
    y: coreY + 230 + 35,
    w: 320 - 16,
    h: 30,
    content: 'Firebase Admin SDK',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: fbAdminCard.id,
  })
  bindText(fbAdminCard, fbAdminT)
  els.push(fbAdminCard, fbAdminT)

  // AI cluster
  const aX = 60
  const aY = 1160
  const aW = 720
  const aH = 240
  const aiCluster = rect({ x: aX, y: aY, w: aW, h: aH, kind: 'cluster' })
  els.push(aiCluster, clusterTitle({ x: aX, y: aY, content: 'Backend AI · CUU-BACK-Ai' }))

  const nestCard = rect({ x: aX + 30, y: aY + 60, w: 320, h: 140, kind: 'node' })
  const nestT = text({
    x: aX + 30 + 8,
    y: aY + 60 + 24,
    w: 320 - 16,
    h: 90,
    content: 'NestJS\nai.controller\nnotifications.controller',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: nestCard.id,
  })
  bindText(nestCard, nestT)
  els.push(nestCard, nestT)

  const mockStoreCard = rect({ x: aX + 400, y: aY + 80, w: 280, h: 100, kind: 'node' })
  const mockStoreT = text({
    x: aX + 400 + 8,
    y: aY + 80 + 35,
    w: 280 - 16,
    h: 30,
    content: 'mock.store (dev)',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: mockStoreCard.id,
  })
  bindText(mockStoreCard, mockStoreT)
  els.push(mockStoreCard, mockStoreT)

  // External
  const geminiCard = rect({ x: 880, y: 1200, w: 280, h: 100, kind: 'ext' })
  const geminiT = text({
    x: 880 + 8,
    y: 1200 + 35,
    w: 280 - 16,
    h: 30,
    content: 'Google Gemini API',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: geminiCard.id,
  })
  bindText(geminiCard, geminiT)
  els.push(geminiCard, geminiT)

  const mapsCard = rect({ x: 1200, y: 1200, w: 340, h: 100, kind: 'ext' })
  const mapsT = text({
    x: 1200 + 8,
    y: 1200 + 24,
    w: 340 - 16,
    h: 50,
    content: 'Google Maps Platform\nDistance Matrix · Places',
    fontSize: 15,
    color: PALETTE.textColor,
    containerId: mapsCard.id,
  })
  bindText(mapsCard, mapsT)
  els.push(mapsCard, mapsT)

  const fbAuthCard = rect({ x: 1340, y: 740, w: 280, h: 100, kind: 'ext' })
  const fbAuthT = text({
    x: 1340 + 8,
    y: 740 + 35,
    w: 280 - 16,
    h: 30,
    content: 'Firebase Auth Server',
    fontSize: 16,
    color: PALETTE.textColor,
    containerId: fbAuthCard.id,
  })
  bindText(fbAuthCard, fbAuthT)
  els.push(fbAuthCard, fbAuthT)

  // Arrows
  els.push(...arrow({ from: user, to: reactCard, label: 'HTTPS' }))
  els.push(...arrow({ from: reactCard, to: mswCard, label: 'dev only', dashed: true }))
  els.push(...arrow({ from: reactCard, to: springCard, label: 'REST + JWT' }))
  els.push(...arrow({ from: reactCard, to: fbClientCard, label: 'signup / signin' }))
  els.push(...arrow({ from: fbClientCard, to: fbAuthCard, label: 'verify token' }))
  els.push(...arrow({ from: springCard, to: fbAdminCard, label: 'verify' }))
  els.push(...arrow({ from: fbAdminCard, to: fbAuthCard }))
  els.push(...arrow({ from: springCard, to: dbCard, label: 'JPA' }))
  els.push(...arrow({ from: springCard, to: aiClientCard }))
  els.push(...arrow({ from: aiClientCard, to: nestCard, label: 'HTTP JSON' }))
  els.push(...arrow({ from: nestCard, to: mockStoreCard }))
  els.push(...arrow({ from: nestCard, to: geminiCard, label: 'prompt' }))
  els.push(...arrow({ from: nestCard, to: mapsCard, label: 'geo query' }))

  return scene(els)
}

async function main() {
  const dir = path.resolve(process.cwd(), 'diagrams')
  await mkdir(dir, { recursive: true })
  const out = {
    'tech-stack.excalidraw': buildTechStack(),
    'api-spec.excalidraw': buildApiSpec(),
    'architecture.excalidraw': buildArchitecture(),
  }
  for (const [name, sc] of Object.entries(out)) {
    const dst = path.join(dir, name)
    await writeFile(dst, JSON.stringify(sc, null, 2))
    console.log(`✓ ${name} (${sc.elements.length} elements)`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
