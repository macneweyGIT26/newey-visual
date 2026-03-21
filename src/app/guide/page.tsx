export const metadata = { title: 'Newey 2.0 — Guide', description: 'Visual system explained' }

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#080c18] text-stone-300">
      <header className="px-8 py-5 border-b border-white/5">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-400">Newey 2.0</h1>
            <p className="text-xs text-stone-600 mt-0.5">Guide — V5</p>
          </div>
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-amber-500 hover:text-amber-300 transition-colors">A4</a>
            <a href="/a6" className="text-blue-500 hover:text-blue-300 transition-colors">A6</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-stone-400 font-bold">Guide</a>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-20">

        <div className="mb-20">
          <h2 className="text-2xl font-light text-stone-100 mb-6">Cognitive Architecture</h2>
          <p className="text-sm text-stone-400 leading-relaxed mb-8">
            A4 is Newey&apos;s heartbeat. Three thinking layers visualize how work flows through reasoning, execution, and memory. Motion intensity reflects actual system activity — busy when working, quiet when idle.
          </p>

          <div className="space-y-8">

            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-500 mb-2">Layer 1</p>
              <h3 className="text-lg font-light text-stone-200 mb-2">Reason</h3>
              <p className="text-xs text-stone-600 mb-3">Thinking · Routing · Judgment</p>
              <div className="text-sm leading-relaxed text-stone-400 space-y-2">
                <p><strong>Current:</strong> Particles flow left→right through 5 reasoning stages (Prompt → Router → Agent Swarm → Tool Calls → Output), narrowing as paths are pruned. Spawn rate scales with activity — dense during active work, sparse when idle. Colors represent domain lanes: <span style={{color:'#A855F7'}}>violet</span> = system, <span style={{color:'#22D3EE'}}>cyan</span> = work, <span style={{color:'#FB923C'}}>amber</span> = personal. <span style={{color:'#EF4444'}}>Red</span> marks where reasoning dies (attrition).</p>
                <p className="text-stone-600"><strong>Planned:</strong> Particle weighting by real project cost. Flow width mapped to actual token volume per stage.</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-500 mb-2">Layer 2</p>
              <h3 className="text-lg font-light text-stone-200 mb-2">Motion</h3>
              <p className="text-xs text-stone-600 mb-3">Execution · Traffic · Domain Lanes</p>
              <div className="text-sm leading-relaxed text-stone-400 space-y-2">
                <p><strong>Current:</strong> Colored dots move across 3 domain lanes. Traffic spawn rate and max count scale with activity. Substations pulse at intersections — brighter when busy. Dots that cross layer boundaries represent escalation (up to Reason) or completion (down to Memory). Crossing frequency increases with workload.</p>
                <p className="text-stone-600"><strong>Planned:</strong> Lane density proportional to real domain costs. Agent particles (Horner, Zack) added in V6.</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-500 mb-2">Layer 3</p>
              <h3 className="text-lg font-light text-stone-200 mb-2">Memory</h3>
              <p className="text-xs text-stone-600 mb-3">Continuity · Pattern · Learning</p>
              <div className="text-sm leading-relaxed text-stone-400 space-y-2">
                <p><strong>Current:</strong> 50 orbs drift slowly, clustering toward wandering centers then repelling when too close. Orb speed scales with activity — nearly still during sleep, breathing during work. <span style={{color:'#A855F7'}}>Violet</span> threads form between nearby orbs. Colors are domain-representative but not individually mapped to projects.</p>
                <p className="text-stone-600"><strong>Planned:</strong> One orb per project entry, sized by cost, colored by project. Memory threads weighted by recency.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Heartbeat */}
        <div className="mb-20 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Heartbeat Pacing</h2>
          <p className="text-sm text-stone-400 mb-4 leading-relaxed">
            A4 is not a constant animation. All visual parameters — spawn rates, velocities, glow intensity, crossing frequency, synthesis timing — scale with real activity level fetched from live data.
          </p>
          <div className="space-y-2 text-sm text-stone-500">
            <div className="flex gap-4"><span className="text-stone-300 w-24 shrink-0">active</span><span>Dense particles, fast traffic, bright substations, frequent synthesis</span></div>
            <div className="flex gap-4"><span className="text-stone-300 w-24 shrink-0">moderate</span><span>Normal flow, steady lanes, visible crossings</span></div>
            <div className="flex gap-4"><span className="text-stone-300 w-24 shrink-0">idle</span><span>Sparse movement, dim substations, slow drift</span></div>
            <div className="flex gap-4"><span className="text-stone-300 w-24 shrink-0">scheduled</span><span>Faint pulses only — cron/heartbeat work, no active session</span></div>
            <div className="flex gap-4"><span className="text-stone-300 w-24 shrink-0">sleep</span><span>Near-still. Memory orbs drift. Rare faint sweep. Newey is quiet.</span></div>
          </div>
        </div>

        {/* Crossings */}
        <div className="mb-20 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Layer Crossings</h2>
          <p className="text-sm text-stone-400 mb-6">Dots that cross layers are the interesting work. Four crossing types:</p>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-mono text-stone-300 mb-1">Motion → Reason</p>
              <p className="text-xs text-stone-600">Escalation. Work needs judgment.</p>
            </div>
            <div>
              <p className="text-sm font-mono text-stone-300 mb-1">Reason → Motion</p>
              <p className="text-xs text-stone-600">Decision. Reasoning outputs go/no-go.</p>
            </div>
            <div>
              <p className="text-sm font-mono text-stone-300 mb-1">Motion → Memory</p>
              <p className="text-xs text-stone-600">Completion. Results persist as memory.</p>
            </div>
            <div>
              <p className="text-sm font-mono text-stone-300 mb-1">Memory → Reason</p>
              <p className="text-xs text-stone-600">Recall. Patterns inform future reasoning.</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mb-20 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Abstraction</h2>
          <p className="text-sm text-stone-400 mb-4 leading-relaxed">
            A4 shows that work exists, not what the work is. Domain lanes represent broad categories (system, work, personal) without exposing specific operations. Execution-sensitive activity appears as abstract domain traffic — never as explicit trade details, positions, or instrument names.
          </p>
          <p className="text-xs text-stone-500 italic">
            The viz is expressive, not operational. For operational truth, see State (A7).
          </p>
        </div>

        {/* Color System */}
        <div className="mb-16 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Color System</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#A855F7'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#A855F7 — System</p>
                <p className="text-xs text-stone-600">Infrastructure, governance, maintenance</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#22D3EE'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#22D3EE — Work</p>
                <p className="text-xs text-stone-600">Projects, analysis, deliverables, research</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#FB923C'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#FB923C — Personal</p>
                <p className="text-xs text-stone-600">Family, personal, private</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#FACC15'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#FACC15 — Synthesis</p>
                <p className="text-xs text-stone-600">Convergence of multiple streams (gold pulse)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#EF4444'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#EF4444 — Attrition</p>
                <p className="text-xs text-stone-600">Dead paths, pruned routes, failure</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5">
          <p className="text-[10px] text-stone-700 tracking-wider">
            Reason = thinking · Motion = execution · Memory = learning
          </p>
          <p className="text-[10px] text-stone-700 mt-1">
            Newey 2.0 — V5 — March 2026
          </p>
        </div>

      </div>
    </main>
  )
}
