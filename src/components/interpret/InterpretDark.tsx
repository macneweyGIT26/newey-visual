'use client'
import { useEffect, useRef } from 'react'

// PERSONAL WORKBENCH — DARK
// Newey as a city at night. The master metaphor.
// Neighborhoods = projects. Streets = workflows. Power lines = memory.
// Traffic = agents. Buildings = systems. Substations = token reserves.
// Skyline glow = overall activity.

const PROJECTS = [
  { name: 'Newey/System', entries: 9, cost: 57.20, color: '168,85,247', domain: 'SYSTEM' },
  { name: 'F1 Intelligence', entries: 10, cost: 19.55, color: '34,211,238', domain: 'WORK' },
  { name: 'Media Library', entries: 1, cost: 12.00, color: '245,158,11', domain: 'WORK' },
  { name: 'Instagram', entries: 2, cost: 8.40, color: '236,72,153', domain: 'WORK' },
  { name: 'Asset Index', entries: 1, cost: 2.40, color: '16,185,129', domain: 'WORK' },
  { name: 'Grocery List', entries: 1, cost: 0.72, color: '251,146,60', domain: 'PERSONAL' },
  { name: 'Family', entries: 1, cost: 0.70, color: '253,186,116', domain: 'PERSONAL' },
]
const TOTAL_COST = 101.31

interface TrafficDot { x: number; y: number; vx: number; vy: number; color: string; size: number; trail: {x:number;y:number}[] }

