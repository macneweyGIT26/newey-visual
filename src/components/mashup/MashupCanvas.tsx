'use client'
import { useEffect, useRef } from 'react'

// MASHUP v2 — 3 clear sections, no buildings
// Top: Reason (dark mode Minard flow) — labels + data only
// Mid: Streets (Workbench Dark traffic) — balls shooting across + between zones
// Bottom: Soul (dark mode orbs) — amorphous, clustering
// Traffic dots bleed into upper and lower sections

const PROJECTS = [
  { name: 'Newey/System', cost: 57.20, color: '168,85,247' },
  { name: 'F1 Intelligence', cost: 19.55, color: '34,211,238' },
  { name: 'Media Library', cost: 12.00, color: '245,158,11' },
  { name: 'Instagram', cost: 8.40, color: '236,72,153' },
  { name: 'Asset Index', cost: 2.40, color: '16,185,129' },
  { name: 'Grocery List', cost: 0.72, color: '251,146,60' },
  { name: 'Family', cost: 0.70, color: '253,186,116' },
]

const LANES = [
  { name: 'SYSTEM', cost: 57.20, color: '168,85,247', frac: 0.25 },
  { name: 'WORK', cost: 42.67, color: '34,211,238', frac: 0.50 },
  { name: 'PERSONAL', cost: 1.42, color: '251,146,60', frac: 0.75 },
]

