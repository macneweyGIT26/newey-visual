import './globals.css'
export const metadata = { title: 'Newey 2.0 — Visual System', description: 'Reason · Motion · Soul' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="bg-stone-200 text-stone-800 antialiased">{children}</body></html>)
}
