import A5Canvas from '@/components/a5/A5Canvas'

export const metadata = { title: 'Newey 2.0 — A5 (Live + Agents)', description: 'Live data visualization with agent particles' }

export default function A5Page() {
  return (
    <main className="min-h-screen bg-[#080c18]">
      <header className="px-8 py-5 border-b border-white/5 relative z-20">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-400">Newey 2.0</h1>
            <p className="text-xs text-stone-600 mt-0.5">A5 — Live Data + Agent Particles</p>
          </div>
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-amber-500 hover:text-amber-300 transition-colors">A4</a>
            <a href="/a5" className="text-green-500 font-bold">A5</a>
            <a href="/a6" className="text-blue-500 hover:text-blue-300 transition-colors">A6</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors ml-auto">Light</a>
            <a href="/dark" className="text-stone-600 hover:text-stone-300 transition-colors">Dark</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
            </nav>
        </div>
      </header>
      <A5Canvas />
    </main>
  )
}
