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
            Gold particles flow left→right through 5 reasoning stages, narrowing as paths are pruned. Cyan traces secondary routes. Violet marks supervisory oversight. Red flashes where paths die.
          </p>
        </div>

        <div className="mb-20">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-cyan-400/60 mb-3">Motion</p>
          <h2 className="text-xl font-light text-stone-200 mb-1">Operations / Street Layer</h2>
          <div className="w-12 h-px bg-cyan-400/30 mb-6" />
          <p className="text-sm leading-relaxed text-stone-400">
            Token traffic shoots across 3 domain lanes — violet for system, cyan for work, amber for personal. Glowing dots jump lanes at cross-streets. Substations pulse at intersections. Balls bleed into Reason above and Soul below.
          </p>
        </div>

        <div className="mb-20">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-violet-400/60 mb-3">Memory</p>
          <h2 className="text-xl font-light text-stone-200 mb-1">Ambient / Refik Layer</h2>
          <div className="w-12 h-px bg-violet-400/30 mb-6" />
          <p className="text-sm leading-relaxed text-stone-400">
            Pastel orbs drift slowly, clustering toward two wandering centers then repelling when too close. Violet threads form between nearby memories. Gold ripples mark synthesis moments. The void breathes.
          </p>
        </div>

        <div className="pt-10 border-t border-white/5">
          <p className="text-[10px] text-stone-700 tracking-wider">
            Minard = reason · Street = motion · Refik = soul
          </p>
          <p className="text-[10px] text-stone-700 mt-1">
            Newey 2.0 Visual System — March 2026
          </p>
        </div>

      </div>
    </main>
  )
}
