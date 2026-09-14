import Link from 'next/link'

// One nav for every page. The static build had three hand-copied versions of
// this markup, and they had already drifted apart.
const ACTIVE = { color: '#3a4fae', borderBottom: '1px solid #3a4fae', paddingBottom: 1 }
const LINK = { fontSize: 14, fontWeight: 600 } as const
const CIRCLE = {
  width: 42, height: 42, borderRadius: '50%', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
} as const

export default function Nav({ active }: { active?: 'services' | 'resources' | 'blog' | 'contact' }) {
  // Style plus aria-current, so the marked link is announced as the current page.
  const on = (k: typeof active) =>
    active === k
      ? { style: { ...LINK, ...ACTIVE }, 'aria-current': 'page' as const }
      : { style: LINK }
  // The trigger stays lit for both pages behind it, but only the page you are
  // actually on gets aria-current.
  const inMenu = active === 'resources' || active === 'blog'
  return (
    <div id="navBar" style={{ position: 'fixed', left: 0, right: 0, top: 22, zIndex: 50, display: 'flex', justifyContent: 'center', gap: 10, willChange: 'transform' }}>
      <Link href="/" id="homeBtn" title="Home" aria-label="Back to top" style={{ ...CIRCLE, background: '#1a1740', boxShadow: '0 4px 14px rgba(26,23,64,.18)' }}>
        <svg width="16" height="16" fill="#f2f5fb" viewBox="0 0 20 20" aria-hidden="true"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
      </Link>
      <Link href="/#intro" title="About" style={{ ...CIRCLE, background: '#fbfcfe', boxShadow: '0 4px 14px rgba(26,23,64,.12)' }}>
        <svg width="16" height="16" fill="#1a1740" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
      </Link>
      <div className="navPill" style={{ background: '#fbfcfe', borderRadius: 999, padding: '11px 24px', display: 'flex', gap: 26, alignItems: 'center', boxShadow: '0 4px 14px rgba(26,23,64,.12)' }}>
        <Link href="/#services" {...on('services')}>Services</Link>

        {/* Hover (or keyboard focus) opens the pair. On touch there is no hover,
            so the CSS hides the panel there and shows the flat Blog link below. */}
        <div className="navMenu">
          <Link
            href="/free-resources"
            className="navMenuTrigger"
            style={inMenu ? { ...LINK, ...ACTIVE } : LINK}
            {...(active === 'resources' ? { 'aria-current': 'page' as const } : {})}
          >
            Free resources
          </Link>
          <div className="navMenuPop">
            <div className="navMenuCard">
              <Link href="/free-resources" {...(active === 'resources' ? { 'aria-current': 'page' as const } : {})}>Free resources</Link>
              <Link href="/blog" {...(active === 'blog' ? { 'aria-current': 'page' as const } : {})}>Blog</Link>
            </div>
          </div>
        </div>
        <Link href="/blog" className="navFlatBlog" {...on('blog')}>Blog</Link>

        <Link href="/#contact" {...on('contact')}>Contact</Link>
      </div>
    </div>
  )
}
