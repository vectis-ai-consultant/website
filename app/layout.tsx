import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import Reveal from '@/components/Reveal'
import KeepScroll from '@/components/KeepScroll'
import './globals.css'

// Only the article headline uses this, so only the one weight is fetched. The rest
// of the site stays on the system sans stack — no webfont in the critical path.
const display = Playfair_Display({
  subsets: ['latin'], weight: ['700'], display: 'swap', variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://meetvectis.com'),
  title: {
    default: 'Vectis AI — AI agents, automation and LLM builds for Toronto businesses',
    template: '%s — Vectis AI',
  },
  description:
    'Vectis AI is a Toronto AI consulting firm. We build AI agents, social-media automation, website chatbots and corporate AI training into the systems you already run.',
  icons: { icon: '/assets/logos/vectis-mark.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <Reveal />
        <KeepScroll />
        {children}
      </body>
    </html>
  )
}
