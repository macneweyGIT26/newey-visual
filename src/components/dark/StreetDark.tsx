'use client'
import { useEffect, useRef } from 'react'

// DARK MODE — OPERATIONS / STREET LAYER — MOTION
// Night cityscape. Amber streetlights, cyan data pulses, warm glow nodes.
// Inspired by: aerial night city, F1 timing, terminal warm charcoal

interface Node { x: number; y: number; type: 'junction' | 'substation' | 'pole'; load: number; targetLoad: number }
interface Agent { x: number; y: number; tx: number; ty: number; speed: number; color: string; size: number; trail: {x:number;y:number}[] }
interface Wire { from: number; to: number; pulse: number; active: boolean }

export default function StreetDark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const wiresRef = useRef<Wire[]>([])
  const agentsRef = useRef<Agent[]>([])
  const frameRef = useRef(0)
  const initRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2); if (!initRef.current) initGrid() }

    const initGrid = () => {
      initRef.current = true
      const w = W(), h = H(), nodes: Node[] = [], wires: Wire[] = []
      const cols = 14, rows = 7
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({
            x: (w * 0.06) + (c / (cols - 1)) * (w * 0.88) + (Math.random() - 0.5) * 12,
            y: (h * 0.1) + (r / (rows - 1)) * (h * 0.8) + (Math.random() - 0.5) * 12,
            type: (c === 0 || c === cols - 1) ? 'substation' : (Math.random() < 0.25 ? 'pole' : 'junction'),
            load: 0, targetLoad: 0,
          })
        }
      }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          if (c < cols - 1) wires.push({ from: idx, to: idx + 1, pulse: Math.random(), active: Math.random() < 0.7 })
          if (r < rows - 1) wires.push({ from: idx, to: idx + cols, pulse: Math.random(), active: Math.random() < 0.35 })
          if (c < cols - 1 && r < rows - 1 && Math.random() < 0.12) wires.push({ from: idx, to: idx + cols + 1, pulse: Math.random(), active: true })
        }
      }
      nodesRef.current = nodes; wiresRef.current = wires
    }

    const spawnAgent = () => {
      const nodes = nodesRef.current
      if (nodes.length === 0) return
      const s = nodes[Math.floor(Math.random() * nodes.length)]
      const e = nodes[Math.floor(Math.random() * nodes.length)]
      const colors = ['34,211,238', '245,178,50', '245,178,50', '239,68,68']
      agentsRef.current.push({ x: s.x, y: s.y, tx: e.x, ty: e.y, speed: 0.4 + Math.random() * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)], size: 1.5 + Math.random() * 1.5, trail: [] })
    }

    const getNodeColor = (load: number) => {
      if (load < 0.2) return '100,100,120'
      if (load < 0.5) return '34,211,238'
      if (load < 0.8) return '245,178,50'
      return '239,68,68'
    }

    resize(); window.addEventListener('resize', resize)

    const draw = () => {
      frameRef.current++
      const w = W(), h = H()
      ctx.fillStyle = 'rgba(10,14,26,0.08)'; ctx.fillRect(0, 0, w, h)
      if (frameRef.current % 500 === 0) { ctx.fillStyle = 'rgba(10,14,26,1)'; ctx.fillRect(0, 0, w, h) }

      const nodes = nodesRef.current, wires = wiresRef.current, agents = agentsRef.current
      if (frameRef.current % 15 === 0 && agents.length < 50) spawnAgent()
      if (frameRef.current % 25 === 0) nodes.forEach(n => { n.targetLoad = Math.max(0, Math.min(1, n.targetLoad + (Math.random() - 0.5) * 0.3)) })
      nodes.forEach(n => { n.load += (n.targetLoad - n.load) * 0.03 })

      // Wires
      wires.forEach(wire => {
        const a = nodes[wire.from], b = nodes[wire.to]
        if (!a || !b) return
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = wire.active ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)'; ctx.lineWidth = 0.5; ctx.stroke()
        if (wire.active) {
          wire.pulse = (wire.pulse + 0.005) % 1
          const px = a.x + (b.x - a.x) * wire.pulse, py = a.y + (b.y - a.y) * wire.pulse
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 4)
          grad.addColorStop(0, 'rgba(34,211,238,0.5)'); grad.addColorStop(1, 'rgba(34,211,238,0)')
          ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        }
      })

      // Nodes with glow
      nodes.forEach(n => {
        const col = getNodeColor(n.load)
        const baseSize = n.type === 'substation' ? 4 : n.type === 'pole' ? 2.5 : 2
        if (n.load > 0.2) {
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, baseSize + 12)
          grad.addColorStop(0, `rgba(${col},${n.load * 0.3})`); grad.addColorStop(1, `rgba(${col},0)`)
          ctx.beginPath(); ctx.arc(n.x, n.y, baseSize + 12, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, baseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col},${0.4 + n.load * 0.6})`; ctx.fill()
        if (n.type === 'substation') {
          ctx.strokeStyle = 'rgba(168,85,247,0.25)'; ctx.lineWidth = 0.6
          ctx.beginPath(); ctx.arc(n.x, n.y, baseSize + 5, 0, Math.PI * 2); ctx.stroke()
        }
      })

      // Agents
      agents.forEach(a => {
        const dx = a.tx - a.x, dy = a.ty - a.y, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 3) {
          const n = nodes[Math.floor(Math.random() * nodes.length)]
          a.tx = n.x; a.ty = n.y
          const closest = nodes.reduce((best, nn) => Math.hypot(nn.x - a.x, nn.y - a.y) < Math.hypot(best.x - a.x, best.y - a.y) ? nn : best)
          closest.targetLoad = Math.min(1, closest.targetLoad + 0.25)
        }
        a.x += (dx / dist) * a.speed; a.y += (dy / dist) * a.speed
        a.trail.push({ x: a.x, y: a.y }); if (a.trail.length > 25) a.trail.shift()

        a.trail.forEach((t, ti) => {
          const alpha = (ti / a.trail.length) * 0.25
          ctx.beginPath(); ctx.arc(t.x, t.y, a.size * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${a.color},${alpha})`; ctx.fill()
        })

        // Agent glow
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.size + 6)
        grad.addColorStop(0, `rgba(${a.color},0.5)`); grad.addColorStop(1, `rgba(${a.color},0)`)
        ctx.beginPath(); ctx.arc(a.x, a.y, a.size + 6, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        ctx.beginPath(); ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${a.color},0.9)`; ctx.fill()
      })

      // Sweep wave
      if (frameRef.current % 350 < 50) {
        const waveX = (frameRef.current % 350) / 50 * w
        const grad = ctx.createLinearGradient(waveX - 30, 0, waveX + 30, 0)
        grad.addColorStop(0, 'rgba(34,211,238,0)'); grad.addColorStop(0.5, 'rgba(34,211,238,0.04)'); grad.addColorStop(1, 'rgba(34,211,238,0)')
        ctx.fillStyle = grad; ctx.fillRect(waveX - 30, 0, 60, h)
      }

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative w-full border-t border-white/5" style={{ height: '55vh', minHeight: 450 }}>
      <div className="absolute bottom-6 right-8 z-10 text-[8px] text-stone-700">
        white flash = boundary crossing cost · color = domain work
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
