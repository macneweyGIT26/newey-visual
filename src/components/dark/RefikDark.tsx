'use client'
import { useEffect, useRef } from 'react'

// DARK MODE — AMBIENT / REFIK LAYER — SOUL
// Fiber-optic connectome on void black. Luminous strands.
// Inspired by: Refik Anadol Connectome, bioluminescent deep-sea, nebula

interface Fiber {
  points: {x:number;y:number}[]
  color: string; alpha: number; width: number
  speed: number; phase: number; drift: number
}

const PALETTE = [
  '34,211,238',   // cyan
  '59,130,246',   // blue
  '168,85,247',   // violet
  '236,72,153',   // magenta/pink
  '245,178,50',   // amber/gold
  '16,185,129',   // emerald
  '251,146,60',   // coral
  '196,181,253',  // lavender
]

export default function RefikDark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fibersRef = useRef<Fiber[]>([])
  const frameRef = useRef(0)
  const initRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2); if (!initRef.current) initFibers() }

    const initFibers = () => {
      initRef.current = true
      const w = W(), h = H(), fibers: Fiber[] = []
      const cx = w / 2, cy = h / 2

      for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = 60 + Math.random() * Math.min(w, h) * 0.35
        const points: {x:number;y:number}[] = []
        const segments = 20 + Math.floor(Math.random() * 30)

        // Organic curve from center outward
        for (let j = 0; j <= segments; j++) {
          const t = j / segments
          const r = t * radius
          const a = angle + Math.sin(t * 3) * 0.8 + Math.cos(t * 2.5) * 0.5
          points.push({
            x: cx + Math.cos(a) * r + (Math.random() - 0.5) * 20,
            y: cy + Math.sin(a) * r + (Math.random() - 0.5) * 20,
          })
        }

        fibers.push({
          points,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          alpha: 0.15 + Math.random() * 0.4,
          width: 0.5 + Math.random() * 1.5,
          speed: 0.002 + Math.random() * 0.006,
          phase: Math.random() * Math.PI * 2,
          drift: 0.1 + Math.random() * 0.3,
        })
      }

      // Add some shorter, brighter core fibers
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = 30 + Math.random() * 80
        const points: {x:number;y:number}[] = []
        const segments = 8 + Math.floor(Math.random() * 12)
        for (let j = 0; j <= segments; j++) {
          const t = j / segments
          const r = t * radius
          const a = angle + Math.sin(t * 4) * 0.6
          points.push({ x: cx + Math.cos(a) * r + (Math.random() - 0.5) * 10, y: cy + Math.sin(a) * r + (Math.random() - 0.5) * 10 })
        }
        fibers.push({
          points, color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          alpha: 0.3 + Math.random() * 0.5, width: 1 + Math.random() * 2,
          speed: 0.003 + Math.random() * 0.008, phase: Math.random() * Math.PI * 2, drift: 0.05 + Math.random() * 0.15,
        })
      }

      fibersRef.current = fibers
    }

    resize(); window.addEventListener('resize', resize)

    const draw = () => {
      frameRef.current++
      const w = W(), h = H(), time = frameRef.current

      // Very slow fade — creates persistent glow trails
      ctx.fillStyle = 'rgba(5,5,15,0.03)'
      ctx.fillRect(0, 0, w, h)
      if (time % 800 === 0) { ctx.fillStyle = 'rgba(5,5,15,1)'; ctx.fillRect(0, 0, w, h) }

      const fibers = fibersRef.current

      // Draw fibers
      fibers.forEach(fiber => {
        fiber.phase += fiber.speed
        const pulseAlpha = fiber.alpha * (0.5 + Math.sin(fiber.phase) * 0.5)
        if (pulseAlpha < 0.02) return

        // Drift points slightly
        fiber.points.forEach(p => {
          p.x += Math.sin(time * 0.001 + p.y * 0.01) * fiber.drift * 0.1
          p.y += Math.cos(time * 0.001 + p.x * 0.01) * fiber.drift * 0.1
        })

        // Draw fiber as smooth curve
        ctx.beginPath()
        ctx.moveTo(fiber.points[0].x, fiber.points[0].y)
        for (let i = 1; i < fiber.points.length - 1; i++) {
          const xc = (fiber.points[i].x + fiber.points[i + 1].x) / 2
          const yc = (fiber.points[i].y + fiber.points[i + 1].y) / 2
          ctx.quadraticCurveTo(fiber.points[i].x, fiber.points[i].y, xc, yc)
        }
        ctx.strokeStyle = `rgba(${fiber.color},${pulseAlpha})`
        ctx.lineWidth = fiber.width
        ctx.stroke()

        // Tip glow
        const tip = fiber.points[fiber.points.length - 1]
        if (pulseAlpha > 0.2) {
          const grad = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 6)
          grad.addColorStop(0, `rgba(${fiber.color},${pulseAlpha * 0.6})`)
          grad.addColorStop(1, `rgba(${fiber.color},0)`)
          ctx.beginPath(); ctx.arc(tip.x, tip.y, 6, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        }

        // Traveling pulse along fiber
        const pulsePos = (time * fiber.speed * 3) % 1
        const idx = Math.floor(pulsePos * (fiber.points.length - 1))
        if (idx < fiber.points.length) {
          const pp = fiber.points[idx]
          const grad2 = ctx.createRadialGradient(pp.x, pp.y, 0, pp.x, pp.y, 4)
          grad2.addColorStop(0, `rgba(255,255,255,${pulseAlpha * 0.4})`)
          grad2.addColorStop(1, `rgba(${fiber.color},0)`)
          ctx.beginPath(); ctx.arc(pp.x, pp.y, 4, 0, Math.PI * 2); ctx.fillStyle = grad2; ctx.fill()
        }
      })

      // Central core glow
      const cx = w / 2, cy = h / 2
      const coreAlpha = 0.03 + Math.sin(time * 0.005) * 0.01
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100)
      coreGrad.addColorStop(0, `rgba(168,85,247,${coreAlpha})`)
      coreGrad.addColorStop(0.5, `rgba(34,211,238,${coreAlpha * 0.5})`)
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.fillStyle = coreGrad; ctx.fill()

      // Gold synthesis ripple
      if (time % 600 > 540) {
        const rippleProgress = (time % 600 - 540) / 60
        const rippleR = rippleProgress * Math.max(w, h) * 0.4
        ctx.beginPath(); ctx.arc(cx, cy, rippleR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(245,178,50,${0.08 * (1 - rippleProgress)})`
        ctx.lineWidth = 1.5; ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative w-full border-t border-white/5" style={{ height: '55vh', minHeight: 450 }}>
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-400/60">Ambient / Refik Layer</h2>
        <p className="text-2xl font-light text-stone-300 mt-1">Soul</p>
        <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">Luminous fiber connectome. Memory pathways pulse. Synthesis ripples gold. The void breathes.</p>
      </div>
      <div className="absolute bottom-6 right-8 z-10 flex gap-4 text-[10px] text-stone-600">
        <span>drift · pulse · bloom · ripple</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
