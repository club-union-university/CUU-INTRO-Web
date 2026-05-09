#!/usr/bin/env node
/**
 * Convert .mmd files to .excalidraw scenes.
 * Uses mermaid-to-excalidraw to produce skeletons, then fills in the
 * required Excalidraw element fields manually (avoids @excalidraw/excalidraw
 * which breaks on Node 24's strict JSON import attributes).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { JSDOM } from 'jsdom'

// Browser polyfill — mermaid 11.x assumes window/document/DOMPurify
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})
for (const k of [
  'window',
  'document',
  'navigator',
  'HTMLElement',
  'HTMLAnchorElement',
  'HTMLDivElement',
  'HTMLCanvasElement',
  'Node',
  'Element',
  'NodeFilter',
  'SVGElement',
  'SVGSVGElement',
  'DocumentFragment',
  'getComputedStyle',
]) {
  if (!(k in globalThis)) globalThis[k] = dom.window[k]
}

const { parseMermaidToExcalidraw } = await import('@excalidraw/mermaid-to-excalidraw')

const DIR = path.resolve(process.cwd(), 'diagrams')
const SOURCES = ['architecture', 'tech-stack', 'api-spec']

const PALETTE = {
  bg: 'transparent',
  nodeFill: '#3730a3',
  nodeStroke: '#c7d2fe',
  textColor: '#ffffff',
  edge: '#c7d2fe',
  cluster: '#1e1b4b',
  clusterStroke: '#a5b4fc',
}

const FONT_FAMILY_HAND = 1
const FONT_FAMILY_NORMAL = 2
const FONT_FAMILY_CODE = 3

function rid() {
  return crypto.randomBytes(10).toString('hex')
}
function rseed() {
  return Math.floor(Math.random() * 2 ** 31)
}

function baseProps() {
  return {
    angle: 0,
    strokeWidth: 1.5,
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

function pickFill(skel) {
  const isCluster = skel.subtype === 'subgraph' || skel.groupIds?.length > 0
  if (isCluster) {
    return { background: PALETTE.cluster, stroke: PALETTE.clusterStroke, dashed: true }
  }
  return { background: PALETTE.nodeFill, stroke: PALETTE.nodeStroke, dashed: false }
}

function makeContainer(skel) {
  const { background, stroke, dashed } = pickFill(skel)
  const id = skel.id || rid()
  const container = {
    id,
    type: skel.type,
    x: skel.x,
    y: skel.y,
    width: skel.width,
    height: skel.height,
    strokeColor: stroke,
    backgroundColor: background,
    fillStyle: 'solid',
    roundness: skel.type === 'rectangle' ? { type: 3 } : null,
    ...baseProps(),
    strokeStyle: dashed ? 'dashed' : 'solid',
  }
  return container
}

function makeLabel(skel, container) {
  if (!skel.label?.text) return null
  const text = skel.label.text
  const fontSize = skel.label.fontSize ?? 16
  // rough text size
  const lines = text.split('\n')
  const lineH = fontSize * 1.25
  const width = Math.max(...lines.map((l) => l.length * fontSize * 0.55))
  const height = lines.length * lineH
  const id = rid()
  return {
    id,
    type: 'text',
    x: container.x + (container.width - width) / 2,
    y: container.y + (container.height - height) / 2,
    width,
    height,
    text,
    originalText: text,
    fontSize,
    fontFamily: FONT_FAMILY_NORMAL,
    textAlign: 'center',
    verticalAlign: 'middle',
    baseline: Math.round(fontSize * 0.92),
    lineHeight: 1.25,
    containerId: container.id,
    strokeColor: PALETTE.textColor,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    roundness: null,
    ...baseProps(),
  }
}

function makeArrow(skel, idMap) {
  const startId = skel.start?.id ? idMap.get(skel.start.id) : null
  const endId = skel.end?.id ? idMap.get(skel.end.id) : null
  const id = skel.id || rid()
  // Use raw points if provided, else a simple horizontal segment between bound ids
  const points = skel.points && skel.points.length >= 2 ? skel.points : [[0, 0], [80, 0]]
  const minX = Math.min(...points.map((p) => p[0]))
  const minY = Math.min(...points.map((p) => p[1]))
  const maxX = Math.max(...points.map((p) => p[0]))
  const maxY = Math.max(...points.map((p) => p[1]))
  const x = skel.x ?? minX
  const y = skel.y ?? minY
  const arrow = {
    id,
    type: 'arrow',
    x,
    y,
    width: maxX - minX,
    height: maxY - minY,
    strokeColor: PALETTE.edge,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    roundness: { type: 2 },
    points: points.map(([px, py]) => [px - minX, py - minY]),
    lastCommittedPoint: null,
    startBinding: startId ? { elementId: startId, focus: 0, gap: 4 } : null,
    endBinding: endId ? { elementId: endId, focus: 0, gap: 4 } : null,
    startArrowhead: null,
    endArrowhead: 'arrow',
    elbowed: false,
    ...baseProps(),
    strokeStyle: skel.strokeStyle || 'solid',
  }
  return arrow
}

function makeArrowLabel(skel, arrow) {
  if (!skel.label?.text) return null
  const text = skel.label.text
  const fontSize = 14
  const lines = text.split('\n')
  const w = Math.max(...lines.map((l) => l.length * fontSize * 0.6))
  const h = lines.length * fontSize * 1.25
  const cx = arrow.x + arrow.width / 2
  const cy = arrow.y + arrow.height / 2
  return {
    id: rid(),
    type: 'text',
    x: cx - w / 2,
    y: cy - h / 2,
    width: w,
    height: h,
    text,
    originalText: text,
    fontSize,
    fontFamily: FONT_FAMILY_NORMAL,
    textAlign: 'center',
    verticalAlign: 'middle',
    baseline: Math.round(fontSize * 0.92),
    lineHeight: 1.25,
    containerId: null,
    strokeColor: PALETTE.textColor,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    roundness: null,
    ...baseProps(),
  }
}

async function convertOne(name) {
  const src = path.join(DIR, `${name}.mmd`)
  const dst = path.join(DIR, `${name}.excalidraw`)
  let raw = await readFile(src, 'utf8')
  raw = raw.replace(/^---[\s\S]*?---\s*\n/, '')
  const { elements: skel = [], files = {} } = await parseMermaidToExcalidraw(raw, {
    fontSize: 16,
  })

  const idMap = new Map()
  const out = []
  // First pass: containers (rectangles, ellipses, diamonds)
  for (const el of skel) {
    if (
      el.type === 'rectangle' ||
      el.type === 'ellipse' ||
      el.type === 'diamond'
    ) {
      const container = makeContainer(el)
      const label = makeLabel(el, container)
      if (label) container.boundElements.push({ id: label.id, type: 'text' })
      idMap.set(el.id, container.id)
      out.push(container)
      if (label) out.push(label)
    }
  }
  // Second pass: arrows / lines
  for (const el of skel) {
    if (el.type === 'arrow' || el.type === 'line') {
      const arrow = makeArrow(el, idMap)
      out.push(arrow)
      const arrowLabel = makeArrowLabel(el, arrow)
      if (arrowLabel) out.push(arrowLabel)
    }
  }

  const scene = {
    type: 'excalidraw',
    version: 2,
    source: 'cuu-intro-web · mmd-to-excalidraw',
    elements: out,
    appState: {
      viewBackgroundColor: PALETTE.bg,
      gridSize: null,
      theme: 'dark',
    },
    files,
  }
  await writeFile(dst, JSON.stringify(scene, null, 2))
  return { name, count: out.length, dst }
}

async function main() {
  await mkdir(DIR, { recursive: true })
  for (const name of SOURCES) {
    try {
      const r = await convertOne(name)
      console.log(`✓ ${r.name} → ${path.relative(process.cwd(), r.dst)} (${r.count} elements)`)
    } catch (e) {
      console.error(`✗ ${name}: ${e.message}`)
      throw e
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
