'use client'
import { useEffect, useRef } from 'react'

// EXECUTIVE / MINARD LAYER — REASON
// Sankey-style flow: Prompt → Router → Agent Swarm → Tool Calls → Output
// Slow, controlled. Visible attrition. Amber/orange flow, cyan secondary.

interface FlowParticle {
  x: number; y: number; vx: number; vy: number
  band: number; alpha: number; alive: boolean
  color: string; stage: number; width: number
}

const STAGES = ['Prompt', 'Router', 'Agent Swarm', 'Tool Calls', 'Output']
const STAGE_X = [0.08, 0.25, 0.45, 0.68, 0.88]
const BAND_WIDTHS = [180, 140, 90, 60, 30] // narrowing

export default function MinardLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FlowParticle[]>([])
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight
    const midY = () => H() / 2

    const spawnParticle = () => {
      const band = Math.random()
      const isSecondary = Math.random() < 0.25
      particlesRef.current.push({
        x: W() * STAGE_X[0],
        y: midY() + (band - 0.5) * BAND_WIDTHS[0],
        vx: 0.3 + Math.random() * 0.4,
        vy: (Math.random() - 0.5) * 0.15,
        band, alpha: 0.6 + Math.random() * 0.4,
        alive: true,
        color: isSecondary ? 'rgba(56,189,248,' : 'rgba(245,158,11,',
        stage: 0,
        width: 1.5 + Math.random() * 2,
      })
    }

    const draw = () => {
      frameRef.current++
      const w = W(), h = H()
      ctx.clearRect(0, 0, w, h)

      // Grid lines
      ctx.strokeStyle = 'rgba(0,0,0,0.04)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

      // Stage labels
      ctx.font = '11px -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.textAlign = 'center'
      STAGES.forEach((s, i) => {
        const sx = w * STAGE_X[i]
        ctx.fillText(s, sx, h - 20)
        // Stage divider
        ctx.strokeStyle = 'rgba(0,0,0,0.06)'
        ctx.beginPath(); ctx.moveTo(sx, 30); ctx.lineTo(sx, h - 30); ctx.stroke()
      })

      // Flow bands (ghost)
      STAGE_X.forEach((sx, i) => {
        if (i >= STAGE_X.length - 1) return
        const x1 = w * sx, x2 = w * STAGE_X[i + 1]
        const bw1 = BAND_WIDTHS[i], bw2 = BAND_WIDTHS[i + 1]
        ctx.beginPath()
        ctx.moveTo(x1, midY() - bw1 / 2)
        ctx.bezierCurveTo(x1 + (x2 - x1) * 0.5, midY() - bw1 / 2, x1 + (x2 - x1) * 0.5, midY() - bw2 / 2, x2, midY() - bw2 / 2)
        ctx.lineTo(x2, midY() + bw2 / 2)
        ctx.bezierCurveTo(x1 + (x2 - x1) * 0.5, midY() + bw2 / 2, x1 + (x2 - x1) * 0.5, midY() + bw1 / 2, x1, midY() + bw1 / 2)
        ctx.closePath()
        ctx.fillStyle = 'rgba(245,158,11,0.03)'
        ctx.fill()
      })

      // Spawn
      if (frameRef.current % 8 === 0) spawnParticle()

      // Update & draw particles
      particlesRef.current.forEach(p => {
        if (!p.alive) return
        p.x += p.vx

        // Determine stage
        const progress = p.x / w
        let stageIdx = 0
        for (let i = STAGE_X.length - 1; i >= 0; i--) {
          if (progress >= STAGE_X[i]) { stageIdx = i; break }
        }
        p.stage = stageIdx

        // Narrow toward center at each stage
        const targetBand = BAND_WIDTHS[Math.min(stageIdx, BAND_WIDTHS.length - 1)]
        const targetY = midY() + (p.band - 0.5) * targetBand
        p.y += (targetY - p.y) * 0.02
        p.y += p.vy

        // Attrition: some particles die at transitions
        if (stageIdx >= 2 && Math.random() < 0.0008) {
          p.alive = false
          // Dead path flash
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(239,68,68,0.4)'
          ctx.fill()
          return
        }

        // Kill if off screen
        if (p.x > w * 0.95) { p.alpha -= 0.02; if (p.alpha <= 0) p.alive = false }

        // Draw
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.width, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.alpha + ')'
        ctx.fill()

        // Trail
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - 12, p.y)
        ctx.strokeStyle = p.color + (p.alpha * 0.3) + ')'
        ctx.lineWidth = p.width * 0.6
        ctx.stroke()
      })

      // Cleanup dead
      if (frameRef.current % 60 === 0) {
        particlesRef.current = particlesRef.current.filter(p => p.alive)
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative w-full" style={{ height: '50vh', minHeight: 400 }}>
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400">
          Executive / Minard Layer
        </h2>
        <p className="text-2xl font-light text-stone-700 mt-1">Reason</p>
        <p className="text-xs text-stone-400 mt-2 max-w-xs leading-relaxed">
          Flow narrows through reasoning stages. Attrition visible. Dead paths flash red. Token energy converts to output.
        </p>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
