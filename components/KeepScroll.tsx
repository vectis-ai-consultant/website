'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Puts the reader back where they were when they press Back.
//
// The App Router does restore scroll on a back/forward, but two things made that
// restore read as the page scrolling itself rather than as coming back. Both were
// measured here, frame by frame, rather than guessed at.
//
// One: globals.css sets `html { scroll-behavior: smooth }`, which applies to
// scrollTo and therefore to the restore. Coming back from /industry/<slug> the
// page did not appear at the saved position — it animated there from the top over
// about a second, replaying act one on the way. Restoring a position is not a
// journey, so this restores with `behavior: 'instant'`.
//
// Two: the restore only happened once the route's own render finished, about two
// seconds on the homepage. This runs as soon as the route renders instead.
//
// Deliberately scoped to back/forward. A `popstate` has to have fired for a
// restore to happen at all, so clicking "Home" in the nav still lands at the top
// of the page, which is what someone choosing that link is asking for.

// Module scope, so it survives soft navigation and dies with a hard load — which
// is the right lifetime: after a real reload the browser does its own restoring
// and a remembered position from before it would be fighting that.
const remembered = new Map<string, number>()
let cameBack = false

export default function KeepScroll() {
  const path = usePathname()

  useEffect(() => {
    const onPop = () => { cameBack = true }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    // popstate fires before the new route renders, so by the time this effect
    // runs for the path being returned to, the flag is already set.
    const y = cameBack ? remembered.get(path) : undefined
    cameBack = false

    if (y !== undefined && y > 0) {
      let stopped = false
      // `behavior: 'instant'` is the whole fix, and it is why this looked like the
      // page scrolling itself. globals.css sets `html { scroll-behavior: smooth }`,
      // which applies to scrollTo as well as to anchor links — so every attempt to
      // put the reader back animated them there over about a second, from the top
      // of the page, through act one. That IS the rescroll. Restoring a position is
      // not a journey; the reader should never see the ground they already covered.
      const put = () => window.scrollTo({ top: y, left: 0, behavior: 'instant' })

      // Three: this effect runs the moment the route commits, and at that point
      // the homepage's content has not laid out — the document was measured at
      // 1534px tall. A scroll is clamped to the height that exists, so the restore
      // silently landed at 634 (1534 minus the 900 viewport) and whether it ever
      // recovered came down to whether the content finished growing before the
      // retry window closed. That is the flake: same code, 4289 one run and 634
      // the next. Propping the page to exactly the height the target needs makes
      // the first attempt land, and it comes off once the content can hold the
      // position on its own.
      const root = document.documentElement
      const need = y + window.innerHeight
      root.style.minHeight = need + 'px'
      const release = () => { root.style.minHeight = '' }

      // Ends when the position has actually held for a few frames, not when a
      // timer says it should have. The cap is a backstop, not the mechanism.
      const until = performance.now() + 5000
      let held = 0
      const hold = () => {
        if (stopped) return release()
        if (Math.abs(window.scrollY - y) > 2) { put(); held = 0 } else held++
        const done = held >= 3 && document.body.scrollHeight >= need
        if (!done && performance.now() < until) requestAnimationFrame(hold)
        else release()
      }
      put()
      // The reader wins. If they touch the page while this is still asserting,
      // it gets out of the way rather than dragging them back.
      const stop = () => { stopped = true }
      const opts = { once: true, passive: true } as const
      window.addEventListener('wheel', stop, opts)
      window.addEventListener('touchstart', stop, opts)
      window.addEventListener('keydown', stop, { once: true })
      hold()
    }

    // Recorded as they scroll rather than on the way out: by the time a route is
    // tearing down the position has often already been reset, so reading it then
    // records a zero and the restore has nothing to go back to.
    let frame = 0
    const save = () => { frame = 0; remembered.set(path, window.scrollY) }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(save) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [path])

  return null
}
