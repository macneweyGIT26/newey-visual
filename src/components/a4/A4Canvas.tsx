'use client'
import { useEffect, useRef } from 'react'
import liveData from '@/data/live.json'

// A4v3 — COGNITIVE ARCHITECTURE VISUALIZATION
// Token redesign: white = electricity (support), color = work (primary)
// Synthesis: rose/magenta #FF5FA2 (convergence, distinct from work)
// Colored lane motion: minimal drifting particles per domain
//
// Crossings:
//   Motion → Reason = escalation (needs judgment)
//   Reason → Motion = decision (go/no-go)
//   Motion → Soul = completion (work persists as memory)
//   Soul → Reason = recall (pattern recognition)

const COLORS = {
  SYSTEM: '166,107,255',
  WORK: '52,209,231',
  PERSONAL: '255,154,60',
  SYNTHESIS: '255,95,162',  // rose/magenta #FF5FA2
  ATTRITION: '204,34,68',
  TOKEN: '255,255,255',
}

const data = liveData as {
  generated: string; totalEntries: number; totalCost: number
  resumeCount: number; teamCount: number; soloCount: number
  projects: { name: string; entries: number; cost: number; domain: string; color: string }[]
  lanes: { name: string; cost: number; entries: number; color: string }[]
  recentEntries: { date: string; title: string; domain: string; project: string; resume: boolean; cost: number; team: string }[]
}

const ORB_COLORS = data.projects.map(p => p.color)

interface FlowP { x:number;y:number;vx:number;vy:number;band:number;alpha:number;alive:boolean;color:string;width:number;glow:number;project:string }
interface LaneDot { x:number;y:number;vx:number;color:string;size:number;alpha:number }
interface Orb { x:number;y:number;vx:number;vy:number;r:number;color:string;alpha:number;phase:number;speed:number }

