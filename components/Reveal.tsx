'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Reveal-on-scroll for every page. Mounted in the layout rather than loaded as a
// script: a script would run once and dedupe, so navigating back to a page would
// leave its [data-reveal] sections stuck at opacity 0 forever.
export default function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.setAttribute('data-in', '1')
        io.unobserve(e.target)
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    // Re-scan a few times so late layout (fonts, the three.js canvas) still gets observed.
    const scan = () => document
      .querySelectorAll('[data-reveal]:not([data-in]),[data-stagger]:not([data-in]),[data-line]:not([data-in]),[data-num]:not([data-in])')
      .forEach((el) => io.observe(el))
    scan()
    const timers = [400, 1500, 4000].map((ms) => setTimeout(scan, ms))
    return () => {
      io.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [pathname])

  return null
}
