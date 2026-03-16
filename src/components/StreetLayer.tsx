'use client'
import { useEffect, useRef } from 'react'

// OPERATIONS / STREET LAYER — MOTION
// City intelligence grid: wires, agents, congestion, token substations
// Medium speed. Cyan active, orange heavy, red-orange overload.

interface Node {
  x: number; y: number; type: 'junction' | 'substation' | 'pole'
  load: number; targetLoad: number
}

interface Agent {
  x: number; y: number; tx: number; ty: number
  speed: number; color: string; size: number; trail: { x: number; y: number }[]
}

interface Wire { from: number; to: number; pulse: number; active: boolean }

export default function StreetLayer() {
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

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
      if (!initRef.current) initGrid()
    }

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const initGrid = () => {
      initRef.current = true
      const w = W(), h = H()
      const nodes: Node[] = []
      const wires: Wire[] = []

      // Grid of nodes
      const cols = 12, rows = 6
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const jitter = 15
          nodes.push({
            x: (w * 0.08) + (c / (cols - 1)) * (w * 0.84) + (Math.random() - 0.5) * jitter,
            y: (h * 0.12) + (r / (rows - 1)) * (h * 0.76) + (Math.random() - 0.5) * jitter,
            type: (c === 0 || c === cols - 1) ? 'substation' : (Math.random() < 0.3 ? 'pole' : 'junction'),
            load: 0, targetLoad: 0,
          })
        }
      }

      // Connect neighbors
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          if (c < cols - 1) wires.push({ from: idx, to: idx + 1, pulse: 0, active: Math.random() < 0.7 })
          if (r < rows - 1) wires.push({ from: idx, to: idx + cols, pulse: 0, active: Math.random() < 0.4 })
          // Diagonal
          if (c < cols - 1 && r < rows - 1 && Math.random() < 0.15)
            wires.push({ from: idx, to: idx + cols + 1, pulse: 0, active: true })
        }
      }

      nodesRef.current = nodes
      wiresRef.current = wires
    }

    const spawnAgent = () => {
      const nodes = nodesRef.current
      if (nodes.length === 0) return
      const start = nodes[Math.floor(Math.random() * nodes.length)]
      const end = nodes[Math.floor(Math.random() * nodes.length)]
      agentsRef.current.push({
        x: start.x, y: start.y,
        tx: end.x, ty: end.y,
        speed: 0.5 + Math.random() * 1.5,
        color: Math.random() < 0.6 ? 'cyan' : (Math.random() < 0.5 ? 'orange' : 'red'),
        size: 1.5 + Math.random() * 1.5,
        trail: [],
      })
    }

    const getNodeColor = (load: number) => {
      if (load < 0.2) return 'rgba(156,163,175,' // pale grey
      if (load < 0.5) return 'rgba(34,211,238,' // cyan
      if (load < 0.8) return 'rgba(245,158,11,' // orange
      return 'rgba(239,68,68,' // red-orange
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      frameRef.current++
      const w = W(), h = H()
      ctx.clearRect(0, 0, w, h)

      const nodes = nodesRef.current
      const wires = wiresRef.current
      const agents = agentsRef.current

      // Spawn agents
      if (frameRef.current % 20 === 0 && agents.length < 40) spawnAgent()

      // Random load shifts
      if (frameRef.current % 30 === 0) {
        nodes.forEach(n => {
          n.targetLoad = Math.max(0, Math.min(1, n.targetLoad + (Math.random() - 0.5) * 0.3))
        })
      }
      nodes.forEach(n => { n.load += (n.targetLoad - n.load) * 0.03 })

      // Draw wires
      wires.forEach(wire => {
        const a = nodes[wire.from], b = nodes[wire.to]
        if (!a || !b) return

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = wire.active ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.03)'
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Pulse along wire
        if (wire.active) {
          wire.pulse = (wire.pulse + 0.004) % 1
          const px = a.x + (b.x - a.x) * wire.pulse
          const py = a.y + (b.y - a.y) * wire.pulse
          ctx.beginPath()
          ctx.arc(px, py, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(34,211,238,0.3)'
          ctx.fill()
        }
      })

      // Draw nodes
      nodes.forEach(n => {
        const col = getNodeColor(n.load)
        const baseSize = n.type === 'substation' ? 5 : n.type === 'pole' ? 3 : 2.5

        // Glow for loaded nodes
        if (n.load > 0.3) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, baseSize + 6, 0, Math.PI * 2)
          ctx.fillStyle = col + (n.load * 0.15) + ')'
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(n.x, n.y, baseSize, 0, Math.PI * 2)
        ctx.fillStyle = col + (0.3 + n.load * 0.5) + ')'
        ctx.fill()

        // Substation indicator
        if (n.type === 'substation') {
          ctx.strokeStyle = 'rgba(168,85,247,0.3)'
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.arc(n.x, n.y, baseSize + 3, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      // Update & draw agents
      agents.forEach((a, i) => {
        const dx = a.tx - a.x, dy = a.ty - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 3) {
          // Arrived — find new target
          const n = nodes[Math.floor(Math.random() * nodes.length)]
          a.tx = n.x; a.ty = n.y
          // Boost load at arrival node
          const closest = nodes.reduce((best, nn) =>
            Math.hypot(nn.x - a.x, nn.y - a.y) < Math.hypot(best.x - a.x, best.y - a.y) ? nn : best
          )
          closest.targetLoad = Math.min(1, closest.targetLoad + 0.2)
        }

        a.x += (dx / dist) * a.speed
        a.y += (dy / dist) * a.speed
        a.trail.push({ x: a.x, y: a.y })
        if (a.trail.length > 20) a.trail.shift()

        // Trail
        a.trail.forEach((t, ti) => {
          const alpha = (ti / a.trail.length) * 0.3
          ctx.beginPath()
          ctx.arc(t.x, t.y, a.size * 0.4, 0, Math.PI * 2)
          const c = a.color === 'cyan' ? '34,211,238' : a.color === 'orange' ? '245,158,11' : '239,68,68'
          ctx.fillStyle = `rgba(${c},${alpha})`
          ctx.fill()
        })

        // Agent dot
        const c = a.color === 'cyan' ? '34,211,238' : a.color === 'orange' ? '245,158,11' : '239,68,68'
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c},0.8)`
        ctx.fill()
      })

      // Activation wave (periodic)
      if (frameRef.current % 300 < 60) {
        const waveX = (frameRef.current % 300) / 60 * w
        ctx.beginPath()
        ctx.moveTo(waveX, 0); ctx.lineTo(waveX, h)
        ctx.strokeStyle = 'rgba(34,211,238,0.06)'
        ctx.lineWidth = 40
        ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative w-full border-t border-stone-200" style={{ height: '55vh', minHeight: 450 }}>
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400">
          Operations / Street Layer
        </h2>
        <p className="text-2xl font-light text-stone-700 mt-1">Motion</p>
        <p className="text-xs text-stone-400 mt-2 max-w-xs leading-relaxed">
          Agents traverse the intelligence grid. Congestion pulses orange. Token substations glow at edges. Activation waves sweep through.
        </p>
      </div>
      {/* State legend */}
      <div className="absolute bottom-6 right-8 z-10 flex gap-4 text-[10px] text-stone-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> idle</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> active</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> heavy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> overload</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
