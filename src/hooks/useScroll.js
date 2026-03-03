import { useState, useEffect } from 'react'

/**
 * Custom hook for managing scroll position
 * @returns {boolean} Whether the user has scrolled down the page
 */
export function useScroll() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return isScrolled
}
