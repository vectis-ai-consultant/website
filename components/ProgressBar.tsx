'use client'
import { useEffect, useRef } from 'react'

// Scroll progress. Home also drives this element from its own scroll handler, so
// it only self-updates when it isn't already owned (see `standalone`).
export default function ProgressBar({ standalone = true }: { standalone?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!standalone) return
    const bar = ref.current
    if (!bar) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
        bar.style.width = Math.round(Math.min(1, scrollY / max) * 10000) / 100 + '%'
      })
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [standalone])

  return (
    <div id="progressBar" ref={ref}
      style={{ position: 'fixed', left: 0, top: 0, height: 2, zIndex: 60, background: '#3a4fae', width: '0%', willChange: 'width', pointerEvents: 'none' }} />
  )
}
