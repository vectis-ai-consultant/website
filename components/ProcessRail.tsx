'use client'

import { useEffect, useRef, useState } from 'react'
import { railState } from '@/lib/rail-state'

// The four steps, told as a scroll hook rather than four static columns: the
// artefact of the step holds still on the left while the copy advances on the
// right, the way the v2 site does it. Same four steps, same words.
const STEPS = [
  {
    tag: 'STEP ONE', name: 'Discovery', when: '30–60 min',
    body: 'We learn your business, your bottlenecks, and what you have already tried.',
    card: 'Where the week goes',
    rows: [['Chasing documents by email', 62], ['Re-typing form data', 48], ['Following up on leads', 35], ['Client calls', 18]] as [string, number][],
    note: 'Four hours a week hiding in one repeatable step.',
  },
  {
    tag: 'STEP TWO', name: 'Plan', when: '1 week',
    body: 'You see exactly what the build looks like — architecture, milestones, and what success means — and we shape the plan together.',
    card: 'Scope · agreed together',
    rows: [['Intake agent', 100], ['Document parsing', 74], ['Approval gate', 52], ['Handoff & docs', 30]] as [string, number][],
    note: 'A clear scope, the milestones, and what success has to look like.',
  },
  {
    tag: 'STEP THREE', name: 'Trial run', when: '1–2 weeks',
    body: 'A small scoped build first. Real results in your own workflow before you commit to the full project.',
    card: 'Iteration point',
    rows: [['Written 100%', 100], ['Sent for review', 86], ['Walkthrough recorded', 58], ['Your accounts, your keys', 40]] as [string, number][],
    note: 'Real results in your own workflow before you commit to anything.',
  },
  {
    tag: 'STEP FOUR', name: 'Build & own', when: '2–6 weeks',
    body: 'The complete system, delivered with documentation and a walkthrough so your team owns it. 30 days of support after handoff.',
    card: 'Yours to run',
    rows: [['Documentation', 100], ['Walkthrough session', 100], ['Your accounts, your keys', 100], ['30 days of support', 76]] as [string, number][],
    note: 'It runs on your accounts. You can change it without calling us.',
  },
]

export default function ProcessRail() {
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const el = list.current
    if (!el) return
    let frame = 0, last = -1
    const update = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      const s = railState((innerHeight / 2 - box.top) / Math.max(1, box.height), STEPS.length)
      if (fill.current) fill.current.style.transform = `scaleY(${s.fill})`
      if (s.index !== last) { last = s.index; setIndex(s.index) }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', schedule)
      removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <section id="process" data-reveal="1" className="rail-section">
      <div className="rail-grid">
        {/* Heading, title and artefact all hold together: the reader keeps the
            question in view, and the only thing that moves is the answer. */}
        <div className="rail-aside">
          <div className="rail-head">
            <span data-num="1" className="rail-bignum">02</span>
            <span className="rail-eyebrow">HOW IT WORKS</span>
          </div>
          <h2 id="processHead" className="rail-title">Four steps, from first call to a system that runs itself.</h2>
          <Card step={STEPS[index]} />
        </div>

        <ol className="rail-steps" ref={list}>
          <span className="rail-track"><span className="rail-fill" ref={fill} /></span>
          {STEPS.map((s, i) => (
            <li key={s.tag} className={`rail-step${i === index ? ' is-active' : ''}`} aria-current={i === index || undefined}>
              <span className="rail-tag">{s.tag}</span>
              <h3>{s.name}</h3>
              <span className="rail-when">{s.when}</span>
              <p>{s.body}</p>
              {/* Below the fold of the two-column layout the card belongs with
                  its own step, not pinned beside the whole list. */}
              <div className="rail-card-inline"><Card step={s} /></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Card({ step }: { step: typeof STEPS[number] }) {
  return (
    <div className="rail-card">
      <div className="rail-card-head">{step.card}</div>
      <div className="rail-card-body">
        {step.rows.map(([label, pct]) => (
          <div className="rail-row" key={label}>
            <span>{label}</span>
            <span className="rail-bar"><i style={{ width: `${pct}%` }} /></span>
          </div>
        ))}
        <p className="rail-note">{step.note}</p>
      </div>
    </div>
  )
}