export default function A4Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flowRef = useRef<FlowP[]>([])
  const laneDotsRef = useRef<LaneDot[]>([])
  const orbsRef = useRef<Orb[]>([])
  const frameRef = useRef(0)
  const initRef = useRef(false)
  const sectRef = useRef({rH:0,sY:0,sH:0,soY:0,soH:0})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const W=()=>canvas.offsetWidth, H=()=>canvas.offsetHeight

    const resize=()=>{
      canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;ctx.scale(2,2)
      const h=H()
      sectRef.current={rH:h*0.33,sY:h*0.33,sH:h*0.34,soY:h*0.67,soH:h*0.33}
      if(!initRef.current)initAll()
    }

    const initAll=()=>{
      initRef.current=true
      const w=W(),h=H()
      // Memory orbs — one per project entry, colored by project
      data.projects.forEach(proj => {
        for(let i=0;i<Math.max(2,proj.entries);i++){
          orbsRef.current.push({
            x:Math.random()*w,y:h*0.67+Math.random()*h*0.33,
            vx:(Math.random()-0.5)*0.12,vy:(Math.random()-0.5)*0.1,
            r:15+Math.random()*(20+proj.cost*0.8),
            color:proj.color,
            alpha:0.04+Math.random()*0.1,phase:Math.random()*Math.PI*2,
            speed:0.002+Math.random()*0.005,
          })
        }
      })
    }

    resize();window.addEventListener('resize',resize)

    const draw=()=>{
      frameRef.current++
      const w=W(),h=H(),t=frameRef.current
      const S=sectRef.current

      ctx.fillStyle='rgba(8,12,24,0.06)';ctx.fillRect(0,0,w,h)
      if(t%600===0){ctx.fillStyle='rgba(8,12,24,0.95)';ctx.fillRect(0,0,w,h)}

      const flowMidY=S.rH*0.55
      const STG_X=[0.06,0.22,0.42,0.65,0.88]
      const STG_N=['Prompt','Router','Agent Swarm','Tool Calls','Output']
      const BAND_W=[140,110,70,45,20]

      // ═══ REASON ═══
      STG_X.forEach((sx,i)=>{
        if(i>=STG_X.length-1)return
        const x1=w*sx,x2=w*STG_X[i+1],bw1=BAND_W[i],bw2=BAND_W[i+1]
        ctx.beginPath()
        ctx.moveTo(x1,flowMidY-bw1/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY-bw1/2,x1+(x2-x1)*0.5,flowMidY-bw2/2,x2,flowMidY-bw2/2)
        ctx.lineTo(x2,flowMidY+bw2/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY+bw2/2,x1+(x2-x1)*0.5,flowMidY+bw1/2,x1,flowMidY+bw1/2)
        ctx.closePath()
        ctx.fillStyle=`rgba(${COLORS.SYNTHESIS},0.012)`;ctx.fill()
      })

      ctx.font='9px -apple-system, sans-serif';ctx.textAlign='center'
      STG_N.forEach((s,i)=>{
        const sx=w*STG_X[i]
        ctx.fillStyle=`rgba(${COLORS.SYNTHESIS},0.2)`;ctx.fillText(s,sx,S.rH-10)
        ctx.strokeStyle='rgba(255,255,255,0.02)';ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(sx,10);ctx.lineTo(sx,S.rH-15);ctx.stroke()
      })

      ctx.font='10px -apple-system, sans-serif';ctx.fillStyle=`rgba(${COLORS.SYNTHESIS},0.4)`;ctx.textAlign='left'
      ctx.fillText('THINKING / MINARD LAYER',15,20)
      ctx.font='20px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.2)'
      ctx.fillText('Reason',15,42)
      ctx.font='8px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.15)'
      ctx.fillText('routing · judgment · pruning',15,54)

      // Flow particles — spawn rate proportional to real totalEntries
      const spawnRate = Math.max(2, Math.floor(8 - data.totalEntries/10))
      if(t%spawnRate===0){
        const totalE=data.projects.reduce((s,p)=>s+p.entries,0)
        let r=Math.random()*totalE,proj=data.projects[0]
        for(const p of data.projects){r-=p.entries;if(r<=0){proj=p;break}}

        const band=Math.random()
        flowRef.current.push({
          x:w*0.06,y:flowMidY+(band-0.5)*BAND_W[0],
          vx:0.3+Math.random()*0.4,vy:(Math.random()-0.5)*0.12,
          band,alpha:0.8+Math.random()*0.2,alive:true,
          color:proj.domain==='SYSTEM'?COLORS.SYSTEM:proj.domain==='WORK'?COLORS.WORK:COLORS.PERSONAL,
          width:2+Math.random()*3,glow:5+Math.random()*10,project:proj.name,
        })
      }

      flowRef.current.forEach(p=>{
        if(!p.alive)return;p.x+=p.vx
        const pr=p.x/w
        let si=0;for(let i=STG_X.length-1;i>=0;i--){if(pr>=STG_X[i]){si=i;break}}
        const tB=BAND_W[Math.min(si,BAND_W.length-1)]
        const tY=flowMidY+(p.band-0.5)*tB;p.y+=(tY-p.y)*0.02;p.y+=p.vy

        if(si>=2&&Math.random()<0.001){
          p.alive=false
          const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,10)
          g.addColorStop(0,`rgba(${COLORS.ATTRITION},0.6)`);g.addColorStop(1,`rgba(${COLORS.ATTRITION},0)`)
          ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();return
        }
        if(p.x>w*0.95){p.alpha-=0.02;if(p.alpha<=0)p.alive=false}

        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.glow)
        g.addColorStop(0,`rgba(${p.color},${p.alpha*0.5})`);g.addColorStop(1,`rgba(${p.color},0)`)
        ctx.beginPath();ctx.arc(p.x,p.y,p.glow,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
        ctx.beginPath();ctx.arc(p.x,p.y,p.width,0,Math.PI*2)
        ctx.fillStyle=`rgba(${p.color},${p.alpha})`;ctx.fill()
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-20,p.y)
        ctx.strokeStyle=`rgba(${p.color},${p.alpha*0.2})`;ctx.lineWidth=p.width*0.5;ctx.stroke()
      })
      if(t%60===0)flowRef.current=flowRef.current.filter(p=>p.alive)

      // ═══ MOTION ═══
      ctx.font='10px -apple-system, sans-serif';ctx.fillStyle=`rgba(${COLORS.WORK},0.35)`;ctx.textAlign='left'
      ctx.fillText('EXECUTION / STREET LAYER',15,S.sY+18)
      ctx.font='20px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.2)'
      ctx.fillText('Motion',15,S.sY+40)
      ctx.font='8px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.15)'
      ctx.fillText('token burn · agents · tools',15,S.sY+52)

      // 3 domain lanes (no separate TOKEN lane — white is support only)
      const laneFracs=[0.30,0.55,0.80]
      const laneNames=['SYSTEM','WORK','PERSONAL'] as const
      const laneColorMap={SYSTEM:COLORS.SYSTEM,WORK:COLORS.WORK,PERSONAL:COLORS.PERSONAL}
      const laneAlphaMap={SYSTEM:0.06,WORK:0.14,PERSONAL:0.09}
      laneNames.forEach((ln,i)=>{
        const ly=S.sY+S.sH*laneFracs[i]
        const c=laneColorMap[ln]
        const a=laneAlphaMap[ln]
        ctx.strokeStyle=`rgba(${c},${a})`;ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(w*0.03,ly);ctx.lineTo(w*0.97,ly);ctx.stroke()
      })

      // Cross streets
      for(let x=w*0.1;x<w*0.95;x+=w*0.1){
        ctx.strokeStyle='rgba(255,255,255,0.015)';ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(x,S.sY+55);ctx.lineTo(x,S.soY-5);ctx.stroke()
      }

      // ── COLORED LANE PARTICLES (minimal motion) ──
      // Small colored dots drifting slowly along domain lanes
      if(t%12===0&&laneDotsRef.current.length<60){
        const totalC=data.lanes.reduce((s,l)=>s+l.cost,0)
        let r2=Math.random()*totalC,lane=data.lanes[0],laneIdx=0
        for(let i=0;i<data.lanes.length;i++){r2-=data.lanes[i].cost;if(r2<=0){lane=data.lanes[i];laneIdx=i;break}}
        const domainName=lane.name as keyof typeof laneColorMap
        const ly=S.sY+S.sH*laneFracs[laneIdx]
        const c=laneColorMap[domainName]||COLORS.SYSTEM
        laneDotsRef.current.push({
          x:0,y:ly+(Math.random()-0.5)*18,
          vx:0.15+Math.random()*0.35,
          color:c,size:1.2+Math.random()*1.5,alpha:0.4+Math.random()*0.4,
        })
      }

      laneDotsRef.current.forEach(dot=>{
        dot.x+=dot.vx
        // Draw colored dot
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size,0,Math.PI*2)
        ctx.fillStyle=`rgba(${dot.color},${dot.alpha})`;ctx.fill()
        // Subtle glow
        const dg=ctx.createRadialGradient(dot.x,dot.y,0,dot.x,dot.y,dot.size+4)
        dg.addColorStop(0,`rgba(${dot.color},${dot.alpha*0.3})`);dg.addColorStop(1,`rgba(${dot.color},0)`)
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size+4,0,Math.PI*2);ctx.fillStyle=dg;ctx.fill()
      })
      if(t%30===0)laneDotsRef.current=laneDotsRef.current.filter(d=>d.x<w+10)

      // ── TOKEN SIGNALS (white as support, not traffic) ──

      // A. Intersection pulses — where cross streets meet lane lines
      laneNames.forEach((ln,i)=>{
        const ly=S.sY+S.sH*laneFracs[i]
        for(let x=w*0.1;x<w*0.95;x+=w*0.1){
          // Pulse when colored traffic is nearby
          const hasTraffic=laneDotsRef.current.some(d=>Math.abs(d.x-x)<30&&Math.abs(d.y-ly)<25)
          if(hasTraffic){
            const pulse=Math.sin(t*0.02+x*0.005)*0.5+0.5
            if(pulse>0.4){
              const pg=ctx.createRadialGradient(x,ly,0,x,ly,8)
              pg.addColorStop(0,`rgba(255,255,255,${0.15*pulse})`);pg.addColorStop(1,'rgba(255,255,255,0)')
              ctx.beginPath();ctx.arc(x,ly,8,0,Math.PI*2);ctx.fillStyle=pg;ctx.fill()
            }
          }
          // Substation dot (colored)
          const c=laneColorMap[ln]
          const load=Math.sin(t*0.005+x*0.01+ly*0.01)*0.5+0.5
          if(load>0.3){
            const sg=ctx.createRadialGradient(x,ly,0,x,ly,12)
            sg.addColorStop(0,`rgba(${c},${load*0.25})`);sg.addColorStop(1,`rgba(${c},0)`)
            ctx.beginPath();ctx.arc(x,ly,12,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill()
          }
          ctx.beginPath();ctx.arc(x,ly,2,0,Math.PI*2)
          ctx.fillStyle=`rgba(${c},${0.12+load*0.35})`;ctx.fill()
        }
      })

      // B. Lane shimmer — faint white overlay on active lanes, intensity ∝ traffic density
      laneNames.forEach((ln,i)=>{
        const ly=S.sY+S.sH*laneFracs[i]
        const trafficCount=laneDotsRef.current.filter(d=>Math.abs(d.y-ly)<25).length
        if(trafficCount>0){
          const shimmerAlpha=Math.min(0.04,trafficCount*0.008)
          const shimmerPhase=Math.sin(t*0.003+i*2)*0.5+0.5
          ctx.strokeStyle=`rgba(255,255,255,${shimmerAlpha*shimmerPhase})`
          ctx.lineWidth=12
          ctx.beginPath();ctx.moveTo(w*0.03,ly);ctx.lineTo(w*0.97,ly);ctx.stroke()
        }
      })

      // C. Current travel — subtle short white streaks along colored traffic direction
      laneDotsRef.current.forEach(dot=>{
        if(Math.random()<0.3){
          ctx.beginPath()
          ctx.moveTo(dot.x-6,dot.y)
          ctx.lineTo(dot.x+2,dot.y)
          ctx.strokeStyle=`rgba(255,255,255,${0.08+Math.random()*0.12})`
          ctx.lineWidth=0.5
          ctx.stroke()
        }
      })

      // ═══ MEMORY ═══
      ctx.font='10px -apple-system, sans-serif';ctx.fillStyle=`rgba(${COLORS.SYNTHESIS},0.3)`;ctx.textAlign='left'
      ctx.fillText('LEARNING / REFIK LAYER',15,S.soY+18)
      ctx.font='20px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.15)'
      ctx.fillText('Memory',15,S.soY+40)
      ctx.font='8px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.12)'
      ctx.fillText('identity · memory · pattern',15,S.soY+52)

      const orbs=orbsRef.current
      const cx1=w*0.35+Math.sin(t*0.001)*50,cy1=S.soY+S.soH*0.4+Math.cos(t*0.0012)*25
      const cx2=w*0.65+Math.cos(t*0.0008)*40,cy2=S.soY+S.soH*0.7+Math.sin(t*0.001)*20

      orbs.forEach(orb=>{
        orb.phase+=orb.speed;const bloom=1+Math.sin(orb.phase)*0.2
        const d1=Math.hypot(orb.x-cx1,orb.y-cy1),d2=Math.hypot(orb.x-cx2,orb.y-cy2)
        const cx=d1<d2?cx1:cx2,cy=d1<d2?cy1:cy2,dist=Math.min(d1,d2)
        if(dist>50){orb.vx+=(cx-orb.x)*0.000008;orb.vy+=(cy-orb.y)*0.000008}
        if(dist<30){orb.vx-=(cx-orb.x)*0.00002;orb.vy-=(cy-orb.y)*0.00002}
        orb.vx*=0.998;orb.vy*=0.998;orb.x+=orb.vx;orb.y+=orb.vy
        if(orb.x<-orb.r)orb.x=w+orb.r;if(orb.x>w+orb.r)orb.x=-orb.r
        if(orb.y<S.soY-20)orb.y=h+orb.r;if(orb.y>h+orb.r)orb.y=S.soY

        const r=orb.r*bloom,alpha=orb.alpha*(0.7+Math.sin(orb.phase*0.5)*0.3)
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
          if(d<100){ctx.beginPath();ctx.moveTo(orbs[i].x,orbs[i].y);ctx.lineTo(orbs[j].x,orbs[j].y)
          ctx.strokeStyle=`rgba(${COLORS.SYSTEM},${(1-d/100)*0.05})`;ctx.lineWidth=0.5;ctx.stroke()}
        }
      }

      ctx.font='9px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.08)';ctx.textAlign='right'
      ctx.fillText('drift · cluster · bloom · ripple',w-12,h-10)

      // Section dividers
      ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5
      ctx.beginPath();ctx.moveTo(0,S.sY);ctx.lineTo(w,S.sY);ctx.stroke()
      ctx.beginPath();ctx.moveTo(0,S.soY);ctx.lineTo(w,S.soY);ctx.stroke()

      // ═══ LEGEND (bottom) ═══
      const legY = h - 42
      ctx.font='9px -apple-system, sans-serif'; ctx.textAlign='left'
      const allLegs = [
        {c:COLORS.SYSTEM, l:'system', b:0.5},
        {c:COLORS.WORK, l:'work', b:0.9},
        {c:COLORS.PERSONAL, l:'personal', b:0.7},
        {c:COLORS.SYNTHESIS, l:'synthesis', b:1.2},
        {c:COLORS.ATTRITION, l:'attrition', b:0.6},
        {c:'255,255,255', l:'tokens (current)', b:0.4},
      ]
      const legStartX = 15
      allLegs.forEach((lg,i) => {
        const lx = legStartX + i * 72
        ctx.beginPath(); ctx.arc(lx, legY, 3, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${lg.c},${0.6*lg.b})`; ctx.fill()
        ctx.fillStyle = `rgba(255,255,255,${0.12+lg.b*0.08})`
        ctx.fillText(lg.l, lx + 8, legY + 3)
      })

      // Crossing behaviors right-aligned
      ctx.font='8px -apple-system, sans-serif'; ctx.textAlign='right'; ctx.fillStyle='rgba(255,255,255,0.08)'
      ctx.fillText('M→R escalation · R→M decision · M→S complete · S→R recall', w-12, legY+3)
      
      // Subtitle
      ctx.font='7px -apple-system, sans-serif'; ctx.textAlign='right'; ctx.fillStyle='rgba(255,255,255,0.05)'
      ctx.fillText('synthesis = convergence · white = compute energy · color = domain work', w-12, h-8)

      // Data timestamp
      ctx.font='8px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.06)';ctx.textAlign='right'
      ctx.fillText(`data: ${data.generated.split('T')[0]} · ${data.totalEntries} entries`,w-12,15)

      // Synthesis pulse — rose convergence signal (rare, distinct)
      if(t%1000>970){const p=(t%1000-970)/30,r=p*Math.max(w,h)*0.15
      ctx.beginPath();ctx.arc(w/2,h/2,r,0,Math.PI*2)
      ctx.strokeStyle=`rgba(${COLORS.SYNTHESIS},${0.15*(1-p)})`;ctx.lineWidth=2;ctx.stroke()}

      // Work sweep — cyan activity signal
      if(t%500<35){const wx=(t%500)/35*w
      const sg=ctx.createLinearGradient(wx-30,0,wx+30,0)
      sg.addColorStop(0,`rgba(${COLORS.WORK},0)`);sg.addColorStop(0.5,`rgba(${COLORS.WORK},0.04)`);sg.addColorStop(1,`rgba(${COLORS.WORK},0)`)
      ctx.fillStyle=sg;ctx.fillRect(wx-30,0,60,h)}

      animId=requestAnimationFrame(draw)
    }
    draw()
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize)}
  },[])

  return <section className="relative w-full" style={{height:'100vh',minHeight:800}}>
    <canvas ref={canvasRef} className="w-full h-full" />
  </section>
}
