'use client'
import { useEffect, useRef } from 'react'
import liveDataStatic from '@/data/live.json'

// A4 V5 — Heartbeat-driven cognitive visualization
// Motion core from Mashup baseline
// Activity level controls ALL visual intensity
// No agent layer — agents are V6

const LIVE_JSON_URL = 'https://raw.githubusercontent.com/macneweyGIT26/newey-visual/main/src/data/live.json'
const VERSION = 'V5'

const FALLBACK_LANES = [
  { name: 'SYSTEM', cost: 57.20, color: '168,85,247', frac: 0.25 },
  { name: 'WORK',   cost: 42.67, color: '34,211,238',  frac: 0.50 },
  { name: 'PERSONAL', cost: 1.42, color: '251,146,60', frac: 0.75 },
]
const ORB_COLORS = ['34,211,238','168,85,247','251,146,60','253,186,116','250,204,21','196,181,253','147,197,253','236,72,153']

// Heartbeat states derived from activity score
// active: >0.7  moderate: 0.4-0.7  idle: 0.15-0.4  scheduled: 0.05-0.15  sleep: <0.05
function getHeartbeatLabel(act: number): string {
  if (act > 0.7) return 'active'
  if (act > 0.4) return 'moderate'
  if (act > 0.15) return 'idle'
  if (act > 0.05) return 'scheduled'
  return 'sleep'
}

interface LiveData {
  timestamp_edt?: string; tracker_entries?: number; activity_score?: number
  token_spend_today?: number | null; regime?: string; regime_confidence?: number
  lanes?: { name: string; cost: number; entries: number; color: string }[]
}

interface FlowP { x:number;y:number;vx:number;vy:number;band:number;alpha:number;alive:boolean;color:string;width:number;glow:number }
interface TrafficP { x:number;y:number;vx:number;vy:number;color:string;size:number;trail:{x:number;y:number}[] }
interface Orb { x:number;y:number;vx:number;vy:number;r:number;color:string;alpha:number;phase:number;speed:number;baseSpeed:number }

