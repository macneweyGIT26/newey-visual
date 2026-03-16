import A4Canvas from '@/components/a4/A4Canvas'

export const metadata = { title: 'Newey 2.0 — A4 (Live)', description: 'Live data visualization' }

export default function A4Page() {
  return (
    <main className="min-h-screen bg-[#080c18]">
      <header className="px-8 py-5 border-b border-white/5 relative z-20">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-400">Newey 2.0</h1>
            <p className="text-xs text-stone-600 mt-0.5">A4 — Live Data</p>
          </div>
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-amber-500 font-bold">A4</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors">Light</a>
            <a href="/dark" className="text-stone-600 hover:text-stone-300 transition-colors">Dark</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
            </nav>
        </div>
      </header>
      <A4Canvas />
    </main>
  )
}
