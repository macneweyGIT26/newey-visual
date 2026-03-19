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
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-amber-500 hover:text-amber-300 transition-colors">A4</a>
            <a href="/a5" className="text-green-500 hover:text-green-300 transition-colors">A5</a>
            <a href="/a6" className="text-blue-500 hover:text-blue-300 transition-colors">A6</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors ml-auto">Light</a>
            <a href="/dark" className="text-stone-600 hover:text-stone-300 transition-colors">Dark</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
          </nav>
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
