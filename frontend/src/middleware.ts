import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // Define allowed domains (including localhost for development)
    const allowedDomains = ['fbtoolzz.com', 'localhost:3000']

    // Check if current hostname is a subdomain
    const isSubdomain = allowedDomains.some(domain =>
        hostname.endsWith(`.${domain}`)
    )

    if (isSubdomain) {
        const subdomain = hostname.split('.')[0]
        // Rewrite to /brand/[subdomain]
        return NextResponse.rewrite(new URL(`/brand/${subdomain}${url.pathname}`, request.url))
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
