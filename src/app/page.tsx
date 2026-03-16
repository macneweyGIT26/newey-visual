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
          <div className="flex gap-6 text-[10px] text-stone-400 tracking-wider uppercase">
            <span>Reason</span>
            <span className="text-stone-300">·</span>
            <span>Motion</span>
            <span className="text-stone-300">·</span>
            <span>Soul</span>
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