export default function A4Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flowRef = useRef<FlowP[]>([])
  const trafficRef = useRef<TrafficP[]>([])
  const orbsRef = useRef<Orb[]>([])
  const frameRef = useRef(0)
  const initRef = useRef(false)
  const sectionsRef = useRef({reasonH:0,streetY:0,streetH:0,soulY:0,soulH:0})
  const liveRef = useRef<LiveData>(liveDataStatic as LiveData)
  const actRef = useRef(0.3) // start moderate; fetch updates to real value

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight

    const fetchLive = () => {
      fetch(`${LIVE_JSON_URL}?t=${Date.now()}`)
        .then(r => r.json())
        .then((d: LiveData) => {
          liveRef.current = d
          // activity_score from live.json (0-10), normalize to 0-1
          if (d.activity_score != null) {
            actRef.current = Math.max(0.02, Math.min(1.0, d.activity_score / 10))
          } else if (d.tracker_entries != null) {
            actRef.current = Math.max(0.02, Math.min(1.0, d.tracker_entries / 100))
          }
        })
        .catch(() => {})
    }
    fetchLive()
    const liveInterval = setInterval(fetchLive, 5 * 60 * 1000)

    const getLanes = () => {
      const d = liveRef.current
      if (d.lanes && d.lanes.length > 0) {
        return d.lanes.map((l, i) => ({
          name: l.name, cost: l.cost,
          color: FALLBACK_LANES[i]?.color ?? '255,255,255',
          frac: FALLBACK_LANES[i]?.frac ?? (i + 1) / (d.lanes!.length + 1),
        }))
      }
      return FALLBACK_LANES
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth*2; canvas.height = canvas.offsetHeight*2
      ctx.setTransform(2, 0, 0, 2, 0, 0)
      const h = H()
      sectionsRef.current = { reasonH:h*0.33, streetY:h*0.33, streetH:h*0.34, soulY:h*0.67, soulH:h*0.33 }
      if (!initRef.current) initAll()
    }

    const initAll = () => {
      initRef.current = true
      const w = W(), h = H()
      for (let i = 0; i < 50; i++) {
        const baseSpd = 0.002 + Math.random() * 0.005
        orbsRef.current.push({
          x: Math.random()*w, y: h*0.67+Math.random()*h*0.33,
          vx: (Math.random()-0.5)*0.12, vy: (Math.random()-0.5)*0.1,
          r: 25+Math.random()*80,
          color: ORB_COLORS[Math.floor(Math.random()*ORB_COLORS.length)],
          alpha: 0.05+Math.random()*0.12, phase: Math.random()*Math.PI*2,
          speed: baseSpd, baseSpeed: baseSpd,
        })
      }
    }

    resize(); window.addEventListener('resize', resize)

    const draw = () => {
      frameRef.current++
      const w = W(), h = H(), t = frameRef.current
      const S = sectionsRef.current
      const act = actRef.current // 0.02 to 1.0
      const LANES = getLanes()
      const totalCost = Math.max(1, LANES.reduce((s, l) => s + l.cost, 0))
      const live = liveRef.current
      const timestamp = live.timestamp_edt ?? ''
      const entries = live.tracker_entries ?? 0
      const regime = live.regime ?? '—'
      const hbLabel = getHeartbeatLabel(act)

      // === ACTIVITY-DRIVEN PARAMETERS ===
      // Spawn rates: high act = frequent, low act = rare
      const flowRate = Math.max(2, Math.round(20 / (act + 0.1)))      // active:~3 idle:~40 sleep:~170
      const trafficRate = Math.max(3, Math.round(25 / (act + 0.1)))    // active:~4 idle:~50 sleep:~200
      const maxTraffic = Math.max(3, Math.round(90 * act))             // active:90 idle:14 sleep:2
      const flowSpeed = 0.15 + act * 0.35                              // active:0.5 idle:0.27 sleep:0.16
      const crossingChance = 0.001 + act * 0.004                       // active:0.005 idle:0.002 sleep:0.001
      const orbSpeedMult = 0.2 + act * 0.8                             // active:1.0 idle:0.5 sleep:0.22
      const substationBrightness = 0.05 + act * 0.45                   // active:0.5 idle:0.2 sleep:0.06
      const bgClearAlpha = act > 0.15 ? 0.06 : 0.03 + act * 0.2      // sleep: slower trails fade

      ctx.fillStyle = `rgba(8,12,24,${bgClearAlpha})`
      ctx.fillRect(0,0,w,h)
      if (t%600===0) { ctx.fillStyle='rgba(8,12,24,0.95)'; ctx.fillRect(0,0,w,h) }

      // ═══ REASON ═══
      const flowMidY = S.reasonH * 0.55
      const STG_X = [0.06,0.22,0.42,0.65,0.88]
      const STG_N = ['Prompt','Router','Agent Swarm','Tool Calls','Output']
      const BAND_W = [140,110,70,45,20]

      STG_X.forEach((sx,i) => {
        if (i >= STG_X.length-1) return
        const x1=w*sx, x2=w*STG_X[i+1], bw1=BAND_W[i], bw2=BAND_W[i+1]
        ctx.beginPath()
        ctx.moveTo(x1,flowMidY-bw1/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY-bw1/2,x1+(x2-x1)*0.5,flowMidY-bw2/2,x2,flowMidY-bw2/2)
        ctx.lineTo(x2,flowMidY+bw2/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY+bw2/2,x1+(x2-x1)*0.5,flowMidY+bw1/2,x1,flowMidY+bw1/2)
        ctx.closePath()
        ctx.fillStyle=`rgba(245,178,50,${0.008 + act * 0.015})`; ctx.fill()
      })

      ctx.font='9px -apple-system, sans-serif'; ctx.textAlign='center'
      STG_N.forEach((s,i) => {
        const sx=w*STG_X[i]
        ctx.fillStyle=`rgba(245,178,50,${0.08 + act * 0.15})`; ctx.fillText(s,sx,S.reasonH-10)
        ctx.strokeStyle='rgba(255,255,255,0.02)'; ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(sx,10);ctx.lineTo(sx,S.reasonH-15);ctx.stroke()
      })

      ctx.font='10px -apple-system, sans-serif'; ctx.fillStyle=`rgba(245,178,50,${0.15 + act * 0.3})`; ctx.textAlign='left'
      ctx.fillText('THINKING / MINARD LAYER',15,20)
      ctx.font='20px -apple-system, sans-serif'; ctx.fillStyle=`rgba(255,255,255,${0.08 + act * 0.15})`
      ctx.fillText('Reason',15,42)

      // Flow particles — spawn rate driven by activity
      if (t % flowRate === 0) {
        const band = Math.random()
        const col = LANES[Math.floor(Math.random()*LANES.length)].color
        flowRef.current.push({
          x:w*0.06, y:flowMidY+(band-0.5)*BAND_W[0],
          vx:flowSpeed+Math.random()*0.2, vy:(Math.random()-0.5)*0.08,
          band, alpha:(0.5+act*0.5)+Math.random()*0.2, alive:true,
          color:col, width:1.5+Math.random()*2.5, glow:4+Math.random()*8,
        })
      }

      flowRef.current.forEach(p => {
        if (!p.alive) return
        p.x += p.vx
        const progress = p.x/w
        let si=0; for(let i=STG_X.length-1;i>=0;i--){if(progress>=STG_X[i]){si=i;break}}
        const tBand=BAND_W[Math.min(si,BAND_W.length-1)]
        const tY=flowMidY+(p.band-0.5)*tBand
        p.y+=(tY-p.y)*0.02; p.y+=p.vy
        if (si>=2&&Math.random()<0.001) {
          p.alive=false
          const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,10)
          g.addColorStop(0,'rgba(239,68,68,0.6)'); g.addColorStop(1,'rgba(239,68,68,0)')
          ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill(); return
        }
        if (p.x>w*0.95) { p.alpha-=0.02; if(p.alpha<=0) p.alive=false }
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.glow)
        g.addColorStop(0,`rgba(${p.color},${p.alpha*0.5})`); g.addColorStop(1,`rgba(${p.color},0)`)
        ctx.beginPath();ctx.arc(p.x,p.y,p.glow,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
        ctx.beginPath();ctx.arc(p.x,p.y,p.width,0,Math.PI*2)
        ctx.fillStyle=`rgba(${p.color},${p.alpha})`; ctx.fill()
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-15,p.y)
        ctx.strokeStyle=`rgba(${p.color},${p.alpha*0.2})`; ctx.lineWidth=p.width*0.5; ctx.stroke()
      })
      if (t%60===0) flowRef.current=flowRef.current.filter(p=>p.alive)

      // ═══ MOTION ═══
      ctx.font='10px -apple-system, sans-serif'; ctx.fillStyle=`rgba(34,211,238,${0.15 + act * 0.25})`; ctx.textAlign='left'
      ctx.fillText('EXECUTION / STREET LAYER',15,S.streetY+18)
      ctx.font='20px -apple-system, sans-serif'; ctx.fillStyle=`rgba(255,255,255,${0.08 + act * 0.15})`
      ctx.fillText('Motion',15,S.streetY+40)
      ctx.font='8px -apple-system, sans-serif'; ctx.fillStyle=`rgba(255,255,255,${0.06 + act * 0.08})`
      ctx.fillText(`${hbLabel} · ${regime}`,15,S.streetY+54)

      LANES.forEach(lane => {
        const ly = S.streetY + S.streetH * lane.frac
        ctx.strokeStyle=`rgba(${lane.color},${0.03 + act * 0.08})`; ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(w*0.03,ly);ctx.lineTo(w*0.97,ly);ctx.stroke()
      })

      for (let x=w*0.1;x<w*0.95;x+=w*0.1) {
        ctx.strokeStyle=`rgba(255,255,255,${0.005 + act * 0.012})`; ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(x,S.streetY+50);ctx.lineTo(x,S.soulY-5);ctx.stroke()
      }

      // Traffic — activity controls spawn rate, max count, and crossing chance
      if (t % trafficRate === 0 && trafficRef.current.length < maxTraffic) {
        const lane = LANES[Math.floor(Math.random()*LANES.length)]
        const ly = S.streetY + S.streetH * lane.frac
        trafficRef.current.push({
          x:0, y:ly+(Math.random()-0.5)*15,
          vx:((lane.cost/totalCost)*1.5+0.2)*(0.5+act*0.5), vy:(Math.random()-0.5)*0.1,
          color:lane.color, size:1.5+Math.random()*2, trail:[],
        })
      }

      trafficRef.current.forEach(dot => {
        dot.x+=dot.vx; dot.y+=dot.vy; dot.vy*=0.98
        dot.trail.push({x:dot.x,y:dot.y}); if(dot.trail.length>25) dot.trail.shift()
        if (Math.random() < crossingChance) {
          const targets=[
            ...LANES.map(l=>S.streetY+S.streetH*l.frac),
            flowMidY+(Math.random()-0.5)*60,
            S.soulY+Math.random()*S.soulH*0.5,
          ]
          const target=targets[Math.floor(Math.random()*targets.length)]
          dot.vy=(target-dot.y)*0.04
          if(target<S.streetY) dot.color='245,178,50'
          else if(target>S.soulY) dot.color=ORB_COLORS[Math.floor(Math.random()*ORB_COLORS.length)]
          else { const nl=LANES[Math.floor(Math.random()*LANES.length)]; dot.color=nl.color }
        }
        dot.trail.forEach((tr,ti) => {
          const a=(ti/dot.trail.length)*0.35
          ctx.beginPath();ctx.arc(tr.x,tr.y,dot.size*0.4,0,Math.PI*2)
          ctx.fillStyle=`rgba(${dot.color},${a})`; ctx.fill()
        })
        const g=ctx.createRadialGradient(dot.x,dot.y,0,dot.x,dot.y,dot.size+8)
        g.addColorStop(0,`rgba(${dot.color},0.7)`); g.addColorStop(1,`rgba(${dot.color},0)`)
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size+8,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size,0,Math.PI*2)
        ctx.fillStyle=`rgba(${dot.color},0.9)`; ctx.fill()
      })
      if (t%30===0) trafficRef.current=trafficRef.current.filter(d=>d.x<w+20)

      // Substations — brightness driven by activity
      LANES.forEach(lane => {
        const ly = S.streetY + S.streetH * lane.frac
        for (let x=w*0.14;x<w*0.92;x+=w*0.14) {
          const load=Math.sin(t*0.005+x*0.01+ly*0.01)*0.5+0.5
          const vis = load * substationBrightness
          if (vis>0.03) {
            const g=ctx.createRadialGradient(x,ly,0,x,ly,14)
            g.addColorStop(0,`rgba(${lane.color},${vis})`); g.addColorStop(1,`rgba(${lane.color},0)`)
            ctx.beginPath();ctx.arc(x,ly,14,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
          }
          ctx.beginPath();ctx.arc(x,ly,2.5,0,Math.PI*2)
          ctx.fillStyle=`rgba(${lane.color},${0.05+vis*0.8})`; ctx.fill()
        }
      })

      // ═══ MEMORY ═══
      ctx.font='10px -apple-system, sans-serif'; ctx.fillStyle=`rgba(168,85,247,${0.1 + act * 0.2})`; ctx.textAlign='left'
      ctx.fillText('LEARNING / MEMORY LAYER',15,S.soulY+18)
      ctx.font='20px -apple-system, sans-serif'; ctx.fillStyle=`rgba(255,255,255,${0.06 + act * 0.1})`
      ctx.fillText('Memory',15,S.soulY+40)

      const orbs=orbsRef.current
      const cx1=w*0.35+Math.sin(t*0.001*orbSpeedMult)*50, cy1=S.soulY+S.soulH*0.4+Math.cos(t*0.0012*orbSpeedMult)*25
      const cx2=w*0.65+Math.cos(t*0.0008*orbSpeedMult)*40, cy2=S.soulY+S.soulH*0.7+Math.sin(t*0.001*orbSpeedMult)*20

      orbs.forEach(orb => {
        orb.speed = orb.baseSpeed * orbSpeedMult
        orb.phase+=orb.speed
        const bloom=1+Math.sin(orb.phase)*0.2
        const d1=Math.hypot(orb.x-cx1,orb.y-cy1), d2=Math.hypot(orb.x-cx2,orb.y-cy2)
        const cx=d1<d2?cx1:cx2, cy=d1<d2?cy1:cy2, dist=Math.min(d1,d2)
        if(dist>50){orb.vx+=(cx-orb.x)*0.000008*orbSpeedMult;orb.vy+=(cy-orb.y)*0.000008*orbSpeedMult}
        if(dist<30){orb.vx-=(cx-orb.x)*0.00002;orb.vy-=(cy-orb.y)*0.00002}
        orb.vx*=0.998; orb.vy*=0.998; orb.x+=orb.vx; orb.y+=orb.vy
        if(orb.x<-orb.r)orb.x=w+orb.r; if(orb.x>w+orb.r)orb.x=-orb.r
        if(orb.y<S.soulY-20)orb.y=h+orb.r; if(orb.y>h+orb.r)orb.y=S.soulY
        const r=orb.r*bloom
        const alpha=orb.alpha*(0.5+act*0.5)*(0.7+Math.sin(orb.phase*0.5)*0.3)
        const g=ctx.createRadialGradient(orb.x,orb.y,0,orb.x,orb.y,r)
        g.addColorStop(0,`rgba(${orb.color},${alpha*2.5})`)
        g.addColorStop(0.3,`rgba(${orb.color},${alpha*1.5})`)
        g.addColorStop(0.6,`rgba(${orb.color},${alpha*0.5})`)
        g.addColorStop(1,`rgba(${orb.color},0)`)
        ctx.beginPath();ctx.arc(orb.x,orb.y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
      })
      void cy2

      for(let i=0;i<orbs.length;i++){
        for(let j=i+1;j<Math.min(orbs.length,i+8);j++){
          const d=Math.hypot(orbs[i].x-orbs[j].x,orbs[i].y-orbs[j].y)
          if(d<100){ctx.beginPath();ctx.moveTo(orbs[i].x,orbs[i].y);ctx.lineTo(orbs[j].x,orbs[j].y)
          ctx.strokeStyle=`rgba(168,85,247,${(1-d/100)*0.04*orbSpeedMult})`;ctx.lineWidth=0.5;ctx.stroke()}
        }
      }

      // ═══ LEGEND ═══
      const legY = h - 35
      ctx.font='9px -apple-system, sans-serif'; ctx.textAlign='left'
      const allLegs = [
        {c:'168,85,247',l:'system'},{c:'34,211,238',l:'work'},{c:'251,146,60',l:'personal'},
        {c:'250,204,21',l:'synthesis'},{c:'239,68,68',l:'attrition'},
      ]
      allLegs.forEach((lg,i) => {
        const lx=15+i*85
        ctx.beginPath();ctx.arc(lx,legY,3,0,Math.PI*2)
        ctx.fillStyle=`rgba(${lg.c},0.6)`;ctx.fill()
        ctx.fillStyle='rgba(255,255,255,0.2)'
        ctx.fillText(lg.l,lx+8,legY+3)
      })
      ctx.font='8px -apple-system, sans-serif'; ctx.textAlign='right'; ctx.fillStyle='rgba(255,255,255,0.1)'
      ctx.fillText('reason = flow + narrowing  ·  motion = execution  ·  memory = drift + cluster',w-12,legY+3)

      // Dividers
      ctx.strokeStyle='rgba(255,255,255,0.03)'; ctx.lineWidth=0.5
      ctx.beginPath();ctx.moveTo(0,S.streetY);ctx.lineTo(w,S.streetY);ctx.stroke()
      ctx.beginPath();ctx.moveTo(0,S.soulY);ctx.lineTo(w,S.soulY);ctx.stroke()

      // Synthesis pulse — rarer when idle
      const synthCycle = Math.max(400, Math.round(1200 / (act + 0.1)))
      if(t%synthCycle>(synthCycle-40)){const p=(t%synthCycle-(synthCycle-40))/40,r=p*Math.max(w,h)*0.2
      ctx.beginPath();ctx.arc(w/2,h/2,r,0,Math.PI*2)
      ctx.strokeStyle=`rgba(250,204,21,${0.04*(1-p)*act})`;ctx.lineWidth=1.5;ctx.stroke()}

      // Cyan sweep — rarer when idle
      const sweepCycle = Math.max(200, Math.round(800 / (act + 0.1)))
      if(t%sweepCycle<40){const wx=(t%sweepCycle)/40*w
      const sg=ctx.createLinearGradient(wx-40,0,wx+40,0)
      sg.addColorStop(0,'rgba(34,211,238,0)');sg.addColorStop(0.5,`rgba(34,211,238,${0.015+act*0.02})`);sg.addColorStop(1,'rgba(34,211,238,0)')
      ctx.fillStyle=sg;ctx.fillRect(wx-40,0,80,h)}

      // ═══ STATUS LINE ═══
      ctx.font='8px -apple-system, sans-serif'; ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.textAlign='right'
      ctx.fillText(`${timestamp} · ${VERSION} · ${entries} entries · ${hbLabel}`,w-12,15)

      animId=requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize',resize); clearInterval(liveInterval) }
  }, [])

  return (
    <section className="relative w-full" style={{height:'100vh',minHeight:800}}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
