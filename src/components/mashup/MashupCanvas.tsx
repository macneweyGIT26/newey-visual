'use client'
import { useEffect, useRef } from 'react'

// MASHUP — All 3 layers fused into one continuous bleeding canvas
// Top zone: Reason (Minard flow) bleeds into...
// Mid zone: Motion (Street grid + Workbench data) bleeds into...
// Bottom zone: Soul (large luminous orbs, Refik-style)
// NO hard borders. Sections overlap and bleed through each other.

const PROJECTS = [
  { name: 'Newey/System', entries: 9, cost: 57.20, color: '168,85,247' },
  { name: 'F1 Intelligence', entries: 10, cost: 19.55, color: '34,211,238' },
  { name: 'Media Library', entries: 1, cost: 12.00, color: '245,158,11' },
  { name: 'Instagram', entries: 2, cost: 8.40, color: '236,72,153' },
  { name: 'Asset Index', entries: 1, cost: 2.40, color: '16,185,129' },
  { name: 'Grocery List', entries: 1, cost: 0.72, color: '251,146,60' },
  { name: 'Family', entries: 1, cost: 0.70, color: '253,186,116' },
]

const LANES = [
  { name: 'SYSTEM', cost: 57.20, color: '168,85,247', yFrac: 0.42 },
  { name: 'WORK', cost: 42.67, color: '34,211,238', yFrac: 0.52 },
  { name: 'PERSONAL', cost: 1.42, color: '251,146,60', yFrac: 0.60 },
]

const ORB_COLORS = ['34,211,238','168,85,247','251,146,60','253,186,116','250,204,21','196,181,253','147,197,253','236,72,153','16,185,129']

interface FlowP { x:number;y:number;vx:number;vy:number;band:number;alpha:number;alive:boolean;color:string;width:number;glow:number }
interface TrafficP { x:number;y:number;vx:number;vy:number;color:string;size:number;trail:{x:number;y:number}[] }
interface Orb { x:number;y:number;vx:number;vy:number;r:number;color:string;alpha:number;phase:number;speed:number }

