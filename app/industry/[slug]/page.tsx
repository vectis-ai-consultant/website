import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import ProgressBar from '@/components/ProgressBar'
import { INDUSTRIES, bySlug } from '@/lib/industries'
import '../../industries.css'

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const ind = bySlug((await params).slug)
  if (!ind) return {}
  return {
    title: `AI for ${ind.name}`,
    description: `${ind.promise} ${ind.lede}`,
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const ind = bySlug((await params).slug)
  if (!ind) notFound()
  return (
    <>
      <ProgressBar />
      <Nav />
      <section className="ind-hero">
        <p className="ind-eyebrow">INDUSTRIES / {ind.name.toUpperCase()}</p>
        <h1>AI for {ind.name.toLowerCase()}.</h1>
        <p className="ind-lede">{ind.lede}</p>
        <ul className="ind-wins">
          {ind.wins.map((w) => <li key={w}>{w}</li>)}
        </ul>
      </section>

      <section className="ind-wrap">
        <p className="ind-eyebrow">WORKFLOW OPPORTUNITIES</p>
        <div className="ind-head">
          <h2>Where AI can do the work instead of your team.</h2>
          <Link className="ind-all" href="/industries">All industries →</Link>
        </div>
        <div className="ind-flows" data-stagger="1">
          {ind.workflows.map((w, i) => (
            <div className="ind-flow" key={w.title}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ind-path">
        <div className="ind-path-in">
          <div>
            <h2>Start with one workflow. Prove it. Then widen it.</h2>
            <p>
              We look at your data, your tools, where a person has to stay in the loop,
              and what you would need to see to call it working — before anything gets built.
            </p>
          </div>
          <Link className="btn btnDark" href="/#contact">Book a discovery call →</Link>
        </div>
      </section>
    </>
  )
}
