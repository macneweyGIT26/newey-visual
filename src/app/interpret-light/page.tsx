import InterpretLight from '@/components/interpret/InterpretLight'

export const metadata = { title: 'Newey 2.0 — Workbench (Light)', description: 'Personal Workbench — Where business, agents, memory, and projects meet' }

export default function InterpretLightPage() {
  return (
    <main className="min-h-screen bg-stone-200">
      <header className="px-8 py-5 border-b border-stone-300">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-500">Newey 2.0</h1>
            <p className="text-xs text-stone-400 mt-0.5">Personal Workbench — Light</p>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
              <a href="/" className="text-stone-400 hover:text-stone-700 transition-colors">Light</a>
              <a href="/dark" className="text-stone-400 hover:text-stone-700 transition-colors">Dark</a>
              <a href="/interpret-light" className="text-amber-600 font-bold">Workbench</a>
              <a href="/interpret-dark" className="text-stone-400 hover:text-stone-700 transition-colors">Workbench Dark</a>
            <a href="/mashup" className="text-stone-400 hover:text-stone-700 transition-colors">Mashup</a>
            </nav>
          </div>
        </div>
      </header>
      <InterpretLight />
    </main>
  )
}
