import MinardDark from '@/components/dark/MinardDark'
import StreetDark from '@/components/dark/StreetDark'
import RefikDark from '@/components/dark/RefikDark'

export const metadata = { title: 'Newey 2.0 — A4 Dark', description: 'Reason · Motion · Memory — Dark Layers' }

export default function DarkPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <header className="px-8 py-5 border-b border-white/5">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-400">Newey 2.0</h1>
            <p className="text-xs text-stone-600 mt-0.5">A4 Dark — Separated Layers</p>
          </div>
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-stone-600 hover:text-stone-300 transition-colors">A4</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors">Light</a>
            <a href="/dark" className="text-amber-500 font-bold">Dark</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
          </nav>
        </div>
      </header>

      {/* Reason */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] text-rose-400/40 tracking-[0.25em] uppercase">Thinking / Minard Layer</p>
          <p className="text-lg text-white/20 mt-1">Reason</p>
          <p className="text-[8px] text-white/15 mt-0.5">routing · judgment · pruning</p>
        </div>
        <MinardDark />
      </div>

      {/* Motion */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] text-cyan-400/40 tracking-[0.25em] uppercase">Execution / Street Layer</p>
          <p className="text-lg text-white/20 mt-1">Motion</p>
          <p className="text-[8px] text-white/15 mt-0.5">token burn · agents · tools</p>
        </div>
        <StreetDark />
      </div>

      {/* Memory */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] text-rose-400/30 tracking-[0.25em] uppercase">Learning / Refik Layer</p>
          <p className="text-lg text-white/15 mt-1">Memory</p>
          <p className="text-[8px] text-white/12 mt-0.5">identity · memory · pattern</p>
        </div>
        <RefikDark />
      </div>

      <footer className="px-8 py-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-stone-600 tracking-wider">
          Reasoning = thinking · Motion = execution · Memory = learning
        </p>
        <p className="text-[10px] text-stone-700 mt-1">
          Newey 2.0 — A4 Dark — March 2026
        </p>
      </footer>
    </main>
  )
}
