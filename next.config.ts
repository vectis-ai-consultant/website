import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // legacy/ holds the pre-migration static site; it is reference material, not source.
  outputFileTracingExcludes: { '*': ['./legacy/**'] },
}

export default nextConfig
