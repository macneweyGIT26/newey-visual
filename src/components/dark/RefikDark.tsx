'use client'
import { useEffect, useRef } from 'react'

// DARK MODE — AMBIENT / REFIK LAYER — SOUL
// Jellyfish-inspired: pulsing bells, trailing tentacles, bioluminescent glow
// Living, breathing memory organisms drifting through void

interface Jellyfish {
  x: number; y: number; vx: number; vy: number
  bellRadius: number; phase: number; pulseSpeed: number
  color: string; secondaryColor: string
  tentacles: number; tentacleLength: number
  alpha: number; rotation: number; rotationSpeed: number
}

const PALETTES = [
  { primary: '100,180,255', secondary: '60,130,220' },    // ice blue
  { primary: '180,120,255', secondary: '140,80,220' },    // violet
  { primary: '255,140,200', secondary: '220,100,170' },   // pink/magenta
  { primary: '80,220,200', secondary: '40,180,170' },     // cyan/teal
  { primary: '255,180,80', secondary: '220,140,50' },     // amber/gold
  { primary: '120,200,255', secondary: '80,160,230' },    // soft blue
  { primary: '200,160,255', secondary: '170,120,240' },   // lavender
  { primary: '255,120,140', secondary: '220,90,110' },    // coral
]

export default function RefikDark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const jelliesRef = useRef<Jellyfish[]>([])
  const frameRef = useRef(0)
  const initRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
      if (!initRef.current) initJellies()
    }

    const initJellies = () => {
      initRef.current = true
      const w = W(), h = H()
      const jellies: Jellyfish[] = []

      // Main organisms
      for (let i = 0; i < 7; i++) {
        const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)]
        jellies.push({
          x: w * 0.15 + Math.random() * w * 0.7,
          y: h * 0.15 + Math.random() * h * 0.7,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.1 - Math.random() * 0.15, // drift upward like real jellyfish
          bellRadius: 25 + Math.random() * 40,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
          color: pal.primary,
          secondaryColor: pal.secondary,
          tentacles: 5 + Math.floor(Math.random() * 6),
          tentacleLength: 60 + Math.random() * 100,
          alpha: 0.4 + Math.random() * 0.4,
          rotation: (Math.random() - 0.5) * 0.3,
          rotationSpeed: (Math.random() - 0.5) * 0.002,
        })
      }

      // Smaller background ones
      for (let i = 0; i < 12; i++) {
        const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)]
        jellies.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.1,
          vy: -0.05 - Math.random() * 0.08,
          bellRadius: 8 + Math.random() * 15,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.015,
          color: pal.primary,
          secondaryColor: pal.secondary,
          tentacles: 3 + Math.floor(Math.random() * 4),
          tentacleLength: 25 + Math.random() * 50,
          alpha: 0.15 + Math.random() * 0.25,
          rotation: (Math.random() - 0.5) * 0.5,
          rotationSpeed: (Math.random() - 0.5) * 0.003,
        })
      }

      jelliesRef.current = jellies
    }

    resize()
    window.addEventListener('resize', resize)

    const drawJellyfish = (j: Jellyfish, time: number) => {
      const pulse = Math.sin(j.phase) * 0.3 // -0.3 to 0.3
      const bellW = j.bellRadius * (1 + pulse * 0.4) // wider on expand
      const bellH = j.bellRadius * 0.7 * (1 - pulse * 0.3) // shorter on expand
      const breathAlpha = j.alpha * (0.7 + Math.sin(j.phase) * 0.3)

      ctx.save()
      ctx.translate(j.x, j.y)
      ctx.rotate(j.rotation)

      // Outer glow aura
      const auraSize = bellW * 2.5
      const auraGrad = ctx.createRadialGradient(0, 0, bellW * 0.3, 0, 0, auraSize)
      auraGrad.addColorStop(0, `rgba(${j.color},${breathAlpha * 0.15})`)
      auraGrad.addColorStop(0.5, `rgba(${j.secondaryColor},${breathAlpha * 0.05})`)
      auraGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(0, 0, auraSize, 0, Math.PI * 2)
      ctx.fillStyle = auraGrad
      ctx.fill()

      // Bell (dome) - top half ellipse
      ctx.beginPath()
      ctx.ellipse(0, 0, bellW, bellH, 0, Math.PI, 0)

      // Bell gradient — brighter at edges like real jellyfish
      const bellGrad = ctx.createRadialGradient(0, -bellH * 0.3, bellW * 0.1, 0, 0, bellW)
      bellGrad.addColorStop(0, `rgba(255,255,255,${breathAlpha * 0.3})`)
      bellGrad.addColorStop(0.3, `rgba(${j.color},${breathAlpha * 0.5})`)
      bellGrad.addColorStop(0.7, `rgba(${j.color},${breathAlpha * 0.7})`)
      bellGrad.addColorStop(1, `rgba(${j.secondaryColor},${breathAlpha * 0.2})`)
      ctx.fillStyle = bellGrad
      ctx.fill()

      // Bell rim glow
      ctx.beginPath()
      ctx.ellipse(0, 0, bellW, bellH, 0, Math.PI, 0)
      ctx.strokeStyle = `rgba(${j.color},${breathAlpha * 0.6})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Inner bell structure lines (radial ribs)
      for (let r = 0; r < 8; r++) {
        const angle = Math.PI + (r / 8) * Math.PI
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * bellW * 0.85, Math.sin(angle) * bellH * 0.85)
        ctx.strokeStyle = `rgba(255,255,255,${breathAlpha * 0.08})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Oral arms (shorter, thicker, near center)
      for (let a = 0; a < 4; a++) {
        const armX = (a - 1.5) * bellW * 0.25
        ctx.beginPath()
        ctx.moveTo(armX, 2)
        const segments = 8
        for (let s = 1; s <= segments; s++) {
          const t = s / segments
          const sx = armX + Math.sin(time * 0.003 + a * 2 + t * 4) * 8 * t
          const sy = 2 + t * bellH * 1.2
          ctx.lineTo(sx, sy)
        }
        ctx.strokeStyle = `rgba(${j.color},${breathAlpha * 0.5})`
        ctx.lineWidth = 2 - 1 * 0.5
        ctx.stroke()
      }

      // Tentacles — flowing, organic, responsive to pulse
      for (let t = 0; t < j.tentacles; t++) {
        const startX = ((t / (j.tentacles - 1)) - 0.5) * bellW * 1.6
        const tentPhase = time * 0.002 + t * 1.5 + j.phase

        ctx.beginPath()
        ctx.moveTo(startX, 2)

        const segs = 20
        let px = startX, py = 2
        for (let s = 1; s <= segs; s++) {
          const progress = s / segs
          // Tentacles trail more when bell contracts, gather when it expands
          const sway = Math.sin(tentPhase + progress * 3) * (12 + progress * 20) * (1 - pulse * 0.5)
          const drift = Math.cos(tentPhase * 0.7 + progress * 2) * 5 * progress
          px = startX + sway + drift
          py = 2 + progress * j.tentacleLength * (1 + pulse * 0.2)
          ctx.lineTo(px, py)
        }

        const tentAlpha = breathAlpha * (0.3 - 0.15 * (t / j.tentacles))
        ctx.strokeStyle = `rgba(${j.color},${tentAlpha})`
        ctx.lineWidth = 1.2 * (1 - 0.3 * (t / j.tentacles))
        ctx.stroke()

        // Glowing tip
        if (Math.random() < 0.3) {
          const tipGrad = ctx.createRadialGradient(px, py, 0, px, py, 3)
          tipGrad.addColorStop(0, `rgba(255,255,255,${breathAlpha * 0.3})`)
          tipGrad.addColorStop(1, `rgba(${j.color},0)`)
          ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2)
          ctx.fillStyle = tipGrad; ctx.fill()
        }
      }

      ctx.restore()
    }

    const draw = () => {
      frameRef.current++
      const w = W(), h = H(), time = frameRef.current

      // Deep void fade
      ctx.fillStyle = 'rgba(3,3,12,0.04)'
      ctx.fillRect(0, 0, w, h)
      if (time % 900 === 0) { ctx.fillStyle = 'rgba(3,3,12,1)'; ctx.fillRect(0, 0, w, h) }

      // Ambient particles (plankton/debris)
      if (time % 3 === 0) {
        const px = Math.random() * w, py = Math.random() * h
        ctx.beginPath(); ctx.arc(px, py, 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100,150,200,${0.05 + Math.random() * 0.08})`
        ctx.fill()
      }

      // Update and draw jellies (back to front — small first)
      const sorted = [...jelliesRef.current].sort((a, b) => a.bellRadius - b.bellRadius)

      sorted.forEach(j => {
        // Pulse
        j.phase += j.pulseSpeed

        // Movement — slight propulsion on contraction
        const pulseForce = Math.cos(j.phase) * 0.05
        j.vy += pulseForce * 0.02 // push up on contract
        j.vx += Math.sin(time * 0.001 + j.x * 0.005) * 0.002 // gentle current

        // Damping
        j.vx *= 0.998; j.vy *= 0.998
        j.x += j.vx; j.y += j.vy
        j.rotation += j.rotationSpeed

        // Wrap
        if (j.y < -j.bellRadius - j.tentacleLength) j.y = h + j.bellRadius
        if (j.y > h + j.bellRadius + 50) j.y = -j.tentacleLength
        if (j.x < -j.bellRadius * 2) j.x = w + j.bellRadius
        if (j.x > w + j.bellRadius * 2) j.x = -j.bellRadius

        drawJellyfish(j, time)
      })

      // Occasional deep glow bloom
      if (time % 400 > 360) {
        const bloomProgress = (time % 400 - 360) / 40
        const bx = w * 0.3 + Math.sin(time * 0.0003) * w * 0.2
        const by = h * 0.5 + Math.cos(time * 0.0004) * h * 0.2
        const bloomR = bloomProgress * 120
        const bloomGrad = ctx.createRadialGradient(bx, by, 0, bx, by, bloomR)
        bloomGrad.addColorStop(0, `rgba(100,180,255,${0.03 * (1 - bloomProgress)})`)
        bloomGrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(bx, by, bloomR, 0, Math.PI * 2)
        ctx.fillStyle = bloomGrad; ctx.fill()
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
        <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">Memory organisms drift through void. Bells pulse with thought. Tentacles trail continuity. Bioluminescence is cognition made visible.</p>
      </div>
      <div className="absolute bottom-6 right-8 z-10 flex gap-4 text-[10px] text-stone-600">
        <span>breathe · drift · pulse · glow</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
