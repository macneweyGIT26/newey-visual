import InterpretDark from '@/components/interpret/InterpretDark'

export const metadata = { title: 'Newey 2.0 — Workbench (Dark)', description: 'Personal Workbench — City at night' }

export default function InterpretDarkPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <header className="px-8 py-5 border-b border-white/5">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-400">Newey 2.0</h1>
            <p className="text-xs text-stone-600 mt-0.5">Personal Workbench — Dark</p>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
              <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors">Light</a>
              <a href="/dark" className="text-stone-600 hover:text-stone-300 transition-colors">Dark</a>
              <a href="/interpret-light" className="text-stone-600 hover:text-stone-300 transition-colors">Workbench</a>
              <a href="/interpret-dark" className="text-amber-500 font-bold">Workbench Dark</a>
            </nav>
          </div>
        </div>
      </header>
      <InterpretDark />
    </main>
  )
}