const ORB_COLORS = ['34,211,238','168,85,247','251,146,60','253,186,116','250,204,21','196,181,253','147,197,253','236,72,153']

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
  const sectionsRef = useRef({reasonH:0,streetY:0,streetH:0,soulY:0,soulH:0})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight

    const resize = () => {
      canvas.width = canvas.offsetWidth*2; canvas.height = canvas.offsetHeight*2; ctx.scale(2,2)
      const h = H()
      sectionsRef.current = { reasonH: h*0.33, streetY: h*0.33, streetH: h*0.34, soulY: h*0.67, soulH: h*0.33 }
      if (!initRef.current) initAll()
    }

    const initAll = () => {
      initRef.current = true
      const w = W(), h = H()
      for (let i=0;i<50;i++) {
        orbsRef.current.push({
          x: Math.random()*w, y: h*0.67+Math.random()*h*0.33,
          vx: (Math.random()-0.5)*0.12, vy: (Math.random()-0.5)*0.1,
          r: 25+Math.random()*80, color: ORB_COLORS[Math.floor(Math.random()*ORB_COLORS.length)],
          alpha: 0.05+Math.random()*0.12, phase: Math.random()*Math.PI*2,
          speed: 0.002+Math.random()*0.005,
        })
      }
    }

    resize(); window.addEventListener('resize', resize)

    const draw = () => {
      frameRef.current++
      const w = W(), h = H(), t = frameRef.current
      const S = sectionsRef.current

      ctx.fillStyle = 'rgba(8,12,24,0.06)'
      ctx.fillRect(0,0,w,h)
      if (t%600===0) { ctx.fillStyle = 'rgba(8,12,24,0.95)'; ctx.fillRect(0,0,w,h) }

      // ═══════════════════════════════════════════
      // SECTION 1: REASON (top third)
      // ═══════════════════════════════════════════
      const flowMidY = S.reasonH * 0.55
      const STAGE_X = [0.06,0.22,0.42,0.65,0.88]
      const STAGE_NAMES = ['Prompt','Router','Agent Swarm','Tool Calls','Output']
      const BAND_W = [140,110,70,45,20]

      // Flow band ghosts
      STAGE_X.forEach((sx,i) => {
        if(i>=STAGE_X.length-1) return
        const x1=w*sx,x2=w*STAGE_X[i+1],bw1=BAND_W[i],bw2=BAND_W[i+1]
        ctx.beginPath()
        ctx.moveTo(x1,flowMidY-bw1/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY-bw1/2,x1+(x2-x1)*0.5,flowMidY-bw2/2,x2,flowMidY-bw2/2)
        ctx.lineTo(x2,flowMidY+bw2/2)
        ctx.bezierCurveTo(x1+(x2-x1)*0.5,flowMidY+bw2/2,x1+(x2-x1)*0.5,flowMidY+bw1/2,x1,flowMidY+bw1/2)
        ctx.closePath()
        ctx.fillStyle='rgba(245,178,50,0.018)';ctx.fill()
      })

      // Stage labels + dividers
      ctx.font='9px -apple-system, sans-serif'; ctx.textAlign='center'
      STAGE_NAMES.forEach((s,i) => {
        const sx=w*STAGE_X[i]
        ctx.fillStyle='rgba(245,178,50,0.2)'; ctx.fillText(s,sx,S.reasonH-10)
        ctx.strokeStyle='rgba(255,255,255,0.02)'; ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(sx,10);ctx.lineTo(sx,S.reasonH-15);ctx.stroke()
      })

      // Reason label
      ctx.font='10px -apple-system, sans-serif'; ctx.fillStyle='rgba(245,178,50,0.4)'; ctx.textAlign='left'
      ctx.fillText('EXECUTIVE / MINARD LAYER',15,20)
      ctx.font='20px -apple-system, sans-serif'; ctx.fillStyle='rgba(255,255,255,0.2)'
      ctx.fillText('Reason',15,42)

      // Reason legend
      ctx.font='8px -apple-system, sans-serif'; ctx.textAlign='left'
      const legs=[{c:'245,178,50',l:'token flow'},{c:'34,211,238',l:'secondary'},{c:'168,85,247',l:'supervisory'},{c:'239,68,68',l:'attrition'}]
      legs.forEach((lg,i)=>{
        ctx.beginPath();ctx.arc(15+i*90,S.reasonH-28,2.5,0,Math.PI*2)
        ctx.fillStyle=`rgba(${lg.c},0.7)`;ctx.fill()
        ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillText(lg.l,22+i*90,S.reasonH-25)
      })

      // Spawn flow particles
      if(t%5===0){
        const band=Math.random()
        const colors=['245,178,50','245,178,50','34,211,238','168,85,247']
        flowRef.current.push({
          x:w*0.06,y:flowMidY+(band-0.5)*BAND_W[0],
          vx:0.3+Math.random()*0.4,vy:(Math.random()-0.5)*0.12,
          band,alpha:0.8+Math.random()*0.2,alive:true,
          color:colors[Math.floor(Math.random()*colors.length)],
          width:2+Math.random()*3,glow:5+Math.random()*10,
        })
      }

      flowRef.current.forEach(p=>{
        if(!p.alive)return
        p.x+=p.vx
        const progress=p.x/w
        let si=0;for(let i=STAGE_X.length-1;i>=0;i--){if(progress>=STAGE_X[i]){si=i;break}}
        const tBand=BAND_W[Math.min(si,BAND_W.length-1)]
        const tY=flowMidY+(p.band-0.5)*tBand
        p.y+=(tY-p.y)*0.02;p.y+=p.vy

        if(si>=2&&Math.random()<0.001){
          p.alive=false
          const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,10)
          g.addColorStop(0,'rgba(239,68,68,0.6)');g.addColorStop(1,'rgba(239,68,68,0)')
          ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
          return
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
      if(t%60===0) flowRef.current=flowRef.current.filter(p=>p.alive)

      // ═══════════════════════════════════════════
      // SECTION 2: STREETS (middle third)
      // ═══════════════════════════════════════════

      // Section label
      ctx.font='10px -apple-system, sans-serif'; ctx.fillStyle='rgba(34,211,238,0.35)'; ctx.textAlign='left'
      ctx.fillText('OPERATIONS / STREET LAYER',15,S.streetY+18)
      ctx.font='20px -apple-system, sans-serif'; ctx.fillStyle='rgba(255,255,255,0.2)'
      ctx.fillText('Motion',15,S.streetY+40)

      // Project labels across the top of streets (no buildings — just text)
      ctx.font='8px -apple-system, sans-serif'; ctx.textAlign='center'
      const projSpacing = w*0.84 / PROJECTS.length
      PROJECTS.forEach((proj,i) => {
        const px = w*0.08 + i*projSpacing + projSpacing/2
        ctx.fillStyle=`rgba(${proj.color},0.5)`; ctx.fillText(proj.name,px,S.streetY+55)
        // no cost labels
        // Thin vertical marker
        ctx.strokeStyle=`rgba(${proj.color},0.06)`;ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(px,S.streetY+68);ctx.lineTo(px,S.soulY-5);ctx.stroke()
      })

      // Domain lanes
      LANES.forEach(lane => {
        const ly = S.streetY + S.streetH * lane.frac
        ctx.strokeStyle=`rgba(${lane.color},0.1)`;ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(w*0.03,ly);ctx.lineTo(w*0.97,ly);ctx.stroke()
        ctx.font='9px -apple-system, sans-serif';ctx.textAlign='left'
        ctx.fillStyle=`rgba(${lane.color},0.45)`;ctx.fillText(lane.name,10,ly-5)
      })

      // Cross-streets
      for(let x=w*0.1;x<w*0.95;x+=w*0.1){
        ctx.strokeStyle='rgba(255,255,255,0.015)';ctx.lineWidth=0.5
        ctx.beginPath();ctx.moveTo(x,S.streetY+50);ctx.lineTo(x,S.soulY-5);ctx.stroke()
      }

      // Traffic dots — these BLEED into reason (up) and soul (down)
      if(t%6===0 && trafficRef.current.length<90){
        const lane=LANES[Math.floor(Math.random()*LANES.length)]
        const ly = S.streetY + S.streetH * lane.frac
        trafficRef.current.push({
          x:0,y:ly+(Math.random()-0.5)*15,
          vx:(lane.cost/101)*2+0.3,vy:(Math.random()-0.5)*0.15,
          color:lane.color,size:2+Math.random()*2.5,trail:[],
        })
      }

      trafficRef.current.forEach(dot=>{
        dot.x+=dot.vx;dot.y+=dot.vy;dot.vy*=0.98
        dot.trail.push({x:dot.x,y:dot.y});if(dot.trail.length>25) dot.trail.shift()

        // Lane jumping — allows bleeding into reason or soul zones
        if(Math.random()<0.004){
          const targets=[
            ...LANES.map(l=>S.streetY+S.streetH*l.frac),
            flowMidY + (Math.random()-0.5)*60,  // bleed into reason
            S.soulY + Math.random()*S.soulH*0.5, // bleed into soul
          ]
          const target=targets[Math.floor(Math.random()*targets.length)]
          dot.vy=(target-dot.y)*0.04
          if(target<S.streetY) dot.color='245,178,50' // gold in reason zone
          else if(target>S.soulY) dot.color=ORB_COLORS[Math.floor(Math.random()*ORB_COLORS.length)]
          else { const nl=LANES[Math.floor(Math.random()*LANES.length)];dot.color=nl.color }
        }

        // Trail
        dot.trail.forEach((tr,ti)=>{
          const a=(ti/dot.trail.length)*0.4
          ctx.beginPath();ctx.arc(tr.x,tr.y,dot.size*0.4,0,Math.PI*2)
          ctx.fillStyle=`rgba(${dot.color},${a})`;ctx.fill()
        })

        // Glow
        const g=ctx.createRadialGradient(dot.x,dot.y,0,dot.x,dot.y,dot.size+8)
        g.addColorStop(0,`rgba(${dot.color},0.7)`);g.addColorStop(1,`rgba(${dot.color},0)`)
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size+8,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.size,0,Math.PI*2)
        ctx.fillStyle=`rgba(${dot.color},0.9)`;ctx.fill()
      })
      if(t%30===0) trafficRef.current=trafficRef.current.filter(d=>d.x<w+20)

      // Substations
      LANES.forEach(lane=>{
        const ly=S.streetY+S.streetH*lane.frac
        for(let x=w*0.14;x<w*0.92;x+=w*0.14){
          const load=Math.sin(t*0.005+x*0.01+ly*0.01)*0.5+0.5
          if(load>0.3){
            const g=ctx.createRadialGradient(x,ly,0,x,ly,14)
            g.addColorStop(0,`rgba(${lane.color},${load*0.3})`);g.addColorStop(1,`rgba(${lane.color},0)`)
            ctx.beginPath();ctx.arc(x,ly,14,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
          }
          ctx.beginPath();ctx.arc(x,ly,2.5,0,Math.PI*2)
          ctx.fillStyle=`rgba(${lane.color},${0.2+load*0.5})`;ctx.fill()
        }
      })

      // Street legend
      ctx.font='9px -apple-system, sans-serif';ctx.textAlign='left'
      const sLegY=S.soulY-15
      const sLegs=[{c:'168,85,247',l:'system'},{c:'34,211,238',l:'work'},{c:'251,146,60',l:'personal'},{c:'239,68,68',l:'overload'}]
      sLegs.forEach((lg,i)=>{
        ctx.beginPath();ctx.arc(15+i*85,sLegY,2.5,0,Math.PI*2)
        ctx.fillStyle=`rgba(${lg.c},0.7)`;ctx.fill()
        ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillText(lg.l,22+i*85,sLegY+3)
      })

      // no stats line

      // ═══════════════════════════════════════════
      // SECTION 3: SOUL (bottom third)
      // ═══════════════════════════════════════════

      ctx.font='10px -apple-system, sans-serif';ctx.fillStyle='rgba(168,85,247,0.3)';ctx.textAlign='left'
      ctx.fillText('AMBIENT / REFIK LAYER',15,S.soulY+18)
      ctx.font='20px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.15)'
      ctx.fillText('Soul',15,S.soulY+40)

      const orbs=orbsRef.current
      const cx1=w*0.35+Math.sin(t*0.001)*50,cy1=S.soulY+S.soulH*0.4+Math.cos(t*0.0012)*25
      const cx2=w*0.65+Math.cos(t*0.0008)*40,cy2=S.soulY+S.soulH*0.7+Math.sin(t*0.001)*20

      orbs.forEach(orb=>{
        orb.phase+=orb.speed
        const bloom=1+Math.sin(orb.phase)*0.2
        const d1=Math.hypot(orb.x-cx1,orb.y-cy1),d2=Math.hypot(orb.x-cx2,orb.y-cy2)
        const cx=d1<d2?cx1:cx2,cy=d1<d2?cy1:cy2,dist=Math.min(d1,d2)
        if(dist>50){orb.vx+=(cx-orb.x)*0.000008;orb.vy+=(cy-orb.y)*0.000008}
        if(dist<30){orb.vx-=(cx-orb.x)*0.00002;orb.vy-=(cy-orb.y)*0.00002}
        orb.vx*=0.998;orb.vy*=0.998;orb.x+=orb.vx;orb.y+=orb.vy
        if(orb.x<-orb.r)orb.x=w+orb.r;if(orb.x>w+orb.r)orb.x=-orb.r
        if(orb.y<S.soulY-20)orb.y=h+orb.r;if(orb.y>h+orb.r)orb.y=S.soulY

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
          ctx.strokeStyle=`rgba(168,85,247,${(1-d/100)*0.05})`;ctx.lineWidth=0.5;ctx.stroke()}
        }
      }

      ctx.font='9px -apple-system, sans-serif';ctx.fillStyle='rgba(255,255,255,0.08)';ctx.textAlign='right'
      ctx.fillText('drift · cluster · bloom · ripple',w-12,h-10)

      // Section dividers — very subtle, not hard borders
      ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5
      ctx.beginPath();ctx.moveTo(0,S.streetY);ctx.lineTo(w,S.streetY);ctx.stroke()
      ctx.beginPath();ctx.moveTo(0,S.soulY);ctx.lineTo(w,S.soulY);ctx.stroke()

      // Gold synthesis pulse
      if(t%800>760){const p=(t%800-760)/40,r=p*Math.max(w,h)*0.2
      ctx.beginPath();ctx.arc(w/2,h/2,r,0,Math.PI*2)
      ctx.strokeStyle=`rgba(250,204,21,${0.06*(1-p)})`;ctx.lineWidth=1.5;ctx.stroke()}

      // Cyan sweep
      if(t%450<40){const wx=(t%450)/40*w
      const sg=ctx.createLinearGradient(wx-40,0,wx+40,0)
      sg.addColorStop(0,'rgba(34,211,238,0)');sg.addColorStop(0.5,'rgba(34,211,238,0.03)');sg.addColorStop(1,'rgba(34,211,238,0)')
      ctx.fillStyle=sg;ctx.fillRect(wx-40,0,80,h)}

      animId=requestAnimationFrame(draw)
    }
    draw()
    return ()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize)}
  }, [])

  return (
    <section className="relative w-full" style={{height:'100vh',minHeight:800}}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </section>
  )
}
