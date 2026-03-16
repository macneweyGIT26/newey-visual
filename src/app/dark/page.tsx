import MinardDark from '@/components/dark/MinardDark'
import StreetDark from '@/components/dark/StreetDark'
import RefikDark from '@/components/dark/RefikDark'

export const metadata = { title: 'Newey 2.0 — Dark Mode', description: 'Reason · Motion · Soul — Dark' }

export default function DarkPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <header className="px-8 py-6 border-b border-white/5">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-400">
              Newey 2.0
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">Visual System — Dark Mode</p>
          </div>
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-stone-600 hover:text-stone-300 transition-colors">A4</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors">Light</a>
            <a href="/dark" className="text-amber-500 font-bold">Dark</a>
            <a href="/interpret-light" className="text-stone-600 hover:text-stone-300 transition-colors">Workbench</a>
            <a href="/interpret-dark" className="text-stone-600 hover:text-stone-300 transition-colors">Workbench Dark</a>
              <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
          <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
            </nav>
        </div>
      </header>
      <MinardDark />
      <StreetDark />
      <RefikDark />
      <footer className="px-8 py-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-stone-600 tracking-wider">
          Minard = reason · Street = motion · Refik = soul
        </p>
        <p className="text-[10px] text-stone-700 mt-1">
          Newey 2.0 Dark Mode — March 2026
        </p>
      </footer>
    </main>
  )
}
