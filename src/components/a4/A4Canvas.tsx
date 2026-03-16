'use client'
import { useEffect, useRef } from 'react'
import liveData from '@/data/live.json'

// A4v4 — Built from Mashup base (proven stable)
// V4 changes: crossing flashes, token burn meter, rose synthesis, crimson attrition
// A4v3 color palette, A4v2 cognitive architecture, Mashup rendering engine

const COLORS = {
  SYSTEM: '166,107,255',
  WORK: '52,209,231',
  PERSONAL: '255,154,60',
  SYNTHESIS: '255,95,162',   // rose
  ATTRITION: '204,34,68',   // dark crimson
}

const data = liveData as {
  generated: string; totalEntries: number; totalCost: number
  resumeCount: number; teamCount: number; soloCount: number
  projects: { name: string; entries: number; cost: number; domain: string; color: string }[]
  lanes: { name: string; cost: number; entries: number; color: string }[]
  recentEntries: { date: string; title: string; domain: string; project: string; resume: boolean; cost: number; team: string }[]
}

const ORB_COLORS = data.projects.map(p => p.color)

const LANES = [
  { name: 'SYSTEM', color: COLORS.SYSTEM, frac: 0.30 },
  { name: 'WORK', color: COLORS.WORK, frac: 0.55 },
  { name: 'PERSONAL', color: COLORS.PERSONAL, frac: 0.80 },
]

interface FlowP { x:number;y:number;vx:number;vy:number;band:number;alpha:number;alive:boolean;color:string;width:number;glow:number }
interface TrafficP { x:number;y:number;vx:number;vy:number;color:string;size:number;trail:{x:number;y:number}[] }
interface CrossFlash { x:number;y:number;age:number;maxAge:number }
interface Orb { x:number;y:number;vx:number;vy:number;r:number;color:string;alpha:number;phase:number;speed:number }