export default function MashupCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flowRef = useRef<FlowP[]>([])
  const trafficRef = useRef<TrafficP[]>([])
  const orbsRef = useRef<Orb[]>([])
  const frameRef = useRef(0)
  const initRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2,2)
      if (!initRef.current) initAll()
    }

    const initAll = () => {
      initRef.current = true
      const w = W(), h = H()
      // Seed soul orbs across bottom 45%
      for (let i = 0; i < 50; i++) {
        orbsRef.current.push({
          x: Math.random() * w, y: h * 0.55 + Math.random() * h * 0.45,
          vx: (Math.random()-0.5)*0.12, vy: (Math.random()-0.5)*0.1,
          r: 30 + Math.random() * 90, color: ORB_COLORS[Math.floor(Math.random()*ORB_COLORS.length)],
          alpha: 0.05 + Math.random() * 0.12, phase: Math.random()*Math.PI*2,
          speed: 0.002 + Math.random() * 0.005,
        })
      }
    }

    resize(); window.addEventListener('resize', resize)

    // ── Spawn helpers ──
    const spawnFlow = (w:number, h:number) => {
      const band = Math.random()
      const midY = h * 0.2
      const colors = ['245,178,50','245,178,50','34,211,238','168,85,247']
      flowRef.current.push({
        x: w * 0.06, y: midY + (band-0.5) * 160,
        vx: 0.3 + Math.random()*0.4, vy: (Math.random()-0.5)*0.12,
        band, alpha: 0.8+Math.random()*0.2, alive: true,
        color: colors[Math.floor(Math.random()*colors.length)],
        width: 2 + Math.random()*3, glow: 5 + Math.random()*10,
      })
    }

    const spawnTraffic = (w:number, h:number) => {
      const lane = LANES[Math.floor(Math.random()*LANES.length)]
      trafficRef.current.push({
        x: 0, y: h*lane.yFrac + (Math.random()-0.5)*15,
        vx: (lane.cost/101)*1.8 + 0.3, vy: (Math.random()-0.5)*0.1,
        color: lane.color, size: 2+Math.random()*2, trail: [],
      })
    }

    const draw = () => {
      frameRef.current++
      const w = W(), h = H(), t = frameRef.current

      // Very slow fade — everything bleeds and trails
      ctx.fillStyle = 'rgba(8,12,24,0.05)'
      ctx.fillRect(0,0,w,h)
      if (t % 700 === 0) { ctx.fillStyle = 'rgba(8,12,24,0.95)'; ctx.fillRect(0,0,w,h) }

      const flowMidY = h * 0.2
      const STAGE_X = [0.06, 0.22, 0.42, 0.65, 0.88]
      const STAGE_NAMES = ['Prompt','Router','Agent Swarm','Tool Calls','Output']
      const BAND_W = [160, 120, 80, 50, 25]

      // ═══ ZONE 1: REASON (top, bleeding down) ═══

      // Flow band ghosts
      STAGE_X.forEach((sx,i) => {
        if (i >= STAGE_X.length-1) return
        const x1=w*sx, x2=w*STAGE_X[i+1], bw1=BAND_W[i], bw2=BAND_W[i+1]
        ctx.beginPath()
        ctx.moveTo(x1, flowMidY-bw1/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5, flowMidY-bw1/2, x1+(x2-x1)*0.5, flowMidY-bw2/2, x2, flowMidY-bw2/2)
        ctx.lineTo(x2, flowMidY+bw2/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5, flowMidY+bw2/2, x1+(x2-x1)*0.5, flowMidY+bw1/2, x1, flowMidY+bw1/2)
        ctx.closePath()
        ctx.fillStyle = 'rgba(245,178,50,0.02)'; ctx.fill()
      })

      // Stage labels + grid
      ctx.font = '9px -apple-system, sans-serif'
      ctx.textAlign = 'center'
      STAGE_NAMES.forEach((s,i) => {
        const sx = w * STAGE_X[i]
        ctx.fillStyle = 'rgba(245,178,50,0.2)'; ctx.fillText(s, sx, h*0.33)
        ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.lineWidth=0.5
        ctx.beginPath(); ctx.moveTo(sx, h*0.03); ctx.lineTo(sx, h*0.35); ctx.stroke()
      })

      // Reason label
      ctx.font = '10px -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(245,178,50,0.35)'; ctx.textAlign='left'
      ctx.fillText('EXECUTIVE / MINARD LAYER', 15, h*0.05)
      ctx.font = '22px -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillText('Reason', 15, h*0.09)

      // Spawn + draw flow particles
      if (t % 5 === 0) spawnFlow(w, h)
      flowRef.current.forEach(p => {
        if (!p.alive) return
        p.x += p.vx
        const progress = p.x / w
        let si = 0; for (let i=STAGE_X.length-1;i>=0;i--) { if(progress>=STAGE_X[i]){si=i;break} }
        const targetBand = BAND_W[Math.min(si,BAND_W.length-1)]
        const targetY = flowMidY + (p.band-0.5)*targetBand
        p.y += (targetY-p.y)*0.02; p.y += p.vy

        if (si >= 2 && Math.random() < 0.001) {
          p.alive = false
          const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,10)
          g.addColorStop(0,'rgba(239,68,68,0.6)'); g.addColorStop(1,'rgba(239,68,68,0)')
          ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
          return
        }
        if (p.x > w*0.95) { p.alpha -= 0.02; if(p.alpha<=0) p.alive=false }

        // Glow
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.glow)
        g.addColorStop(0,`rgba(${p.color},${p.alpha*0.5})`); g.addColorStop(1,`rgba(${p.color},0)`)
        ctx.beginPath();ctx.arc(p.x,p.y,p.glow,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
        ctx.beginPath();ctx.arc(p.x,p.y,p.width,0,Math.PI*2)
        ctx.fillStyle=`rgba(${p.color},${p.alpha})`;ctx.fill()
        // Trail
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-20,p.y)
        ctx.strokeStyle=`rgba(${p.color},${p.alpha*0.2})`;ctx.lineWidth=p.width*0.5;ctx.stroke()
      })
      if (t%60===0) flowRef.current = flowRef.current.filter(p=>p.alive)

      // Legend
      ctx.font='9px -apple-system, sans-serif'; ctx.textAlign='left'
      const legY = h*0.345, legX = 15
      const legs = [{c:'245,178,50',l:'token flow'},{c:'34,211,238',l:'secondary'},{c:'168,85,247',l:'supervisory'},{c:'239,68,68',l:'attrition'}]
      legs.forEach((lg,i) => {
        ctx.beginPath();ctx.arc(legX+i*95,legY,3,0,Math.PI*2);ctx.fillStyle=`rgba(${lg.c},0.7)`;ctx.fill()
        ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fillText(lg.l,legX+7+i*95,legY+3)
      })

      // ═══ ZONE 2: MOTION — STREETS (mid, bleeds both ways) ═══

      // Project skyline bar tops (bleeding from above)
      const maxCost = Math.max(...PROJECTS.map(p=>p.cost))
      const totalE = PROJECTS.reduce((s,p)=>s+p.entries,0)
      let bx = w*0.08
      PROJECTS.forEach((proj,i) => {
        const bw = Math.max(30,(proj.entries/totalE)*w*0.82-8)
        const barH = (proj.cost/maxCost)*h*0.08
        const barY = h*0.36 - barH

        ctx.fillStyle = `rgba(${proj.color},0.3)`
        ctx.fillRect(bx, barY, bw, barH)
        // Top glow bleeding upward
        const tg = ctx.createLinearGradient(bx,barY-15,bx,barY+5)
        tg.addColorStop(0,`rgba(${proj.color},0)`); tg.addColorStop(1,`rgba(${proj.color},0.25)`)
        ctx.fillStyle=tg; ctx.fillRect(bx-2,barY-15,bw+4,20)

        ctx.font='8px -apple-system, sans-serif'; ctx.textAlign='center'
        ctx.fillStyle=`rgba(${proj.color},0.5)`; ctx.fillText(proj.name,bx+bw/2,h*0.37+10)
        ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.fillText(`$${proj.cost.toFixed(0)}`,bx+bw/2,h*0.37+20)
        bx += bw + 8
      })

      // Street lanes
      ctx.font='9px -apple-system, sans-serif'; ctx.textAlign='left'
      LANES.forEach(lane => {
        const ly = h*lane.yFrac
        ctx.strokeStyle=`rgba(${lane.color},0.08)`; ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(w*0.03,ly);ctx.lineTo(w*0.97,ly);ctx.stroke()
        ctx.fillStyle=`rgba(${lane.color},0.4)`; ctx.fillText(`${lane.name} $${lane.cost.toFixed(0)}`,10,ly-4)
      })

      // Cross streets
      for (let x=w*0.1;x<w*0.95;x+=w*0.11) {
        ctx.strokeStyle='rgba(255,255,255,0.015)';ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(x,h*0.38);ctx.lineTo(x,h*0.65);ctx.stroke()
      }

      // Streets label
      ctx.font='9px -apple-system, sans-serif'; ctx.fillStyle='rgba(34,211,238,0.3)'; ctx.textAlign='left'
      ctx.save();ctx.translate(8,h*0.52);ctx.rotate(-Math.PI/2);ctx.fillText('STREETS',0,0);ctx.restore()

      // Traffic
      if (t%6===0 && trafficRef.current.length<80) spawnTraffic(w,h)
      trafficRef.current.forEach(dot => {
        dot.x+=dot.vx; dot.y+=dot.vy; dot.vy*=0.98
        dot.trail.push({x:dot.x,y:dot.y}); if(dot.trail.length>20) dot.trail.shift()

        // Lane jumping
        if (Math.random()<0.003) {
          const nl=LANES[Math.floor(Math.random()*LANES.length)]
          dot.vy=(h*nl.yFrac-dot.y)*0.04; dot.color=nl.color
        }

        dot.trail.forEach((tr,ti) => {
          const a=(ti/dot.trail.length)*0.35
          ctx.beginPath();ctx.arc(tr.x,tr.y,dot.size*0.4,0,Math.PI*2)
          ctx.fillStyle=`rgba(${dot.color},${a})`;ctx.fill()
        })

        const g=ctx.createRadialGradient(dot.x,dot.y,0,dot.x,dot.y,dot.size+7)
        g.addColorStop(0,`rgba(${dot.color},0.7)`);g.addColorStop(1,`rgba(${dot.color},0)`)
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size+7,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size,0,Math.PI*2)
        ctx.fillStyle=`rgba(${dot.color},0.9)`;ctx.fill()
      })
      if (t%30===0) trafficRef.current=trafficRef.current.filter(d=>d.x<w+20)

      // Intersection substations
      LANES.forEach(lane => {
        for (let x=w*0.14;x<w*0.92;x+=w*0.16) {
          const load=Math.sin(t*0.005+x*0.01+h*lane.yFrac*0.01)*0.5+0.5
          if (load>0.3) {
            const g=ctx.createRadialGradient(x,h*lane.yFrac,0,x,h*lane.yFrac,12)
            g.addColorStop(0,`rgba(${lane.color},${load*0.25})`);g.addColorStop(1,`rgba(${lane.color},0)`)
            ctx.beginPath();ctx.arc(x,h*lane.yFrac,12,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
          }
          ctx.beginPath();ctx.arc(x,h*lane.yFrac,2.5,0,Math.PI*2)
          ctx.fillStyle=`rgba(${lane.color},${0.2+load*0.5})`;ctx.fill()
        }
      })

      // ═══ ZONE 3: SOUL (bottom, bleeding up into streets) ═══

      // Soul label
      ctx.font='9px -apple-system, sans-serif'; ctx.fillStyle='rgba(168,85,247,0.25)'; ctx.textAlign='left'
      ctx.save();ctx.translate(8,h*0.82);ctx.rotate(-Math.PI/2);ctx.fillText('MEMORY',0,0);ctx.restore()

      const orbs = orbsRef.current
      const cx1 = w*0.35+Math.sin(t*0.001)*60, cy1 = h*0.75+Math.cos(t*0.0012)*30
      const cx2 = w*0.65+Math.cos(t*0.0008)*50, cy2 = h*0.85+Math.sin(t*0.001)*25

      orbs.forEach(orb => {
        orb.phase += orb.speed
        const bloom = 1 + Math.sin(orb.phase)*0.2

        // Attract to clusters
        const d1=Math.hypot(orb.x-cx1,orb.y-cy1), d2=Math.hypot(orb.x-cx2,orb.y-cy2)
        const cx=d1<d2?cx1:cx2, cy=d1<d2?cy1:cy2, dist=Math.min(d1,d2)
        if(dist>50){orb.vx+=(cx-orb.x)*0.000008;orb.vy+=(cy-orb.y)*0.000008}
        if(dist<30){orb.vx-=(cx-orb.x)*0.00002;orb.vy-=(cy-orb.y)*0.00002}
        orb.vx*=0.998;orb.vy*=0.998;orb.x+=orb.vx;orb.y+=orb.vy

        if(orb.x<-orb.r)orb.x=w+orb.r;if(orb.x>w+orb.r)orb.x=-orb.r
        if(orb.y<h*0.5)orb.y=h+orb.r;if(orb.y>h+orb.r)orb.y=h*0.5

        const r=orb.r*bloom
        const alpha=orb.alpha*(0.7+Math.sin(orb.phase*0.5)*0.3)
        const g=ctx.createRadialGradient(orb.x,orb.y,0,orb.x,orb.y,r)
        g.addColorStop(0,`rgba(${orb.color},${alpha*2.5})`)
        g.addColorStop(0.3,`rgba(${orb.color},${alpha*1.5})`)
        g.addColorStop(0.6,`rgba(${orb.color},${alpha*0.5})`)
        g.addColorStop(1,`rgba(${orb.color},0)`)
        ctx.beginPath();ctx.arc(orb.x,orb.y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
      })

      // Memory threads
      for(let i=0;i<orbs.length;i++){
        for(let j=i+1;j<Math.min(orbs.length,i+8);j++){
          const d=Math.hypot(orbs[i].x-orbs[j].x,orbs[i].y-orbs[j].y)
          if(d<110){ctx.beginPath();ctx.moveTo(orbs[i].x,orbs[i].y);ctx.lineTo(orbs[j].x,orbs[j].y)
          ctx.strokeStyle=`rgba(168,85,247,${(1-d/110)*0.05})`;ctx.lineWidth=0.5;ctx.stroke()}
        }
      }

      // Soul state labels
      ctx.font='9px -apple-system, sans-serif'; ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.textAlign='right'
      ctx.fillText('drift · cluster · bloom · ripple', w-12, h-12)

      // Stats
      ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.textAlign='right'; ctx.font='10px -apple-system, sans-serif'
      ctx.fillText('7 projects · 24 entries · $101 · 18 resume-ready', w-12, h*0.66+12)

      // Gold synthesis pulse
      if(t%800>760){const p=(t%800-760)/40;const r=p*Math.max(w,h)*0.25
      ctx.beginPath();ctx.arc(w/2,h*0.6,r,0,Math.PI*2)
      ctx.strokeStyle=`rgba(250,204,21,${0.06*(1-p)})`;ctx.lineWidth=1.5;ctx.stroke()}

      // Sweep wave crossing everything
      if(t%400<45){const wx=(t%400)/45*w
      const sg=ctx.createLinearGradient(wx-40,0,wx+40,0)
      sg.addColorStop(0,'rgba(34,211,238,0)');sg.addColorStop(0.5,'rgba(34,211,238,0.03)');sg.addColorStop(1,'rgba(34,211,238,0)')
      ctx.fillStyle=sg;ctx.fillRect(wx-40,0,80,h)}

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {cancelAnimationFrame(animId);window.removeEventListener('resize',resize)}
  }, [])

  return (
    <section className="relative w-full" style={{height:'100vh',minHeight:800}}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
