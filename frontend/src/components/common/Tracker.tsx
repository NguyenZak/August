'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Tracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Don't track admin pages to avoid skewing public analytics
        if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return

        const trackVisit = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pathname: window.location.pathname,
                        referrer: document.referrer || 'direct',
                    }),
                })
            } catch (error) {
                // Silently fail to not interrupt user experience
                console.error('Tracking failed:', error)
            }
        }

        trackVisit()
    }, [pathname])

    return null
}
