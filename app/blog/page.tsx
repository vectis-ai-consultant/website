import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { formatDate, getAllPosts, type PostMeta } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing from Vectis AI on AI agents, automation and what the work actually costs — for Toronto businesses.',
}

// Cards carry typographic artwork rather than photography: a display-serif fragment
// of the title on a panel. Nothing to art-direct, and it never ships an image.
function Art({ post, big }: { post: PostMeta; big?: boolean }) {
  const fragment = post.title.split(/[:.—]/)[0]!.split(/\s+/).slice(0, big ? 5 : 3).join(' ')
  return (
    <div className="cardArt" style={big ? undefined : { aspectRatio: '16 / 11', padding: '22px 24px' }}>
      <b style={big ? undefined : { fontSize: 26, maxWidth: '70%' }}>{fragment}</b>
      {/* Decorative: the card's meaning is entirely in the text beside it. */}
      <svg viewBox="0 0 200 140" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
        <rect x="96" y="6" width="86" height="52" rx="7" transform="rotate(-8 139 32)" />
        <circle cx="104" cy="40" r="4.5" />
        <path d="M104 44c-14 10-20 26-18 44" />
        <path d="M126 24h40M126 34h30" strokeWidth="1" />
        <path d="M18 88h74" /><circle cx="97" cy="88" r="4" />
        <path d="M18 108h108" /><circle cx="131" cy="108" r="4" />
        <path d="M150 100v16" /><path d="M144 100h6M144 116h6" />
        <path d="M18 128h130" /><circle cx="153" cy="128" r="4" />
      </svg>
      <span className="cardArtFoot">
        <b>Vectis AI</b>
        <span>{post.resource ? 'free resource' : 'from the blog'}</span>
      </span>
    </div>
  )
}

function Card({ post, big }: { post: PostMeta; big?: boolean }) {
  const H = big ? 'h2' : 'h3'
  return (
    <Link href={`/blog/${post.slug}`} className="card">
      <Art post={post} big={big} />
      <p className="eyebrow">
        {post.resource ? 'Free resource' : 'Article'}
        {post.readingTime ? ` · ${post.readingTime} min read` : ''}
      </p>
      <H className="dsp">{post.title}</H>
      {big && post.excerpt && <p>{post.excerpt}</p>}
      {!big && post.date && (
        <p style={{ fontSize: 13, color: '#7b83a8', marginTop: 8 }}>{formatDate(post.date)}</p>
      )}
    </Link>
  )
}

export default async function BlogIndex() {
  const posts = await getAllPosts()
  const [featured, ...rest] = posts

  return (
    <>
      <Nav active="blog" />

      <main className="artPage" style={{ paddingTop: 140 }}>
        <header style={{ marginBottom: 56 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>The Vectis AI blog</p>
          <h1 className="dsp" style={{ fontSize: 'var(--headline-1)', lineHeight: 1.08, letterSpacing: '-.015em', margin: 0, maxWidth: 900 }}>
            What this work costs, and what it actually does
          </h1>
          <p style={{ margin: '18px 0 0', maxWidth: 640, fontSize: 'var(--body-large)', lineHeight: 1.65, color: '#3e414f' }}>
            Practical writing from Steric and the Vectis AI team &mdash; the pipelines we run,
            what they cost, and where they stop being worth it.
          </p>
        </header>

        {!featured ? (
          <p style={{ fontSize: 17, color: '#7b83a8', padding: '40px 0 90px' }}>
            Nothing published yet. The first pieces are being written now.
          </p>
        ) : (
          <div className="blogGrid">
            <Card post={featured} big />
            {/* The rail only exists once there is a second post; with one, the
                featured card takes the page on its own. */}
            {rest.length > 0 && (
              <div className="railList">
                {rest.map((p) => <Card key={p.slug} post={p} />)}
              </div>
            )}
          </div>
        )}

        <footer style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#7b83a8', borderTop: '1px solid #d3d6e0', margin: '80px 0 0', padding: '24px 0 90px' }}>
          <span>&copy; 2026 Vectis AI</span>
          <Link href="/free-resources" className="hv1" style={{ color: '#7b83a8' }}>Free resources &rarr;</Link>
        </footer>
      </main>
    </>
  )
}
