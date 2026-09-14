'use client'

import { useEffect, useState } from 'react'
import type { Heading } from '@/lib/posts'

// Which section you are in, marked in the rail. The heading nearest above the
// reading line wins; at the very bottom the last section does, because a short
// final section never reaches the line.
const READING_LINE = 160

export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!els.length) return

    let frame = 0
    const update = () => {
      frame = 0
      const atEnd = window.scrollY + window.innerHeight >= document.body.scrollHeight - 4
      if (atEnd) return setActive(els[els.length - 1].id)
      let current = els[0].id
      for (const el of els) if (el.getBoundingClientRect().top <= READING_LINE) current = el.id
      setActive(current)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [headings])

  return (
    <nav className="artToc" aria-labelledby="toc-label">
      <h2 id="toc-label">Contents</h2>
      <ol>
        {headings.map((h) => (
          <li key={h.id} className={h.id === active ? 'on' : undefined}>
            <a href={`#${h.id}`} aria-current={h.id === active ? 'true' : undefined}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
