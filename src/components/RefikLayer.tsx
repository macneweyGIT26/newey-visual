'use client'
import { useEffect, useRef } from 'react'

// AMBIENT / REFIK LAYER — SOUL
// Generative fluid: memory, continuity, latent thought
// Very slow. Pastel: cyan, violet, coral, peach, gold. Museum installation feel.

interface Orb {
  x: number; y: number; vx: number; vy: number
  r: number; color: string; baseAlpha: number
  phase: number; phaseSpeed: number
}

const PALETTE = [
  '34,211,238',   // cyan
  '168,85,247',   // violet
  '251,146,60',   // coral/peach
  '253,186,116',  // peach
  '250,204,21',   // gold
  '196,181,253',  // lavender
  '147,197,253',  // soft blue
]

export default function RefikLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const frameRef = useRef(0)
  const initRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
      if (!initRef.current) initOrbs()
    }

    const initOrbs = () => {
      initRef.current = true
      const w = W(), h = H()
      const orbs: Orb[] = []
      for (let i = 0; i < 60; i++) {
        orbs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: 30 + Math.random() * 80,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          baseAlpha: 0.06 + Math.random() * 0.1,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.003 + Math.random() * 0.008,
        })
      }
      orbsRef.current = orbs
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      frameRef.current++
      const w = W(), h = H()

      // Soft fade instead of clear (creates trailing glow)
      ctx.fillStyle = 'rgba(214,211,209,0.04)'
      ctx.fillRect(0, 0, w, h)

      // Full clear every 600 frames to prevent buildup
      if (frameRef.current % 600 === 0) {
        ctx.fillStyle = 'rgba(214,211,209,1)'
        ctx.fillRect(0, 0, w, h)
      }

      const orbs = orbsRef.current
      const time = frameRef.current

      // Clustering behavior: orbs gently attract toward center clusters
      const cx1 = w * 0.35 + Math.sin(time * 0.001) * 50
      const cy1 = h * 0.4 + Math.cos(time * 0.0012) * 30
      const cx2 = w * 0.65 + Math.cos(time * 0.0008) * 40
      const cy2 = h * 0.6 + Math.sin(time * 0.001) * 25

      orbs.forEach(orb => {
        // Phase oscillation (bloom/contract)
        orb.phase += orb.phaseSpeed
        const bloom = 1 + Math.sin(orb.phase) * 0.2

        // Gentle attraction to nearest cluster center
        const d1 = Math.hypot(orb.x - cx1, orb.y - cy1)
        const d2 = Math.hypot(orb.x - cx2, orb.y - cy2)
        const cx = d1 < d2 ? cx1 : cx2
        const cy = d1 < d2 ? cy1 : cy2
        const dist = Math.min(d1, d2)

        if (dist > 50) {
          orb.vx += (cx - orb.x) * 0.000008
          orb.vy += (cy - orb.y) * 0.000008
        }

        // Gentle repulsion when too close
        if (dist < 30) {
          orb.vx -= (cx - orb.x) * 0.00002
          orb.vy -= (cy - orb.y) * 0.00002
        }

        // Damping
        orb.vx *= 0.998
        orb.vy *= 0.998

        orb.x += orb.vx
        orb.y += orb.vy

        // Wrap
        if (orb.x < -orb.r) orb.x = w + orb.r
        if (orb.x > w + orb.r) orb.x = -orb.r
        if (orb.y < -orb.r) orb.y = h + orb.r
        if (orb.y > h + orb.r) orb.y = -orb.r

        // Draw orb with radial gradient
        const r = orb.r * bloom
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r)
        const alpha = orb.baseAlpha * (0.8 + Math.sin(orb.phase * 0.5) * 0.2)
        grad.addColorStop(0, `rgba(${orb.color},${alpha * 2})`)
        grad.addColorStop(0.4, `rgba(${orb.color},${alpha})`)
        grad.addColorStop(1, `rgba(${orb.color},0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      // Connecting threads between nearby orbs
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const d = Math.hypot(orbs[i].x - orbs[j].x, orbs[i].y - orbs[j].y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(orbs[i].x, orbs[i].y)
            ctx.lineTo(orbs[j].x, orbs[j].y)
            const alpha = (1 - d / 120) * 0.08
            ctx.strokeStyle = `rgba(168,85,247,${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Ripple effect (reflection state — periodic)
      if (time % 500 > 450) {
        const rippleProgress = (time % 500 - 450) / 50
        const rippleR = rippleProgress * Math.max(w, h) * 0.6
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, rippleR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(250,204,21,${0.05 * (1 - rippleProgress)})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative w-full border-t border-stone-200" style={{ height: '50vh', minHeight: 400 }}>
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400">
          Ambient / Refik Layer
        </h2>
        <p className="text-2xl font-light text-stone-700 mt-1">Soul</p>
        <p className="text-xs text-stone-400 mt-2 max-w-xs leading-relaxed">
          Memory drifts. Clusters form and dissolve. Latent thought glows softly. Gold ripples mark synthesis.
        </p>
      </div>
      {/* State indicators */}
      <div className="absolute bottom-6 right-8 z-10 flex gap-4 text-[10px] text-stone-400">
        <span>drift · cluster · bloom · ripple</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
