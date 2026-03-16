import TokenGrid from '@/components/token/TokenGrid'

export const metadata = { title: 'Newey 2.0 — Token Grid', description: 'Town power grid token visualization' }

export default function TokenPage() {
  return (
    <main className="min-h-screen bg-[#020814]">
      <header className="absolute top-0 left-0 right-0 z-20 px-8 py-5">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto">
          <div />
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-stone-600 hover:text-stone-300 transition-colors">A4</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors">Light</a>
            <a href="/dark" className="text-stone-600 hover:text-stone-300 transition-colors">Dark</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/token" className="text-amber-500 font-bold">Token</a>
            <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
          </nav>
        </div>
      </header>
      <TokenGrid />
    </main>
  )
}
