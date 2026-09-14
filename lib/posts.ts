// Posts are read from disk at BUILD time. Nothing here reaches the browser —
// this is the whole reason for the migration: the old page shipped marked.js and
// rendered client-side, so crawlers and link previews saw an empty article.
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

// YAML parses an unquoted `date: 2026-09-07` into a Date at UTC midnight. Left as
// a Date, String() yields "Sun Sep 06 2026 20:00:00 GMT-0400" — the previous day
// in Toronto. Take the UTC calendar day, which is what the author wrote.
function toISODate(value: unknown): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '')
}

// Headings get stable slugs so sections are linkable, the way a long-form
// engineering post is expected to behave.
function slugify(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    // Entities first: marked emits &#39; for a curly apostrophe, and stripping
    // non-word characters afterwards would leave the "39" behind in the slug.
    .replace(/&[#\w]+;/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

marked.use({
  renderer: {
    heading(this: { parser: { parseInline(tokens: unknown[]): string } }, { tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      return `<h${depth} id="${slugify(text)}">${text}</h${depth}>\n`
    },
  },
})

export type PostMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  resource?: string
  readingTime?: number
  author: string
}

export type Heading = { id: string; text: string }
export type Post = PostMeta & { html: string; headings: Heading[] }

// Read the ids back out of the rendered HTML rather than re-slugifying the source.
// Two code paths producing the same slug is one code path too many: the entity
// handling above would have to be duplicated exactly, and a table-of-contents that
// links to an id that does not exist fails silently.
function collectHeadings(html: string): Heading[] {
  return [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(([, id, inner]) => ({
    id,
    text: inner.replace(/<[^>]*>/g, '').replace(/&#39;/g, '\u2019').replace(/&amp;/g, '&'),
  }))
}

async function readPost(file: string): Promise<Post> {
  const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8')
  const { data, content } = matter(raw)
  const slug = String(data.slug ?? file.replace(/\.md$/, ''))
  const html = await marked.parse(content, { async: true, gfm: true })
  return {
    slug,
    title: String(data.title ?? slug),
    date: toISODate(data.date),
    excerpt: String(data.excerpt ?? ''),
    resource: data.resource ? String(data.resource) : undefined,
    author: String(data.author ?? 'Vectis AI'),
    readingTime: data.readingTime ? Number(data.readingTime) : undefined,
    html,
    headings: collectHeadings(html),
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'))
  const posts = await Promise.all(files.map(readPost))
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return Number.isNaN(d.valueOf())
    ? iso
    : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

// "Steric Tsui" -> "ST". Used for the byline avatar, which has no image to load.
export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('')
}
