import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { userAgent } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const { pathname, referrer } = await req.json()
        const { device, browser, os } = userAgent(req)
        
        // Get IP (handling direct and proxied requests)
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                   req.headers.get('x-real-ip') || 
                   'unknown'
        
        // Create a hash of the IP for privacy (GDPR compliance)
        // We salt it with the current date so it changes daily, making it harder to track long-term but allowing daily unique counts
        const dateStr = new Date().toISOString().split('T')[0]
        const ipHash = crypto.createHash('sha256').update(ip + dateStr).digest('hex')

        const supabase = await createClient()
        
        const { error } = await supabase.from('visitor_logs').insert({
            ip_hash: ipHash,
            user_agent: req.headers.get('user-agent'),
            device_type: device.type || 'desktop',
            browser: browser.name,
            os: os.name,
            pathname: pathname || '/',
            referrer: referrer || 'direct'
        })

        if (error) {
            console.error('Error logging visitor:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Analytics track error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
