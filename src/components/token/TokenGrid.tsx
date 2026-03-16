'use client'

import { useEffect, useRef } from 'react'

type NodeKind = 'substation' | 'reserve' | 'memory'
type PulseKind = 'system' | 'work' | 'personal' | 'synthesis'

type Point = { x: number; y: number }

type Node = {
  id: string
  x: number
  y: number
  r: number
  kind: NodeKind
  label: string
  color: string
}

type Edge = {
  a: string
  b: string
}

type Pulse = {
  edgeIndex: number
  t: number
  speed: number
  size: number
  color: string
  kind: PulseKind
}

const COLORS = {
  bgTop: '#03101f',
  bgBottom: '#020814',
  grid: 'rgba(90,130,190,0.14)',
  street: 'rgba(80,160,220,0.10)',
  amber: '#ff9a3c',
  cyan: '#34d1e7',
  violet: '#a66bff',
  rose: '#ff5fa2',
  red: '#ff4d4d',
  white: '#eef6ff',
}

const NODES: Node[] = [
  { id: 's1', x: 0.18, y: 0.60, r: 18, kind: 'substation', label: 'West Substation', color: COLORS.amber },
  { id: 's2', x: 0.42, y: 0.70, r: 20, kind: 'substation', label: 'Core Substation', color: COLORS.amber },
  { id: 's3', x: 0.67, y: 0.58, r: 18, kind: 'substation', label: 'North Substation', color: COLORS.cyan },
  { id: 's4', x: 0.80, y: 0.46, r: 18, kind: 'substation', label: 'East Substation', color: COLORS.cyan },

  { id: 'r1', x: 0.28, y: 0.30, r: 16, kind: 'reserve', label: 'Token Reserve', color: COLORS.violet },
  { id: 'r2', x: 0.56, y: 0.25, r: 16, kind: 'reserve', label: 'Token Reserve', color: COLORS.violet },
  { id: 'r3', x: 0.86, y: 0.22, r: 16, kind: 'reserve', label: 'Token Reserve', color: COLORS.violet },

  { id: 'm1', x: 0.74, y: 0.80, r: 24, kind: 'memory', label: 'Memory Sink', color: COLORS.rose },
]

