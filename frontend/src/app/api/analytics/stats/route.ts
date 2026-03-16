import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        const startOfSevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

        // 1. Total visits
        const { count: totalVisits } = await supabase
            .from('visitor_logs')
            .select('*', { count: 'exact', head: true })

        // 2. Unique visitors today (by ip_hash)
        const { data: todayUnique } = await supabase
            .from('visitor_logs')
            .select('ip_hash')
            .gte('created_at', startOfDay)
        
        const uniqueTodayCount = new Set(todayUnique?.map(v => v.ip_hash)).size

        // 3. Device breakdown
        const { data: devices } = await supabase
            .from('visitor_logs')
            .select('device_type')
            .gte('created_at', startOfSevenDays)
        
        const deviceStats = devices?.reduce((acc: any, curr) => {
            const type = curr.device_type || 'unknown'
            acc[type] = (acc[type] || 0) + 1
            return acc
        }, {})

        // 4. Top paths
        const { data: paths } = await supabase
            .from('visitor_logs')
            .select('pathname')
            .gte('created_at', startOfSevenDays)
        
        const pathStats = Object.entries(paths?.reduce((acc: any, curr) => {
            acc[curr.pathname] = (acc[curr.pathname] || 0) + 1
            return acc
        }, {}) || {}).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5)

        return NextResponse.json({
            totalVisits: totalVisits || 0,
            uniqueToday: uniqueTodayCount,
            deviceBreakdown: deviceStats || {},
            topPaths: pathStats
        })
    } catch (error: any) {
        console.error('Analytics stats error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
