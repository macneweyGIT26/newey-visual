export const metadata = { title: 'Newey 2.0 — Guide', description: 'Visual system explained' }

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#080c18] text-stone-300">
      <header className="px-8 py-5 border-b border-white/5">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-400">Newey 2.0</h1>
            <p className="text-xs text-stone-600 mt-0.5">Guide</p>
          </div>
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-stone-600 hover:text-stone-300 transition-colors">A4</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors">Light</a>
            <a href="/dark" className="text-stone-600 hover:text-stone-300 transition-colors">Dark</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-amber-500 font-bold">Guide</a>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-20">

        <div className="mb-20">
          <h2 className="text-2xl font-light text-stone-100 mb-6">Cognitive Architecture</h2>
          <p className="text-sm text-stone-400 leading-relaxed mb-8">
            Newey 2.0 visualizes work as movement across three thinking layers. The interesting work crosses between layers. Routine work stays in Motion.
          </p>

          <div className="space-y-8">

            {/* Reason */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-500 mb-2">Layer 1</p>
              <h3 className="text-lg font-light text-stone-200 mb-2">Reason</h3>
              <p className="text-xs text-stone-600 mb-3">Thinking · Routing · Judgment</p>
              <p className="text-sm leading-relaxed text-stone-400">
                Particles flow left→right through 5 reasoning stages, narrowing as paths are pruned. <span style={{color:'#A66BFF'}}>Violet</span> traces system analysis. <span style={{color:'#34D1E7'}}>Cyan</span> traces work decisions. <span style={{color:'#FF9A3C'}}>Amber</span> traces personal judgment. <span style={{color:'#FF4D4D'}}>Red</span> marks where reasoning dies.
              </p>
            </div>

            {/* Motion */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-500 mb-2">Layer 2</p>
              <h3 className="text-lg font-light text-stone-200 mb-2">Motion</h3>
              <p className="text-xs text-stone-600 mb-3">Execution · Token Burn · Agents & Tools</p>
              <p className="text-sm leading-relaxed text-stone-400">
                Token traffic shoots across 3 domain lanes — <span style={{color:'#A66BFF'}}>violet</span> for system, <span style={{color:'#34D1E7'}}>cyan</span> for work, <span style={{color:'#FF9A3C'}}>amber</span> for personal. Glowing dots jump lanes at cross-streets. Substations pulse at intersections. <strong>Tokens burn only in Motion.</strong> Reason and Soul consume the results.
              </p>
            </div>

            {/* Soul */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-500 mb-2">Layer 3</p>
              <h3 className="text-lg font-light text-stone-200 mb-2">Soul</h3>
              <p className="text-xs text-stone-600 mb-3">Identity · Memory · Pattern</p>
              <p className="text-sm leading-relaxed text-stone-400">
                Pastel orbs drift slowly, clustering toward wandering centers then repelling when too close. <span style={{color:'#A66BFF'}}>Violet</span> threads form between nearby memories. <span style={{color:'#2BE6A6'}}>Emerald</span> ripples mark synthesis moments. The void breathes.
              </p>
            </div>

          </div>
        </div>

        {/* Crossings */}
        <div className="mb-20 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Layer Crossings</h2>
          <p className="text-sm text-stone-400 mb-6">The dots that cross layers are the interesting work. Four crossing types:</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-mono text-stone-300 mb-1">Motion → Reason</p>
                <p className="text-xs text-stone-600">Escalation. Work needs judgment. Queries the reasoning layer.</p>
              </div>
              <div>
                <p className="text-sm font-mono text-stone-300 mb-1">Reason → Motion</p>
                <p className="text-xs text-stone-600">Decision. Reasoning outputs a go/no-go. Motion executes.</p>
              </div>
              <div>
                <p className="text-sm font-mono text-stone-300 mb-1">Motion → Soul</p>
                <p className="text-xs text-stone-600">Completion. Work finishes. Results persist as memory.</p>
              </div>
              <div>
                <p className="text-sm font-mono text-stone-300 mb-1">Soul → Reason</p>
                <p className="text-xs text-stone-600">Recall. Memory patterns inform future reasoning.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Synthesis */}
        <div className="mb-20 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Synthesis</h2>
          <p className="text-sm text-stone-400 mb-4 leading-relaxed">
            Synthesis happens when multiple streams converge. Not "better work"—<strong>convergence</strong>.
          </p>
          <p className="text-sm text-stone-400 mb-6 leading-relaxed">
            Example: F1 data <span style={{color:'#34D1E7'}}>+</span> engine supplier insight <span style={{color:'#A66BFF'}}>+</span> contract interpretation <span style={{color:'#FF9A3C'}}>=</span> <span style={{color:'#2BE6A6'}}>emerald synthesis moment</span>
          </p>
          <p className="text-xs text-stone-500 italic">
            Visually: colored dots merge → emerald burst → result drops to Soul as memory.
          </p>
        </div>

        {/* Color System */}
        <div className="mb-16 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Color System</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#A66BFF'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#A66BFF — System</p>
                <p className="text-xs text-stone-600">Infrastructure, maintenance, governance</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#34D1E7'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#34D1E7 — Work</p>
                <p className="text-xs text-stone-600">Projects, analysis, deliverables</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#FF9A3C'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#FF9A3C — Personal</p>
                <p className="text-xs text-stone-600">Family, grocery, private</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#2BE6A6'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#2BE6A6 — Synthesis</p>
                <p className="text-xs text-stone-600">Convergence of multiple streams</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-4 h-4 rounded-full mt-1" style={{background:'#FF4D4D'}} />
              <div>
                <p className="text-sm font-mono text-stone-300">#FF4D4D — Attrition</p>
                <p className="text-xs text-stone-600">Dead paths, pruned routes, failure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brightness Hierarchy */}
        <div className="mb-16 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Brightness Hierarchy</h2>
          <p className="text-sm text-stone-400 mb-4">Brightness signals importance. Higher opacity = higher priority.</p>
          
          <div className="space-y-2 text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <span>💫</span>
              <span>Synthesis glow & Work sweep — highest priority (breakthrough signals)</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔵</span>
              <span>Work lanes — 0.12 opacity (primary execution)</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🟠</span>
              <span>Personal lanes — 0.08 opacity (secondary execution)</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🟣</span>
              <span>System grid — 0.05 opacity (infrastructure, implicit)</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔴</span>
              <span>Attrition flashes — signal where work dies</span>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="mb-16 pt-10 border-t border-white/5">
          <h2 className="text-xl font-light text-stone-100 mb-6">Why This Works</h2>
          <p className="text-sm text-stone-400 leading-relaxed mb-4">
            This model maps to multiple domains simultaneously:
          </p>
          <div className="space-y-1 text-sm text-stone-600">
            <div><strong>Human brain:</strong> perception / reasoning / memory</div>
            <div><strong>Company:</strong> operations / strategy / culture</div>
            <div><strong>LLM inference:</strong> token processing / reasoning / vector memory</div>
            <div><strong>City:</strong> streets / planning / institutions</div>
          </div>
          <p className="text-xs text-stone-500 italic mt-4">
            That's why it feels right. It's not decoration—it's architecture.
          </p>
        </div>

        <div className="pt-10 border-t border-white/5">
          <p className="text-[10px] text-stone-700 tracking-wider">
            Reasoning = thinking · Motion = execution · Soul = learning
          </p>
          <p className="text-[10px] text-stone-700 mt-1">
            Newey 2.0 Visual System — A4v2 — March 2026
          </p>
        </div>

      </div>
    </main>
  )
}