export default function InterpretDark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const trafficRef = useRef<TrafficDot[]>([])
  const memoryRef = useRef<{x:number;y:number;vx:number;vy:number;r:number;color:string;alpha:number;phase:number;speed:number}[]>([])
  const initRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2); if (!initRef.current) init() }

    const init = () => {
      initRef.current = true
      const w = W(), h = H()
      // Seed memory orbs
      for (let i = 0; i < 40; i++) {
        const proj = PROJECTS[Math.floor(Math.random() * PROJECTS.length)]
        memoryRef.current.push({
          x: Math.random() * w, y: h * 0.72 + Math.random() * h * 0.25,
          vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.08,
          r: 15 + Math.random() * 50, color: proj.color,
          alpha: 0.04 + Math.random() * 0.08, phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.006,
        })
      }
    }

    resize(); window.addEventListener('resize', resize)

    const draw = () => {
      frameRef.current++
      const w = W(), h = H(), t = frameRef.current

      ctx.fillStyle = 'rgba(6,8,18,0.06)'
      ctx.fillRect(0, 0, w, h)
      if (t % 600 === 0) { ctx.fillStyle = 'rgba(6,8,18,1)'; ctx.fillRect(0, 0, w, h) }

      const skylineY = h * 0.02
      const skylineH = h * 0.32
      const streetY = h * 0.37
      const streetH = h * 0.28
      const memoryY = h * 0.68

      // ═══ SKYLINE: Project buildings at night ═══
      const maxCost = Math.max(...PROJECTS.map(p => p.cost))
      const totalEntries = PROJECTS.reduce((s, p) => s + p.entries, 0)
      const buildingGap = 10
      const usableWidth = w * 0.82
      let bx = w * 0.09

      // Skyline ambient glow
      const skyGrad = ctx.createLinearGradient(0, skylineY + skylineH - 40, 0, skylineY + skylineH + 20)
      skyGrad.addColorStop(0, 'rgba(0,0,0,0)')
      skyGrad.addColorStop(1, 'rgba(245,158,11,0.02)')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, skylineY + skylineH - 40, w, 60)

      PROJECTS.forEach((proj, i) => {
        const bw = Math.max(35, (proj.entries / totalEntries) * usableWidth - buildingGap)
        const bh = (proj.cost / maxCost) * skylineH * 0.85
        const by = skylineY + skylineH - bh
        const pulse = Math.sin(t * 0.008 + i * 1.8) * 0.08

        // Building shadow/depth
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillRect(bx + 3, by + 3, bw, bh)

        // Building body
        ctx.fillStyle = `rgba(${proj.color},${0.25 + pulse})`
        ctx.fillRect(bx, by, bw, bh)

        // Top edge glow
        const topGrad = ctx.createLinearGradient(bx, by - 8, bx, by + 10)
        topGrad.addColorStop(0, `rgba(${proj.color},0)`)
        topGrad.addColorStop(0.5, `rgba(${proj.color},${0.4 + pulse})`)
        topGrad.addColorStop(1, `rgba(${proj.color},0)`)
        ctx.fillStyle = topGrad
        ctx.fillRect(bx - 3, by - 8, bw + 6, 18)

        // Windows — lit and unlit
        const windowRows = Math.min(proj.entries, 8)
        for (let row = 0; row < windowRows; row++) {
          const wy = by + 8 + row * Math.max(8, (bh - 16) / windowRows)
          const windowCount = Math.min(4, Math.ceil(bw / 18))
          for (let wc = 0; wc < windowCount; wc++) {
            const lit = Math.sin(t * 0.015 + row * 3 + wc * 2 + i * 5) > 0
            const wx = bx + 5 + wc * ((bw - 10) / windowCount)
            if (lit) {
              ctx.fillStyle = `rgba(${proj.color},${0.5 + Math.sin(t * 0.02 + row + wc) * 0.2})`
              ctx.fillRect(wx, wy, 5, 3)
              // Window glow
              const wGrad = ctx.createRadialGradient(wx + 2.5, wy + 1.5, 0, wx + 2.5, wy + 1.5, 8)
              wGrad.addColorStop(0, `rgba(${proj.color},0.1)`)
              wGrad.addColorStop(1, `rgba(${proj.color},0)`)
              ctx.fillStyle = wGrad
              ctx.fillRect(wx - 5, wy - 5, 15, 13)
            } else {
              ctx.fillStyle = 'rgba(255,255,255,0.03)'
              ctx.fillRect(wx, wy, 5, 3)
            }
          }
        }

        // Label
        ctx.font = '9px -apple-system, sans-serif'
        ctx.fillStyle = `rgba(${proj.color},0.5)`
        ctx.textAlign = 'center'
        ctx.fillText(proj.name, bx + bw / 2, skylineY + skylineH + 14)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.font = '8px -apple-system, sans-serif'
        ctx.fillText(`$${proj.cost.toFixed(0)}`, bx + bw / 2, skylineY + skylineH + 24)

        bx += bw + buildingGap
      })

      // Ground line
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(w * 0.06, skylineY + skylineH); ctx.lineTo(w * 0.94, skylineY + skylineH); ctx.stroke()

      // ═══ STREET GRID: Token traffic ═══
      // Horizontal streets (domain lanes)
      const lanes = [
        { name: 'SYSTEM', y: streetY + streetH * 0.2, color: '168,85,247', cost: 57.20 },
        { name: 'WORK', y: streetY + streetH * 0.5, color: '34,211,238', cost: 42.67 },
        { name: 'PERSONAL', y: streetY + streetH * 0.8, color: '251,146,60', cost: 1.42 },
      ]

      // Street lines
      lanes.forEach(lane => {
        ctx.strokeStyle = `rgba(${lane.color},0.08)`
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(w * 0.04, lane.y); ctx.lineTo(w * 0.96, lane.y); ctx.stroke()

        // Lane label
        ctx.font = '8px -apple-system, sans-serif'
        ctx.fillStyle = `rgba(${lane.color},0.35)`
        ctx.textAlign = 'left'
        ctx.fillText(`${lane.name} $${lane.cost.toFixed(0)}`, 12, lane.y - 5)
      })

      // Vertical cross-streets (connecting infrastructure)
      for (let x = w * 0.1; x < w * 0.95; x += w * 0.12) {
        ctx.strokeStyle = 'rgba(255,255,255,0.02)'
        ctx.beginPath(); ctx.moveTo(x, streetY); ctx.lineTo(x, streetY + streetH); ctx.stroke()
      }

      // Traffic dots (token energy moving through streets)
      if (t % 8 === 0 && trafficRef.current.length < 60) {
        const lane = lanes[Math.floor(Math.random() * lanes.length)]
        const speed = (lane.cost / TOTAL_COST) * 1.5 + 0.3
        trafficRef.current.push({
          x: 0, y: lane.y + (Math.random() - 0.5) * 12,
          vx: speed, vy: (Math.random() - 0.5) * 0.1,
          color: lane.color, size: 1.5 + Math.random() * 1.5, trail: [],
        })
      }

      trafficRef.current.forEach((dot, i) => {
        dot.x += dot.vx; dot.y += dot.vy
        dot.trail.push({ x: dot.x, y: dot.y }); if (dot.trail.length > 15) dot.trail.shift()

        // Occasionally jump lanes (cross-street)
        if (Math.random() < 0.002) {
          const newLane = lanes[Math.floor(Math.random() * lanes.length)]
          dot.vy = (newLane.y - dot.y) * 0.05
          dot.color = newLane.color
        }
        dot.vy *= 0.98

        // Trail
        dot.trail.forEach((tr, ti) => {
          const a = (ti / dot.trail.length) * 0.3
          ctx.beginPath(); ctx.arc(tr.x, tr.y, dot.size * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${dot.color},${a})`; ctx.fill()
        })

        // Dot with glow
        const grd = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.size + 5)
        grd.addColorStop(0, `rgba(${dot.color},0.6)`); grd.addColorStop(1, `rgba(${dot.color},0)`)
        ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.size + 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill()
        ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dot.color},0.9)`; ctx.fill()
      })

      // Cleanup off-screen traffic
      if (t % 30 === 0) trafficRef.current = trafficRef.current.filter(d => d.x < w + 20)

      // Intersection nodes (substations)
      lanes.forEach(lane => {
        for (let x = w * 0.15; x < w * 0.9; x += w * 0.18) {
          const load = Math.sin(t * 0.005 + x * 0.01 + lane.y * 0.01) * 0.5 + 0.5
          if (load > 0.3) {
            const grd = ctx.createRadialGradient(x, lane.y, 0, x, lane.y, 10)
            grd.addColorStop(0, `rgba(${lane.color},${load * 0.2})`); grd.addColorStop(1, `rgba(${lane.color},0)`)
            ctx.beginPath(); ctx.arc(x, lane.y, 10, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill()
          }
          ctx.beginPath(); ctx.arc(x, lane.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${lane.color},${0.2 + load * 0.4})`; ctx.fill()
        }
      })

      // ═══ MEMORY FIELD: Soul orbs ═══
      const orbs = memoryRef.current
      orbs.forEach(orb => {
        orb.phase += orb.speed
        const bloom = 1 + Math.sin(orb.phase) * 0.15
        orb.x += orb.vx; orb.y += orb.vy
        orb.vx *= 0.999; orb.vy *= 0.999
        if (orb.x < 0) orb.x = w; if (orb.x > w) orb.x = 0
        if (orb.y < memoryY) orb.y = h; if (orb.y > h) orb.y = memoryY

        const r = orb.r * bloom
        const alpha = orb.alpha * (0.7 + Math.sin(orb.phase * 0.5) * 0.3)
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r)
        grad.addColorStop(0, `rgba(${orb.color},${alpha * 2.5})`)
        grad.addColorStop(0.4, `rgba(${orb.color},${alpha})`)
        grad.addColorStop(1, `rgba(${orb.color},0)`)
        ctx.beginPath(); ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
      })

      // Memory threads
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < Math.min(orbs.length, i + 8); j++) {
          const d = Math.hypot(orbs[i].x - orbs[j].x, orbs[i].y - orbs[j].y)
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(orbs[i].x, orbs[i].y); ctx.lineTo(orbs[j].x, orbs[j].y)
            ctx.strokeStyle = `rgba(168,85,247,${(1 - d / 100) * 0.05})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }

      // ═══ SECTION LABELS ═══
      ctx.font = '9px -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.textAlign = 'left'
      ctx.save(); ctx.translate(8, skylineY + skylineH / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('SKYLINE', 0, 0); ctx.restore()
      ctx.save(); ctx.translate(8, streetY + streetH / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('STREETS', 0, 0); ctx.restore()
      ctx.save(); ctx.translate(8, memoryY + (h - memoryY) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('MEMORY', 0, 0); ctx.restore()

      // Section dividers
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(0, streetY - 3); ctx.lineTo(w, streetY - 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, memoryY - 3); ctx.lineTo(w, memoryY - 3); ctx.stroke()

      // Stats
      ctx.font = '10px -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.textAlign = 'right'
      ctx.fillText(`7 projects · 24 entries · $${TOTAL_COST.toFixed(0)} · 18 resume-ready`, w - 12, memoryY + 14)

      // Gold synthesis pulse
      if (t % 700 > 660) {
        const p = (t % 700 - 660) / 40
        const r = p * w * 0.3
        ctx.beginPath(); ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(250,204,21,${0.06 * (1 - p)})`; ctx.lineWidth = 1.5; ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative w-full" style={{ height: '100vh', minHeight: 700 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