const EDGES: Edge[] = [
  { a: 's1', b: 's2' },
  { a: 's2', b: 's3' },
  { a: 's3', b: 's4' },

  { a: 'r1', b: 's1' },
  { a: 'r1', b: 's2' },
  { a: 'r2', b: 's2' },
  { a: 'r2', b: 's3' },
  { a: 'r3', b: 's3' },
  { a: 'r3', b: 's4' },

  { a: 's2', b: 'm1' },
  { a: 's3', b: 'm1' },

  { a: 's1', b: 's3' },
  { a: 's2', b: 's4' },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function pointOnLine(a: Point, b: Point, t: number): Point {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function glowCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha = 1
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.shadowColor = color
  ctx.shadowBlur = r * 2.8
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export default function TokenGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame = 0
    let width = 0
    let height = 0
    let dpr = 1
    let time = 0

    const pulses: Pulse[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const getNode = (id: string) => {
      const node = NODES.find((n) => n.id === id)
      if (!node) throw new Error(`Node not found: ${id}`)
      return node
    }

    const worldPoint = (node: Node): Point => ({
      x: node.x * width,
      y: node.y * height,
    })

    const spawnPulse = () => {
      const edgeIndex = Math.floor(rand(0, EDGES.length))
      const kindRoll = Math.random()

      let kind: PulseKind = 'work'
      let color = COLORS.cyan

      if (kindRoll < 0.22) {
        kind = 'system'
        color = COLORS.violet
      } else if (kindRoll < 0.72) {
        kind = 'work'
        color = COLORS.cyan
      } else if (kindRoll < 0.90) {
        kind = 'personal'
        color = COLORS.amber
      } else {
        kind = 'synthesis'
        color = COLORS.rose
      }

      pulses.push({
        edgeIndex,
        t: Math.random(),
        speed: rand(0.0025, 0.008),
        size: kind === 'synthesis' ? rand(4, 6) : rand(2.6, 4.6),
        color,
        kind,
      })
    }

    const drawBackground = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      grad.addColorStop(0, COLORS.bgTop)
      grad.addColorStop(1, COLORS.bgBottom)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // city haze
      for (let i = 0; i < 7; i++) {
        const x = rand(0, width)
        const y = rand(height * 0.08, height * 0.55)
        const r = rand(width * 0.08, width * 0.18)
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, 'rgba(70,120,180,0.08)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawGrid = () => {
      ctx.save()
      ctx.lineWidth = 1

      for (let i = 0; i <= 12; i++) {
        const x = (i / 12) * width
        ctx.strokeStyle = COLORS.grid
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      for (let i = 0; i <= 7; i++) {
        const y = (i / 7) * height
        ctx.strokeStyle = COLORS.street
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      ctx.restore()
    }

    const drawCity = () => {
      ctx.save()
      ctx.globalAlpha = 0.16
      ctx.lineWidth = 1

      for (let i = 0; i < 34; i++) {
        const bw = rand(24, 90)
        const bh = rand(40, 170)
        const x = rand(0, width - bw)
        const y = rand(height * 0.12, height * 0.80 - bh)

        ctx.strokeStyle = i % 3 === 0 ? 'rgba(100,180,255,0.18)' : 'rgba(255,255,255,0.08)'
        ctx.strokeRect(x, y, bw, bh)

        if (Math.random() > 0.55) {
          for (let j = 1; j < 4; j++) {
            const yy = y + (bh / 4) * j
            ctx.beginPath()
            ctx.moveTo(x, yy)
            ctx.lineTo(x + bw, yy)
            ctx.stroke()
          }
        }
      }

      ctx.restore()
    }

    const drawTowers = () => {
      const towerIds = ['s1', 's2', 's3']
      towerIds.forEach((id, idx) => {
        const p = worldPoint(getNode(id))
        const h = idx === 1 ? 130 : 110
        const topY = p.y - h
        const half = 18

        ctx.save()
        ctx.strokeStyle = idx < 2 ? 'rgba(255,154,60,0.9)' : 'rgba(52,209,231,0.9)'
        ctx.lineWidth = 2
        ctx.shadowBlur = 18
        ctx.shadowColor = idx < 2 ? COLORS.amber : COLORS.cyan

        ctx.beginPath()
        ctx.moveTo(p.x - half, p.y)
        ctx.lineTo(p.x, topY)
        ctx.lineTo(p.x + half, p.y)
        ctx.moveTo(p.x - half * 0.8, p.y - h * 0.25)
        ctx.lineTo(p.x + half * 0.8, p.y - h * 0.25)
        ctx.moveTo(p.x - half * 0.6, p.y - h * 0.52)
        ctx.lineTo(p.x + half * 0.6, p.y - h * 0.52)
        ctx.moveTo(p.x - half * 0.3, p.y - h * 0.78)
        ctx.lineTo(p.x + half * 0.3, p.y - h * 0.78)
        ctx.stroke()

        ctx.restore()
      })
    }

    const drawEdges = () => {
      EDGES.forEach((edge) => {
        const a = worldPoint(getNode(edge.a))
        const b = worldPoint(getNode(edge.b))

        ctx.save()

        // base cable
        ctx.strokeStyle = 'rgba(180,220,255,0.10)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()

        // live current glow
        const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        g.addColorStop(0, 'rgba(255,154,60,0.12)')
        g.addColorStop(0.5, 'rgba(52,209,231,0.16)')
        g.addColorStop(1, 'rgba(166,107,255,0.12)')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.2
        ctx.shadowBlur = 10
        ctx.shadowColor = 'rgba(120,200,255,0.28)'
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()

        ctx.restore()
      })
    }

    const drawNodes = () => {
      NODES.forEach((node) => {
        const p = worldPoint(node)
        const pulse = (Math.sin(time * 0.0018 + p.x * 0.01 + p.y * 0.02) + 1) / 2
        const glow = node.kind === 'memory' ? 1.25 : 0.95 + pulse * 0.45

        glowCircle(ctx, p.x, p.y, node.r * 1.75 * glow, node.color, 0.08)
        glowCircle(ctx, p.x, p.y, node.r * 1.15, node.color, 0.16)

        ctx.save()
        ctx.fillStyle = 'rgba(8,14,28,0.92)'
        ctx.strokeStyle = node.color
        ctx.lineWidth = 2
        ctx.shadowBlur = 18
        ctx.shadowColor = node.color

        roundedRect(ctx, p.x - node.r, p.y - node.r, node.r * 2, node.r * 2, 6)
        ctx.fill()
        ctx.stroke()

        ctx.restore()

        ctx.save()
        ctx.fillStyle = node.color
        ctx.font = '600 13px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.label, p.x + node.r + 12, p.y)
        ctx.restore()
      })
    }

    const drawPulses = () => {
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        const edge = EDGES[pulse.edgeIndex]
        const a = worldPoint(getNode(edge.a))
        const b = worldPoint(getNode(edge.b))

        pulse.t += pulse.speed
        if (pulse.t > 1) {
          pulses.splice(i, 1)
          continue
        }

        const p = pointOnLine(a, b, pulse.t)

        const alpha = pulse.kind === 'synthesis' ? 0.95 : 0.82
        glowCircle(ctx, p.x, p.y, pulse.size * 3.6, pulse.color, alpha * 0.10)
        glowCircle(ctx, p.x, p.y, pulse.size * 1.7, pulse.color, alpha * 0.24)
        glowCircle(ctx, p.x, p.y, pulse.size, pulse.color, alpha)

        // tiny trailing dots for token feel
        for (let j = 1; j <= 4; j++) {
          const tt = pulse.t - j * 0.018
          if (tt <= 0) continue
          const tp = pointOnLine(a, b, tt)
          glowCircle(ctx, tp.x, tp.y, Math.max(1.2, pulse.size - j * 0.5), pulse.color, 0.14)
        }
      }
    }

    const drawLegend = () => {
      const x = 20
      const y = height - 122

      ctx.save()
      roundedRect(ctx, x - 12, y - 18, 310, 102, 14)
      ctx.fillStyle = 'rgba(5,10,20,0.52)'
      ctx.fill()

      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.font = '700 15px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
      ctx.fillText('Newey Town Power Grid', x, y)

      const items = [
        { label: 'System', color: COLORS.violet },
        { label: 'Work', color: COLORS.cyan },
        { label: 'Personal', color: COLORS.amber },
        { label: 'Synthesis', color: COLORS.rose },
        { label: 'Token flow', color: COLORS.white },
      ]

      items.forEach((item, i) => {
        const yy = y + 26 + i * 14
        glowCircle(ctx, x + 6, yy - 4, 4, item.color, 0.95)
        ctx.fillStyle = 'rgba(220,232,248,0.86)'
        ctx.font = '500 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
        ctx.fillText(item.label, x + 18, yy)
      })

      ctx.restore()
    }

    const drawTokenMeter = () => {
      const x = width - 250
      const y = 22
      const w = 220
      const h = 52
      const load = 0.62 + Math.sin(time * 0.001) * 0.12

      ctx.save()
      roundedRect(ctx, x, y, w, h, 12)
      ctx.fillStyle = 'rgba(5,10,20,0.56)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.10)'
      ctx.stroke()

      ctx.fillStyle = 'rgba(238,246,255,0.92)'
      ctx.font = '700 13px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
      ctx.fillText('Token Load', x + 14, y + 18)

      roundedRect(ctx, x + 14, y + 28, w - 28, 10, 6)
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.fill()

      const fillW = (w - 28) * load
      const barGrad = ctx.createLinearGradient(x + 14, 0, x + 14 + fillW, 0)
      barGrad.addColorStop(0, COLORS.cyan)
      barGrad.addColorStop(0.55, COLORS.amber)
      barGrad.addColorStop(1, COLORS.rose)

      roundedRect(ctx, x + 14, y + 28, fillW, 10, 6)
      ctx.fillStyle = barGrad
      ctx.shadowColor = COLORS.cyan
      ctx.shadowBlur = 16
      ctx.fill()

      ctx.restore()
    }

    const tick = () => {
      time += 16

      if (pulses.length < 46 && Math.random() > 0.34) spawnPulse()
      if (Math.random() > 0.985) spawnPulse()

      drawBackground()
      drawGrid()
      drawCity()
      drawEdges()
      drawTowers()
      drawPulses()
      drawNodes()
      drawLegend()
      drawTokenMeter()

      animationFrame = requestAnimationFrame(tick)
    }

    resize()
    for (let i = 0; i < 20; i++) spawnPulse()
    tick()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#020814]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute left-6 top-6 max-w-xl">
        <div className="mb-3 inline-block rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/70">
          Newey Visual / Tokens / Grid
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Town Power Grid
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-white/70 md:text-base">
          Animated token current across substations, reserves, and memory sinks. Violet = system,
          cyan = work, amber = personal, rose = synthesis. Tokens are shown as moving light, not
          a separate category.
        </p>
      </div>
    </div>
  )
}
