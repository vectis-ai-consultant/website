import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import EmailGate from '@/components/EmailGate'
import Toc from '@/components/Toc'
import ShareRow from '@/components/ShareRow'
import { formatDate, getAllPosts, getPost, initials } from '@/lib/posts'

type Params = { params: Promise<{ slug: string }> }

// Every post becomes a static HTML file at build time.
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function PostPage({ params }: Params) {
  const post = await getPost((await params).slug)
  if (!post) notFound()

  // The card sits where the post says it does; without the marker it lands at the end.
  const [intro, rest = ''] = post.html.split('<!--gate-->')

  return (
    <>
      <Nav active="blog" />

      {/* One container for the whole article: crumbs, masthead, prose and rail all
          start at the same left edge. */}
      <main className="artPage artRead" style={{ paddingTop: 140 }}>
        <ol className="crumbs">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li aria-current="page">{post.resource ? 'Resource' : 'Article'}</li>
        </ol>

        <header className="artHero">
          <p className="eyebrow">
            {post.resource ? 'Free resource' : 'Article'}
            {post.readingTime ? ` · ${post.readingTime} min read` : ''}
          </p>

          <h1 className="dsp">{post.title}</h1>

          {/* Standfirst: the summary carries the argument for readers who stop here. */}
          {post.excerpt && <p className="artSummary">{post.excerpt}</p>}

          <div className="artByline">
            <div className="artAuthor">
              <span className="artAvatar dsp" aria-hidden="true">{initials(post.author)}</span>
              <span>
                <b>{post.author}</b>
                {post.date && <span>{formatDate(post.date)}</span>}
              </span>
            </div>
            <ShareRow url={`https://meetvectis.com/blog/${post.slug}`} title={post.title} />
          </div>
        </header>

        <div className="artBody">
          {/* Rendered from markdown at build time — no client-side parser ships,
              so the prose is in the first byte of the response. The gate is spliced
              in where the markdown marks it, right after the takeaways. */}
          <article className="prose">
            <div dangerouslySetInnerHTML={{ __html: intro }} />

            {/* One instance only — EmailGate carries element ids. */}
            <div className="artGate">
              <div className="eyebrow" style={{ marginBottom: 10 }}>Get the free resource</div>
              <b className="dsp">Run your first batch this week</b>
              <p>
                The workspace, the digest spec and the script &mdash; enough to have fifteen variants on a contact sheet by the end of an afternoon.
              </p>
              <EmailGate resource={post.slug} />
            </div>

            <div dangerouslySetInnerHTML={{ __html: rest }} />
          </article>

          {post.headings.length > 1 && (
            <aside className="artRail">
              <Toc headings={post.headings} />
            </aside>
          )}
        </div>

        <footer style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#7b83a8', borderTop: '1px solid #d3d6e0', margin: '72px auto 0', padding: '24px 0 90px' }}>
          <span>&copy; 2026 Vectis AI</span>
          <Link href="/blog" className="hv1" style={{ color: '#7b83a8' }}>More writing &rarr;</Link>
        </footer>
      </main>
    </>
  )
}
