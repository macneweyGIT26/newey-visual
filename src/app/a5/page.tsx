import { redirect } from 'next/navigation'

// A5 is currently in Lab — redirects to A4 stable baseline
export default function A5Page() {
  redirect('/a4')
}
