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
            <a href="/a4" className="text-amber-500 hover:text-amber-300 transition-colors">A4</a>
            <a href="/a5" className="text-green-500 hover:text-green-300 transition-colors">A5</a>
            <a href="/a6" className="text-blue-500 hover:text-blue-300 transition-colors">A6</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors ml-auto">Light</a>
            <a href="/dark" className="text-amber-500 font-bold">Dark</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
          </nav>
        </div>
      </header>

      {/* Reason */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] text-white/40 tracking-[0.25em] uppercase">Thinking / Minard Layer</p>
          <p className="text-xl text-white/20 mt-1">Reason</p>
          <p className="text-[8px] text-white/15 mt-0.5">routing · judgment · pruning</p>
        </div>
        <MinardDark />
      </div>

      {/* Motion */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] text-white/40 tracking-[0.25em] uppercase">Execution / Street Layer</p>
          <p className="text-xl text-white/20 mt-1">Motion</p>
          <p className="text-[8px] text-white/15 mt-0.5">token burn · agents · tools</p>
        </div>
        <StreetDark />
      </div>

      {/* Memory */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] text-white/40 tracking-[0.25em] uppercase">Learning / Refik Layer</p>
          <p className="text-xl text-white/20 mt-1">Memory</p>
          <p className="text-[8px] text-white/15 mt-0.5">identity · memory · pattern</p>
        </div>
        <RefikDark />
      </div>

      {/* Legend — same position as A4 bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 py-3 bg-[#0a0e1a]/80 border-t border-white/5">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex gap-4 text-[9px] text-stone-600">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background:'#A66BFF',opacity:0.5}} /> system</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background:'#34D1E7',opacity:0.9}} /> work</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background:'#FF9A3C',opacity:0.7}} /> personal</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background:'#FF5FA2',opacity:1}} /> synthesis</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background:'#CC2244',opacity:0.6}} /> attrition</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-white/30" style={{background:'rgba(255,255,255,0.3)'}} /> crossing flash</span>
          </div>
          <div className="text-[8px] text-stone-700">
            M→R escalation · R→M decision · M→S complete · S→R recall
          </div>
        </div>
      </div>
    </main>
  )
}
