'use client'
import { useEffect, useRef } from 'react'
import liveData from '@/data/live.json'

// A4v4 — COGNITIVE ARCHITECTURE VISUALIZATION
// White = crossing flash only (cost of boundary transition)
// Colored dots ARE the tokens. Movement IS the burn.
// Crossings: M→R escalation, R→M decision, M→S completion, S→R recall
// Token Burn meter (top right, like Token tab)

const COLORS = {
  SYSTEM: '166,107,255',
  WORK: '52,209,231',
  PERSONAL: '255,154,60',
  SYNTHESIS: '255,95,162',
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

interface FlowP { x:number;y:number;vx:number;vy:number;band:number;alpha:number;alive:boolean;color:string;width:number;glow:number;project:string }
interface LaneDot { x:number;y:number;vx:number;vy:number;color:string;size:number;alpha:number;crossing:boolean }
interface CrossFlash { x:number;y:number;age:number;maxAge:number }
interface Orb { x:number;y:number;vx:number;vy:number;r:number;color:string;alpha:number;phase:number;speed:number }

export default function A4Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flowRef = useRef<FlowP[]>([])
  const laneDotsRef = useRef<LaneDot[]>([])
  const flashRef = useRef<CrossFlash[]>([])
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

    // Helper: rounded rect
    const roundedRect=(x:number,y:number,w:number,h:number,r:number)=>{
      r=Math.min(r,w/2,h/2);ctx.beginPath()
      ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r)
      ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()
    }

    const draw=()=>{
      frameRef.current++
      const w=W(),h=H(),t=frameRef.current
      const S=sectRef.current

      ctx.fillStyle='rgba(8,12,24,0.12)';ctx.fillRect(0,0,w,h)
      if(t%300===0){ctx.fillStyle='rgba(8,12,24,0.98)';ctx.fillRect(0,0,w,h)}

      const flowMidY=S.rH*0.55
      const STG_X=[0.06,0.22,0.42,0.65,0.88]
      const STG_N=['Prompt','Router','Agent Swarm','Tool Calls','Output']
      const BAND_W=[140,110,70,45,20]

      // ═══ REASON ═══
      // Amber Sankey flow band
      STG_X.forEach((sx,i)=>{
        if(i>=STG_X.length-1)return
        const x1=w*sx,x2=w*STG_X[i+1],bw1=BAND_W[i],bw2=BAND_W[i+1]
        ctx.beginPath()
        ctx.moveTo(x1,flowMidY-bw1/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY-bw1/2,x1+(x2-x1)*0.5,flowMidY-bw2/2,x2,flowMidY-bw2/2)
        ctx.lineTo(x2,flowMidY+bw2/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY+bw2/2,x1+(x2-x1)*0.5,flowMidY+bw1/2,x1,flowMidY+bw1/2)
        ctx.closePath()
        ctx.fillStyle=`rgba(${COLORS.PERSONAL},0.018)`;ctx.fill()
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

      // Flow particles
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

      // 3 domain lanes
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

      // ── COLORED LANE PARTICLES + CROSSING BEHAVIOR ──
      if(t%12===0&&laneDotsRef.current.length<60){
        const totalC=data.lanes.reduce((s,l)=>s+l.cost,0)
        let r2=Math.random()*totalC,lane=data.lanes[0],laneIdx=0
        for(let i=0;i<data.lanes.length;i++){r2-=data.lanes[i].cost;if(r2<=0){lane=data.lanes[i];laneIdx=i;break}}
        const domainName=lane.name as keyof typeof laneColorMap
        const ly=S.sY+S.sH*laneFracs[laneIdx]
        const c=laneColorMap[domainName]||COLORS.SYSTEM
        laneDotsRef.current.push({
          x:0,y:ly+(Math.random()-0.5)*18,
          vx:0.15+Math.random()*0.35,vy:0,
          color:c,size:1.2+Math.random()*1.5,alpha:0.4+Math.random()*0.4,
          crossing:false,
        })
      }

      laneDotsRef.current.forEach(dot=>{
        dot.x+=dot.vx;dot.y+=dot.vy;dot.vy*=0.97

        // ── CROSSING EVENTS (rare, meaningful) ──
        if(!dot.crossing&&Math.random()<0.003){
          dot.crossing=true
          // Flash white at crossing point
          flashRef.current.push({x:dot.x,y:dot.y,age:0,maxAge:25})

          if(Math.random()<0.5){
            // M→R: escalation — dot moves up into Reason
            dot.vy=-(S.sY-flowMidY)*0.015
          } else {
            // M→S: completion — dot moves down into Memory
            dot.vy=(S.soY+S.soH*0.5-dot.y)*0.012
          }
        }

        // Draw colored dot
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size,0,Math.PI*2)
        ctx.fillStyle=`rgba(${dot.color},${dot.alpha})`;ctx.fill()
        const dg=ctx.createRadialGradient(dot.x,dot.y,0,dot.x,dot.y,dot.size+4)
        dg.addColorStop(0,`rgba(${dot.color},${dot.alpha*0.3})`);dg.addColorStop(1,`rgba(${dot.color},0)`)
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size+4,0,Math.PI*2);ctx.fillStyle=dg;ctx.fill()
      })
      if(t%30===0)laneDotsRef.current=laneDotsRef.current.filter(d=>d.x<w+10)

      // ── WHITE CROSSING FLASHES ──
      flashRef.current.forEach(f=>{
        f.age++
        const life=1-f.age/f.maxAge
        const fg=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,12*life)
        fg.addColorStop(0,`rgba(255,255,255,${0.6*life})`);fg.addColorStop(1,'rgba(255,255,255,0)')
        ctx.beginPath();ctx.arc(f.x,f.y,12*life,0,Math.PI*2);ctx.fillStyle=fg;ctx.fill()
      })
      if(t%20===0)flashRef.current=flashRef.current.filter(f=>f.age<f.maxAge)

      // Substations (colored, no white)
      laneNames.forEach((ln,i)=>{
        const ly=S.sY+S.sH*laneFracs[i]
        const c=laneColorMap[ln]
        for(let x=w*0.14;x<w*0.92;x+=w*0.14){
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

      // ═══ TOKEN BURN METER (top right, below timestamp) ═══
      const mX=w-235,mY=22,mW=220,mH=42
      const burnLoad=0.55+Math.sin(t*0.001)*0.15
      ctx.save()
      roundedRect(mX,mY,mW,mH,10)
      ctx.fillStyle='rgba(5,10,20,0.5)';ctx.fill()
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.stroke()

      ctx.fillStyle='rgba(238,246,255,0.7)'
      ctx.font='600 11px -apple-system, sans-serif'
      ctx.textAlign='left'
      ctx.fillText('Token Burn',mX+12,mY+15)

      // Bar background
      roundedRect(mX+12,mY+24,mW-24,8,4)
      ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fill()

      // Bar fill — gradient cyan → amber → rose
      const fillW=(mW-24)*burnLoad
      const barGrad=ctx.createLinearGradient(mX+12,0,mX+12+fillW,0)
      barGrad.addColorStop(0,`rgb(${COLORS.WORK})`);barGrad.addColorStop(0.55,`rgb(${COLORS.PERSONAL})`);barGrad.addColorStop(1,`rgb(${COLORS.SYNTHESIS})`)
      roundedRect(mX+12,mY+24,fillW,8,4)
      ctx.fillStyle=barGrad;ctx.fill()
      ctx.restore()

      // Data timestamp (below meter)
      ctx.font='8px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.06)';ctx.textAlign='right'
      ctx.fillText(`data: ${data.generated.split('T')[0]} · ${data.totalEntries} entries`,w-12,mY+mH+14)

      // ═══ LEGEND (bottom) ═══
      const legY = h - 42
      ctx.font='9px -apple-system, sans-serif'; ctx.textAlign='left'
      const allLegs = [
        {c:COLORS.SYSTEM, l:'system', b:0.5},
        {c:COLORS.WORK, l:'work', b:0.9},
        {c:COLORS.PERSONAL, l:'personal', b:0.7},
        {c:COLORS.SYNTHESIS, l:'synthesis', b:1.2},
        {c:COLORS.ATTRITION, l:'attrition', b:0.6},
        {c:'255,255,255', l:'crossing flash', b:0.4},
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
      ctx.fillText('white flash = boundary crossing cost · color = domain work', w-12, h-8)

      // Synthesis pulse — rose convergence (rare)
      if(t%1000>970){const p=(t%1000-970)/30,r=p*Math.max(w,h)*0.15
      ctx.beginPath();ctx.arc(w/2,h/2,r,0,Math.PI*2)
      ctx.strokeStyle=`rgba(${COLORS.SYNTHESIS},${0.15*(1-p)})`;ctx.lineWidth=2;ctx.stroke()}

      animId=requestAnimationFrame(draw)
    }
    draw()
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize)}
  },[])

  return <section className="relative w-full" style={{height:'100vh',minHeight:800}}>
    <canvas ref={canvasRef} className="w-full h-full" />
  </section>
}
