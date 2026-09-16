'use client'

import { useEffect, useRef } from 'react'
import { SPACING, DOT, SETTLE, shove, lift, decay } from '@/lib/dot-field'

// A lattice of dots that the pointer pushes out of its way.
//
// This sits OUTSIDE the scroll timeline on purpose. The story is a pure function
// of scroll position and is reversible by construction; this is decoration, in
// the same class as the ambient drift loops, and it reads nothing from ballState,
// nothing from the --p/--e/--frame channels, and nothing from the shell's
// position. An earlier version coupled the field to the ball and was rebuilt five
// times chasing a look nobody had asked for. See docs/adr/0004-dot-field.md.
//
// At rest it is an even square lattice and the loop is stopped, so an idle page
// costs nothing at all.
const COLOUR = '198,212,245'

export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()

    // Where the pointer is, and how hard it is currently pushing. `mass` falls to
    // zero over SETTLE seconds after the last movement, which is what returns the
    // lattice to perfectly regular.
    const p = { x: -1e5, y: -1e5, tx: -1e5, ty: -1e5, mass: 0 }

    const paint = () => {
      ctx.clearRect(0, 0, w, h)
      const on = p.mass > 0.001
      for (let gy = SPACING * 0.5; gy < h + SPACING; gy += SPACING) {
        for (let gx = SPACING * 0.5; gx < w + SPACING; gx += SPACING) {
          let x = gx
          let y = gy
          let near = 0
          if (on) {
            const dx = p.x - gx
            const dy = p.y - gy
            const d = Math.hypot(dx, dy)
            const s = shove(d, p.mass)
            x += dx * s
            y += dy * s
            near = lift(d, p.mass)
          }
          ctx.fillStyle = `rgba(${COLOUR},${Math.min(1, 0.85 + 0.35 * near)})`
          ctx.beginPath()
          ctx.arc(x, y, DOT, 0, 6.2832)
          ctx.fill()
        }
      }
    }

    // Reduced motion, and anything without a pointer, get the resting lattice and
    // no listener at all — the effect has nothing to say to a reader who cannot
    // move a cursor over it.
    const stillOnly =
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !matchMedia('(pointer: fine)').matches

    const ro = new ResizeObserver(() => {
      size()
      paint()
    })
    ro.observe(cv)

    if (stillOnly) {
      paint()
      return () => ro.disconnect()
    }

    // The loop runs only while the field is away from rest. When it settles it
    // draws the flat lattice one last time and stops, so an idle page is a static
    // image costing nothing.
    let raf = 0
    let last = 0
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
      last = now
      if (p.tx > -1e4) {
        // Ease toward the real cursor, so a fast sweep drags the field rather
        // than teleporting it.
        if (p.x < -1e4) {
          p.x = p.tx
          p.y = p.ty
        } else {
          p.x += (p.tx - p.x) * 0.14
          p.y += (p.ty - p.y) * 0.14
        }
      }
      p.mass = decay(p.mass, dt)
      paint()
      if (p.mass > 0.001) raf = requestAnimationFrame(frame)
      else raf = 0
    }

    const move = (e: PointerEvent) => {
      const box = cv.getBoundingClientRect()
      p.tx = e.clientX - box.left
      p.ty = e.clientY - box.top
      p.mass = 1
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(frame)
      }
    }
    addEventListener('pointermove', move, { passive: true })

    paint()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      removeEventListener('pointermove', move)
    }
  }, [])

  return <canvas ref={ref} className="dot-field" aria-hidden="true" />
}
