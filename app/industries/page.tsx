import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import ProgressBar from '@/components/ProgressBar'
import { INDUSTRIES } from '@/lib/industries'
import '../industries.css'

export const metadata: Metadata = {
  title: 'Industries',
  description:
    'Where AI actually fits in your trade — practical workflows for legal, immigration, real estate, home services, clinics, retail, hospitality and accounting.',
}

export default function IndustriesPage() {
  return (
    <>
      <ProgressBar />
      <Nav />
      <section className="ind-hero">
        <p className="ind-eyebrow">INDUSTRIES</p>
        <h1>AI built around the work your industry already does.</h1>
        <p className="ind-lede">
          The same four services, in the language of your trade. Start with the one
          workflow that costs you the most, and prove it before you widen it.
        </p>
      </section>
      <section className="ind-wrap" style={{ paddingTop: 56 }}>
        <div className="ind-grid" data-stagger="1">
          {INDUSTRIES.map((ind, i) => (
            <Link key={ind.slug} className="ind-card" href={`/industry/${ind.slug}`}>
              <span className="ind-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{ind.name}</h3>
              <p>{ind.promise}</p>
              <span className="ind-go">Explore workflows →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
