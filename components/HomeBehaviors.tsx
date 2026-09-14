'use client'
import { useEffect } from 'react'
import { initHome } from '@/lib/home-behaviors'

// Runs the home page's DOM behaviour after the markup is on the page, and tears
// it down on unmount so navigating away and back does not stack duplicates.
export default function HomeBehaviors() {
  useEffect(() => initHome(), [])
  return null
}