export default function A4Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flowRef = useRef<FlowP[]>([])
  const trafficRef = useRef<TrafficP[]>([])
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
      // Memory orbs from real project data
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
    const roundedRect=(x:number,y:number,rw:number,rh:number,r:number)=>{
      r=Math.min(r,rw/2,rh/2);ctx.beginPath()
      ctx.moveTo(x+r,y);ctx.arcTo(x+rw,y,x+rw,y+rh,r);ctx.arcTo(x+rw,y+rh,x,y+rh,r)
      ctx.arcTo(x,y+rh,x,y,r);ctx.arcTo(x,y,x+rw,y,r);ctx.closePath()
    }

    const draw=()=>{
      frameRef.current++
      const w=W(),h=H(),t=frameRef.current
      const S=sectRef.current

      // Same clear as Mashup (proven stable)
      ctx.fillStyle='rgba(8,12,24,0.06)'
      ctx.fillRect(0,0,w,h)
      if(t%600===0){ctx.fillStyle='rgba(8,12,24,0.95)';ctx.fillRect(0,0,w,h)}

      const flowMidY=S.rH*0.55
      const STG_X=[0.06,0.22,0.42,0.65,0.88]
      const STG_N=['Prompt','Router','Agent Swarm','Tool Calls','Output']
      const BAND_W=[140,110,70,45,20]

      // ═══ REASON ═══
      // Amber flow band (same opacity as Mashup: 0.018)
      STG_X.forEach((sx,i)=>{
        if(i>=STG_X.length-1)return
        const x1=w*sx,x2=w*STG_X[i+1],bw1=BAND_W[i],bw2=BAND_W[i+1]
        ctx.beginPath()
        ctx.moveTo(x1,flowMidY-bw1/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY-bw1/2,x1+(x2-x1)*0.5,flowMidY-bw2/2,x2,flowMidY-bw2/2)
        ctx.lineTo(x2,flowMidY+bw2/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY+bw2/2,x1+(x2-x1)*0.5,flowMidY+bw1/2,x1,flowMidY+bw1/2)
        ctx.closePath()
        ctx.fillStyle='rgba(245,178,50,0.018)';ctx.fill()
      })

      // Stage labels
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

      // Flow particles — spawn same rate as Mashup
      if(t%5===0){
        const totalE=data.projects.reduce((s,p)=>s+p.entries,0)
        let r=Math.random()*totalE,proj=data.projects[0]
        for(const p of data.projects){r-=p.entries;if(r<=0){proj=p;break}}
        const band=Math.random()
        flowRef.current.push({
          x:w*0.06,y:flowMidY+(band-0.5)*BAND_W[0],
          vx:0.3+Math.random()*0.4,vy:(Math.random()-0.5)*0.12,
          band,alpha:0.8+Math.random()*0.2,alive:true,
          color:proj.domain==='SYSTEM'?COLORS.SYSTEM:proj.domain==='WORK'?COLORS.WORK:COLORS.PERSONAL,
          width:2+Math.random()*3,glow:5+Math.random()*10,
        })
      }

      flowRef.current.forEach(p=>{
        if(!p.alive)return
        p.x+=p.vx
        const pr=p.x/w
        let si=0;for(let i=STG_X.length-1;i>=0;i--){if(pr>=STG_X[i]){si=i;break}}
        const tB=BAND_W[Math.min(si,BAND_W.length-1)]
        const tY=flowMidY+(p.band-0.5)*tB;p.y+=(tY-p.y)*0.02;p.y+=p.vy

        // Attrition (crimson)
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

      // Domain lanes
      LANES.forEach(lane=>{
        const ly=S.sY+S.sH*lane.frac
        ctx.strokeStyle=`rgba(${lane.color},0.1)`;ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(w*0.03,ly);ctx.lineTo(w*0.97,ly);ctx.stroke()
      })

      // Cross streets
      for(let x=w*0.1;x<w*0.95;x+=w*0.1){
        ctx.strokeStyle='rgba(255,255,255,0.015)';ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(x,S.sY+55);ctx.lineTo(x,S.soY-5);ctx.stroke()
      }

      // Traffic dots — with crossing behavior + white flash
      if(t%6===0&&trafficRef.current.length<90){
        // Weighted by real domain costs
        const totalC=data.lanes.reduce((s,l)=>s+l.cost,0)
        let r2=Math.random()*totalC,laneIdx=0
        for(let i=0;i<data.lanes.length;i++){r2-=data.lanes[i].cost;if(r2<=0){laneIdx=i;break}}
        const lane=LANES[laneIdx]
        const ly=S.sY+S.sH*lane.frac
        trafficRef.current.push({
          x:0,y:ly+(Math.random()-0.5)*15,
          vx:(data.lanes[laneIdx].cost/totalC)*2+0.3,vy:(Math.random()-0.5)*0.15,
          color:lane.color,size:2+Math.random()*2.5,trail:[],
        })
      }

      trafficRef.current.forEach(dot=>{
        dot.x+=dot.vx;dot.y+=dot.vy;dot.vy*=0.98
        dot.trail.push({x:dot.x,y:dot.y});if(dot.trail.length>25)dot.trail.shift()

        // Crossing behavior — dots bleed into Reason (up) and Memory (down)
        if(Math.random()<0.004){
          const targets=[
            ...LANES.map(l=>S.sY+S.sH*l.frac),
            flowMidY+(Math.random()-0.5)*60,      // M→R escalation
            S.soY+Math.random()*S.soH*0.5,        // M→S completion
          ]
          const target=targets[Math.floor(Math.random()*targets.length)]
          dot.vy=(target-dot.y)*0.04

          // White flash at crossing point (boundary cost)
          if(target<S.sY||target>S.soY){
            flashRef.current.push({x:dot.x,y:dot.y,age:0,maxAge:25})
          }

          if(target<S.sY)dot.color=COLORS.SYNTHESIS  // rose in reason zone
          else if(target>S.soY)dot.color=ORB_COLORS[Math.floor(Math.random()*ORB_COLORS.length)]
          else { const nl=LANES[Math.floor(Math.random()*LANES.length)];dot.color=nl.color }
        }

        // Trail
        dot.trail.forEach((tr,ti)=>{
          const a=(ti/dot.trail.length)*0.4
          ctx.beginPath();ctx.arc(tr.x,tr.y,dot.size*0.4,0,Math.PI*2)
          ctx.fillStyle=`rgba(${dot.color},${a})`;ctx.fill()
        })

        // Glow + dot
        const g=ctx.createRadialGradient(dot.x,dot.y,0,dot.x,dot.y,dot.size+8)
        g.addColorStop(0,`rgba(${dot.color},0.7)`);g.addColorStop(1,`rgba(${dot.color},0)`)
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size+8,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size,0,Math.PI*2)
        ctx.fillStyle=`rgba(${dot.color},0.9)`;ctx.fill()
      })
      if(t%30===0)trafficRef.current=trafficRef.current.filter(d=>d.x<w+20)

      // ── WHITE CROSSING FLASHES ──
      flashRef.current.forEach(f=>{
        f.age++
        const life=1-f.age/f.maxAge
        const fg=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,12*life)
        fg.addColorStop(0,`rgba(255,255,255,${0.5*life})`);fg.addColorStop(1,'rgba(255,255,255,0)')
        ctx.beginPath();ctx.arc(f.x,f.y,12*life,0,Math.PI*2);ctx.fillStyle=fg;ctx.fill()
      })
      if(t%20===0)flashRef.current=flashRef.current.filter(f=>f.age<f.maxAge)

      // Substations
      LANES.forEach(lane=>{
        const ly=S.sY+S.sH*lane.frac
        for(let x=w*0.14;x<w*0.92;x+=w*0.14){
          const load=Math.sin(t*0.005+x*0.01+ly*0.01)*0.5+0.5
          if(load>0.3){
            const sg=ctx.createRadialGradient(x,ly,0,x,ly,14)
            sg.addColorStop(0,`rgba(${lane.color},${load*0.3})`);sg.addColorStop(1,`rgba(${lane.color},0)`)
            ctx.beginPath();ctx.arc(x,ly,14,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill()
          }
          ctx.beginPath();ctx.arc(x,ly,2.5,0,Math.PI*2)
          ctx.fillStyle=`rgba(${lane.color},${0.2+load*0.5})`;ctx.fill()
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

      // Token Burn meter — simple rect (no roundedRect to avoid path issues)
      const mX=w-235,mY=8,mW=220,mH=42
      const burnLoad=0.55+Math.sin(t*0.001)*0.15
      ctx.fillStyle='rgba(5,10,20,0.5)';ctx.fillRect(mX,mY,mW,mH)
      ctx.fillStyle='rgba(238,246,255,0.7)'
      ctx.font='600 11px -apple-system, sans-serif';ctx.textAlign='left'
      ctx.fillText('Token Burn',mX+12,mY+15)
      ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(mX+12,mY+24,mW-24,8)
      const fillW=(mW-24)*burnLoad
      const barGrad=ctx.createLinearGradient(mX+12,0,mX+12+fillW,0)
      barGrad.addColorStop(0,`rgb(${COLORS.WORK})`);barGrad.addColorStop(0.55,`rgb(${COLORS.PERSONAL})`);barGrad.addColorStop(1,`rgb(${COLORS.SYNTHESIS})`)
      ctx.fillStyle=barGrad;ctx.fillRect(mX+12,mY+24,fillW,8)

      // Data timestamp below meter
      ctx.font='8px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.06)';ctx.textAlign='right'
      ctx.fillText(`data: ${data.generated.split('T')[0]} · ${data.totalEntries} entries`,w-12,mY+mH+14)

      // ═══ LEGEND (bottom) ═══
      const legY=h-42
      ctx.font='9px -apple-system, sans-serif';ctx.textAlign='left'
      const allLegs=[
        {c:COLORS.SYSTEM,l:'system',b:0.5},
        {c:COLORS.WORK,l:'work',b:0.9},
        {c:COLORS.PERSONAL,l:'personal',b:0.7},
        {c:COLORS.SYNTHESIS,l:'synthesis',b:1.2},
        {c:COLORS.ATTRITION,l:'attrition',b:0.6},
        {c:'255,255,255',l:'crossing flash',b:0.4},
      ]
      allLegs.forEach((lg,i)=>{
        const lx=15+i*72
        ctx.beginPath();ctx.arc(lx,legY,3,0,Math.PI*2)
        ctx.fillStyle=`rgba(${lg.c},${0.6*lg.b})`;ctx.fill()
        ctx.fillStyle=`rgba(255,255,255,${0.12+lg.b*0.08})`
        ctx.fillText(lg.l,lx+8,legY+3)
      })

      ctx.font='8px -apple-system, sans-serif';ctx.textAlign='right';ctx.fillStyle='rgba(255,255,255,0.08)'
      ctx.fillText('M→R escalation · R→M decision · M→S complete · S→R recall',w-12,legY+3)

      ctx.font='7px -apple-system, sans-serif';ctx.textAlign='right';ctx.fillStyle='rgba(255,255,255,0.05)'
      ctx.fillText('white flash = boundary crossing cost · color = domain work',w-12,h-8)

      // Synthesis pulse — rose (rare)
      if(t%1000>970){const p=(t%1000-970)/30,r=p*Math.max(w,h)*0.15
      ctx.beginPath();ctx.arc(w/2,h/2,r,0,Math.PI*2)
      ctx.strokeStyle=`rgba(${COLORS.SYNTHESIS},${0.12*(1-p)})`;ctx.lineWidth=1.5;ctx.stroke()}

      animId=requestAnimationFrame(draw)
    }
    draw()
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize)}
  },[])

  return <section className="relative w-full" style={{height:'100vh',minHeight:800}}>
    <canvas ref={canvasRef} className="w-full h-full" />
  </section>
}
