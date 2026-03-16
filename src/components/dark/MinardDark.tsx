'use client'
import { useEffect, useRef } from 'react'

// DARK MODE — EXECUTIVE / MINARD LAYER — REASON
// Deep navy background. Luminous amber/gold flow bands.
// Inspired by: F1 timing boards, terminal warm-charcoal aesthetic

interface FlowParticle {
  x: number; y: number; vx: number; vy: number
  band: number; alpha: number; alive: boolean
  color: string; stage: number; width: number
  glow: number
}

const STAGES = ['Prompt', 'Router', 'Agent Swarm', 'Tool Calls', 'Output']
const STAGE_X = [0.08, 0.25, 0.45, 0.68, 0.88]
const BAND_WIDTHS = [180, 140, 90, 60, 30]

export default function MinardDark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FlowParticle[]>([])
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2) }
    resize()
    window.addEventListener('resize', resize)
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight, midY = () => H() / 2

    const spawnParticle = () => {
      const band = Math.random()
      const isSecondary = Math.random() < 0.2
      const isPurple = Math.random() < 0.1
      particlesRef.current.push({
        x: W() * STAGE_X[0], y: midY() + (band - 0.5) * BAND_WIDTHS[0],
        vx: 0.25 + Math.random() * 0.35, vy: (Math.random() - 0.5) * 0.12,
        band, alpha: 0.7 + Math.random() * 0.3, alive: true,
        color: isPurple ? '168,85,247' : isSecondary ? '34,211,238' : '245,178,50',
        stage: 0, width: 1.5 + Math.random() * 2.5, glow: 4 + Math.random() * 8,
      })
    }

    const draw = () => {
      frameRef.current++
      const w = W(), h = H()
      // Dark fade
      ctx.fillStyle = 'rgba(10,14,26,0.12)'
      ctx.fillRect(0, 0, w, h)
      if (frameRef.current % 400 === 0) { ctx.fillStyle = 'rgba(10,14,26,1)'; ctx.fillRect(0, 0, w, h) }

      // Subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.02)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < w; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

      // Stage labels
      ctx.font = '10px -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.textAlign = 'center'
      STAGES.forEach((s, i) => {
        ctx.fillText(s, w * STAGE_X[i], h - 18)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)'
        ctx.beginPath(); ctx.moveTo(w * STAGE_X[i], 30); ctx.lineTo(w * STAGE_X[i], h - 28); ctx.stroke()
      })

      // Flow bands ghost
      STAGE_X.forEach((sx, i) => {
        if (i >= STAGE_X.length - 1) return
        const x1 = w * sx, x2 = w * STAGE_X[i + 1], bw1 = BAND_WIDTHS[i], bw2 = BAND_WIDTHS[i + 1]
        ctx.beginPath()
        ctx.moveTo(x1, midY() - bw1 / 2)
        ctx.bezierCurveTo(x1 + (x2 - x1) * 0.5, midY() - bw1 / 2, x1 + (x2 - x1) * 0.5, midY() - bw2 / 2, x2, midY() - bw2 / 2)
        ctx.lineTo(x2, midY() + bw2 / 2)
        ctx.bezierCurveTo(x1 + (x2 - x1) * 0.5, midY() + bw2 / 2, x1 + (x2 - x1) * 0.5, midY() + bw1 / 2, x1, midY() + bw1 / 2)
        ctx.closePath()
        ctx.fillStyle = 'rgba(245,178,50,0.015)'
        ctx.fill()
      })

      if (frameRef.current % 6 === 0) spawnParticle()

      particlesRef.current.forEach(p => {
        if (!p.alive) return
        p.x += p.vx
        const progress = p.x / w
        let stageIdx = 0
        for (let i = STAGE_X.length - 1; i >= 0; i--) { if (progress >= STAGE_X[i]) { stageIdx = i; break } }
        const targetBand = BAND_WIDTHS[Math.min(stageIdx, BAND_WIDTHS.length - 1)]
        const targetY = midY() + (p.band - 0.5) * targetBand
        p.y += (targetY - p.y) * 0.02; p.y += p.vy

        // Attrition with red flash
        if (stageIdx >= 2 && Math.random() < 0.0008) {
          p.alive = false
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8)
          grad.addColorStop(0, 'rgba(239,68,68,0.6)')
          grad.addColorStop(1, 'rgba(239,68,68,0)')
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
          return
        }
        if (p.x > w * 0.95) { p.alpha -= 0.02; if (p.alpha <= 0) p.alive = false }

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glow)
        grad.addColorStop(0, `rgba(${p.color},${p.alpha * 0.4})`)
        grad.addColorStop(1, `rgba(${p.color},0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.glow, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()

        // Core
        ctx.beginPath(); ctx.arc(p.x, p.y, p.width, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`; ctx.fill()

        // Trail
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 18, p.y)
        ctx.strokeStyle = `rgba(${p.color},${p.alpha * 0.2})`; ctx.lineWidth = p.width * 0.5; ctx.stroke()
      })

      if (frameRef.current % 60 === 0) particlesRef.current = particlesRef.current.filter(p => p.alive)
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative w-full" style={{ height: '50vh', minHeight: 400 }}>
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-500/60">Executive / Minard Layer</h2>
        <p className="text-2xl font-light text-stone-300 mt-1">Reason</p>
        <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">Luminous flow narrows through stages. Attrition flashes red. Token energy pulses gold.</p>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
