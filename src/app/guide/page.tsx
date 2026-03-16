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

      <div className="max-w-2xl mx-auto px-8 py-20">

        <div className="mb-20">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-500/60 mb-3">Reason</p>
          <h2 className="text-xl font-light text-stone-200 mb-1">Executive / Minard Layer</h2>
          <div className="w-12 h-px bg-amber-500/30 mb-6" />
          <p className="text-sm leading-relaxed text-stone-400">
            Particles flow left→right through 5 reasoning stages, narrowing as paths are pruned. <span style={{color:'#A66BFF'}}>Violet</span> traces system work. <span style={{color:'#34D1E7'}}>Cyan</span> traces work output. <span style={{color:'#FF9A3C'}}>Amber</span> traces personal. <span style={{color:'#FF4D4D'}}>Red</span> flashes where paths die.
          </p>
        </div>

        <div className="mb-20">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-cyan-400/60 mb-3">Motion</p>
          <h2 className="text-xl font-light text-stone-200 mb-1">Operations / Street Layer</h2>
          <div className="w-12 h-px bg-cyan-400/30 mb-6" />
          <p className="text-sm leading-relaxed text-stone-400">
            Token traffic shoots across 3 domain lanes — <span style={{color:'#A66BFF'}}>violet</span> for system, <span style={{color:'#34D1E7'}}>cyan</span> for work, <span style={{color:'#FF9A3C'}}>amber</span> for personal. Glowing dots jump lanes at cross-streets. Substations pulse at intersections. Balls bleed into Reason above and Memory below.
          </p>
        </div>

        <div className="mb-20">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-emerald-400/60 mb-3">Memory</p>
          <h2 className="text-xl font-light text-stone-200 mb-1">Ambient / Refik Layer</h2>
          <div className="w-12 h-px bg-emerald-400/30 mb-6" />
          <p className="text-sm leading-relaxed text-stone-400">
            Pastel orbs drift slowly, clustering toward two wandering centers then repelling when too close. <span style={{color:'#A66BFF'}}>Violet</span> threads form between nearby memories. <span style={{color:'#2BE6A6'}}>Emerald</span> ripples mark synthesis moments. The void breathes.
          </p>
        </div>

        {/* Unified Color Legend */}
        <div className="mb-16 pt-10 border-t border-white/5">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-500 mb-6">Color System</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{background:'#A66BFF'}} />
              <span className="text-sm font-mono text-stone-400">SYSTEM</span>
              <span className="text-xs text-stone-600">#A66BFF · Infrastructure, maintenance, governance</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{background:'#34D1E7'}} />
              <span className="text-sm font-mono text-stone-400">WORK</span>
              <span className="text-xs text-stone-600">#34D1E7 · Projects, analysis, deliverables</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{background:'#FF9A3C'}} />
              <span className="text-sm font-mono text-stone-400">PERSONAL</span>
              <span className="text-xs text-stone-600">#FF9A3C · Family, grocery, private</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{background:'#2BE6A6'}} />
              <span className="text-sm font-mono text-stone-400">SYNTHESIS</span>
              <span className="text-xs text-stone-600">#2BE6A6 · High-value output, convergence</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{background:'#FF4D4D'}} />
              <span className="text-sm font-mono text-stone-400">ATTRITION</span>
              <span className="text-xs text-stone-600">#FF4D4D · Dead paths, pruned routes, failure</span>
            </div>
          </div>
        </div>

        {/* Brightness Hierarchy */}
        <div className="mb-16 pt-6 border-t border-white/5">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-500 mb-4">Brightness Hierarchy</p>
          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            Brightness communicates importance. Higher opacity = higher priority signal.
          </p>
          <div className="space-y-2 text-xs text-stone-600">
            <div>💫 Token glow — synthesis pulses, breakthrough sweeps (highest)</div>
            <div>🔵 Work lanes — 0.12 opacity (primary activity)</div>
            <div>🟠 Personal lanes — 0.08 opacity (secondary activity)</div>
            <div>🟣 System grid — 0.05 opacity (infrastructure, implicit)</div>
            <div>🔴 Attrition flashes — signal where work dies</div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5">
          <p className="text-[10px] text-stone-700 tracking-wider">
            Minard = reason · Street = motion · Refik = memory
          </p>
          <p className="text-[10px] text-stone-700 mt-1">
            Newey 2.0 Visual System — March 2026
          </p>
        </div>

      </div>
    </main>
  )
}
