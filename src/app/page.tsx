import MinardLayer from '@/components/MinardLayer'
import StreetLayer from '@/components/StreetLayer'
import RefikLayer from '@/components/RefikLayer'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="px-8 py-6 border-b border-stone-200">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-500">
              Newey 2.0
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">Visual System — Concept Prototype</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-6 text-[10px] text-stone-400 tracking-wider uppercase">
              <span>Reason</span>
              <span className="text-stone-300">·</span>
              <span>Motion</span>
              <span className="text-stone-300">·</span>
              <span>Soul</span>
            </div>
            <nav className="flex gap-2">
              <a href="/a4" className="text-stone-600 hover:text-stone-300 transition-colors">A4</a>
            <a href="/" className="text-[10px] text-amber-600 font-bold border border-stone-300 px-3 py-1 rounded">Light</a>
              <a href="/dark" className="text-[10px] text-stone-400 border border-stone-300 px-3 py-1 rounded hover:bg-stone-800 hover:text-white transition-all">Dark</a>
              <a href="/interpret-light" className="text-[10px] text-stone-400 border border-stone-300 px-3 py-1 rounded hover:bg-stone-800 hover:text-white transition-all">Workbench</a>
              <a href="/interpret-dark" className="text-[10px] text-stone-400 border border-stone-300 px-3 py-1 rounded hover:bg-stone-800 hover:text-white transition-all">Workbench Dark</a>
              <a href="/mashup" className="text-[10px] text-stone-400 border border-stone-300 px-3 py-1 rounded hover:bg-stone-800 hover:text-white transition-all">Mashup</a>
            <a href="/token" className="text-stone-600 hover:text-stone-300 transition-colors">Token</a>
            <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
            </nav>
          </div>
        </div>
      </header>

      {/* 3 Layers */}
      <MinardLayer />
      <StreetLayer />
      <RefikLayer />

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-stone-200 text-center">
        <p className="text-[10px] text-stone-400 tracking-wider">
          Minard = reason · Street = motion · Refik = soul
        </p>
        <p className="text-[10px] text-stone-300 mt-1">
          Newey 2.0 Visual Direction — March 2026
        </p>
      </footer>
    </main>
  )
}
