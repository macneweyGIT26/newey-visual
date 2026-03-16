'use client'
import { useEffect, useRef } from 'react'

// PERSONAL WORKBENCH — LIGHT
// Newey's self-portrait: the actual work rendered as a living system
// Top: Project skyline (buildings = projects, height = cost/effort)
// Middle: Token flow river (Sankey of spend across domains)
// Bottom: Memory field (soul orbs representing continuity)

// Real data from the tracker
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
const RESUME_COUNT = 18
const TEAM_COUNT = 5
const SOLO_COUNT = 19

export default function InterpretLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2) }
    resize()
    window.addEventListener('resize', resize)
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight

    // Particles flowing between sections
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }[] = []

    const draw = () => {
      frameRef.current++
      const w = W(), h = H(), t = frameRef.current

      ctx.fillStyle = 'rgba(214,211,209,0.06)'
      ctx.fillRect(0, 0, w, h)
      if (t % 500 === 0) { ctx.fillStyle = 'rgba(214,211,209,1)'; ctx.fillRect(0, 0, w, h) }

      const skylineY = h * 0.05
      const skylineH = h * 0.30
      const riverY = h * 0.38
      const riverH = h * 0.25
      const memoryY = h * 0.68
      const memoryH = h * 0.28

      // ═══ SECTION 1: PROJECT SKYLINE ═══
      // Buildings = projects, height proportional to cost, width to entries
      const totalEntries = PROJECTS.reduce((s, p) => s + p.entries, 0)
      const maxCost = Math.max(...PROJECTS.map(p => p.cost))
      const buildingGap = 8
      const totalGap = buildingGap * (PROJECTS.length - 1)
      const usableWidth = w * 0.8
      let bx = w * 0.1

      PROJECTS.forEach((proj, i) => {
        const bw = Math.max(30, (proj.entries / totalEntries) * usableWidth - buildingGap)
        const bh = (proj.cost / maxCost) * skylineH * 0.85
        const by = skylineY + skylineH - bh

        // Building pulse
        const pulse = Math.sin(t * 0.01 + i * 1.5) * 0.05
        const alpha = 0.5 + pulse

        // Building body
        ctx.fillStyle = `rgba(${proj.color},${alpha})`
        ctx.fillRect(bx, by, bw, bh)

        // Building glow at top
        const grad = ctx.createLinearGradient(bx, by, bx, by + 15)
        grad.addColorStop(0, `rgba(${proj.color},${alpha * 0.8})`)
        grad.addColorStop(1, `rgba(${proj.color},0)`)
        ctx.fillStyle = grad
        ctx.fillRect(bx - 2, by - 5, bw + 4, 15)

        // Windows (entry indicators)
        const windowRows = Math.min(proj.entries, 6)
        for (let row = 0; row < windowRows; row++) {
          const wy = by + 10 + row * (bh / (windowRows + 1))
          const windowAlpha = 0.3 + Math.sin(t * 0.02 + row + i) * 0.2
          ctx.fillStyle = `rgba(255,255,255,${windowAlpha})`
          const windowCount = Math.min(3, Math.ceil(bw / 20))
          for (let wc = 0; wc < windowCount; wc++) {
            ctx.fillRect(bx + 6 + wc * (bw / (windowCount + 1)), wy, 4, 3)
          }
        }

        // Label
        ctx.font = '9px -apple-system, sans-serif'
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.textAlign = 'center'
        ctx.fillText(proj.name, bx + bw / 2, skylineY + skylineH + 12)

        // Cost label
        ctx.font = '8px -apple-system, sans-serif'
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillText(`$${proj.cost.toFixed(0)}`, bx + bw / 2, skylineY + skylineH + 22)

        bx += bw + buildingGap
      })

      // Skyline baseline
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(w * 0.08, skylineY + skylineH)
      ctx.lineTo(w * 0.92, skylineY + skylineH)
      ctx.stroke()

      // ═══ SECTION 2: TOKEN FLOW RIVER ═══
      // Horizontal flow: tokens entering left, splitting by domain, narrowing to output
      const riverMid = riverY + riverH / 2

      // Flow bands by domain
      const domains = [
        { name: 'SYSTEM', cost: 57.20, color: '168,85,247', y: riverMid - 30 },
        { name: 'WORK', cost: 42.67, color: '34,211,238', y: riverMid },
        { name: 'PERSONAL', cost: 1.42, color: '251,146,60', y: riverMid + 25 },
      ]

      // Background flow bands
      domains.forEach(d => {
        const bandWidth = (d.cost / TOTAL_COST) * 60
        const flowProgress = (t * 0.5) % w

        // Flowing band
        for (let x = 0; x < w; x += 3) {
          const wave = Math.sin(x * 0.02 + t * 0.01) * 5
          const alpha = 0.05 + Math.sin((x + t * 0.5) * 0.01) * 0.03
          ctx.fillStyle = `rgba(${d.color},${alpha})`
          ctx.fillRect(x, d.y + wave - bandWidth / 2, 2, bandWidth)
        }

        // Moving energy dots
        const dotCount = Math.ceil(d.cost / 5)
        for (let i = 0; i < dotCount; i++) {
          const dx = ((t * 0.8 + i * (w / dotCount)) % w)
          const dy = d.y + Math.sin(dx * 0.015 + i) * 8
          ctx.beginPath()
          ctx.arc(dx, dy, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${d.color},0.6)`
          ctx.fill()
        }
      })

      // Domain labels
      ctx.font = '9px -apple-system, sans-serif'
      ctx.textAlign = 'left'
      domains.forEach(d => {
        ctx.fillStyle = `rgba(${d.color},0.6)`
        ctx.fillText(`${d.name} $${d.cost.toFixed(0)}`, 12, d.y + 3)
      })

      // Flow section label
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.textAlign = 'right'
      ctx.font = '10px -apple-system, sans-serif'
      ctx.fillText('Token Flow →', w - 12, riverY + 14)

      // ═══ SECTION 3: MEMORY / CONTINUITY FIELD ═══
      // Resume entries as persistent orbs, non-resume as fading particles

      // Spawn memory particles
      if (t % 15 === 0 && particles.length < 80) {
        const proj = PROJECTS[Math.floor(Math.random() * PROJECTS.length)]
        particles.push({
          x: Math.random() * w,
          y: memoryY + Math.random() * memoryH,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.1,
          color: proj.color,
          size: 8 + Math.random() * 25,
          alpha: 0.04 + Math.random() * 0.06,
        })
      }

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.999; p.vy *= 0.999
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < memoryY) p.y = memoryY + memoryH; if (p.y > memoryY + memoryH) p.y = memoryY

        const bloom = 1 + Math.sin(t * 0.005 + p.x * 0.01) * 0.15
        const r = p.size * bloom
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        grad.addColorStop(0, `rgba(${p.color},${p.alpha * 2})`)
        grad.addColorStop(0.5, `rgba(${p.color},${p.alpha})`)
        grad.addColorStop(1, `rgba(${p.color},0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = grad; ctx.fill()
      })

      // Threads between nearby memory particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < Math.min(particles.length, i + 10); j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (d < 80) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(168,85,247,${(1 - d / 80) * 0.06})`
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }

      // ═══ STATS OVERLAY ═══
      ctx.font = '11px -apple-system, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      const statsX = w - 15, statsY = memoryY + 15
      ctx.fillText(`${PROJECTS.length} projects · 24 entries · $${TOTAL_COST.toFixed(0)} total`, statsX, statsY)
      ctx.fillText(`${RESUME_COUNT} resume-ready · ${TEAM_COUNT} team / ${SOLO_COUNT} solo`, statsX, statsY + 14)

      // Section dividers
      ctx.strokeStyle = 'rgba(0,0,0,0.05)'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(0, riverY - 5); ctx.lineTo(w, riverY - 5); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, memoryY - 5); ctx.lineTo(w, memoryY - 5); ctx.stroke()

      // Section labels left margin
      ctx.font = '9px -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.textAlign = 'left'
      ctx.save(); ctx.translate(10, skylineY + skylineH / 2); ctx.rotate(-Math.PI / 2)
      ctx.fillText('PROJECTS', 0, 0); ctx.restore()
      ctx.save(); ctx.translate(10, riverY + riverH / 2); ctx.rotate(-Math.PI / 2)
      ctx.fillText('TOKEN FLOW', 0, 0); ctx.restore()
      ctx.save(); ctx.translate(10, memoryY + memoryH / 2); ctx.rotate(-Math.PI / 2)
      ctx.fillText('MEMORY', 0, 0); ctx.restore()

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
