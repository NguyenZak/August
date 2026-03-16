import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { authenticateJWT } from '@/lib/auth'

export async function GET(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        const startOfSevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

        // 1. Total visits
        const { count: totalVisits, error: countError } = await supabase
            .from('visitor_logs')
            .select('*', { count: 'exact', head: true })
        
        if (countError) throw countError

        // 2. Unique visitors today (by ip_hash)
        const { data: todayUnique, error: uniqueError } = await supabase
            .from('visitor_logs')
            .select('ip_hash')
            .gte('created_at', startOfDay)

        if (uniqueError) throw uniqueError
        
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

        // 5. Recent logs
        const { data: logs, error: logsError } = await supabase
            .from('visitor_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (logsError) throw logsError

        return NextResponse.json({
            totalVisits: totalVisits || 0,
            uniqueToday: uniqueTodayCount,
            deviceBreakdown: deviceStats || {},
            topPaths: pathStats,
            recentLogs: logs || []
        })
    } catch (error: any) {
        console.error('Analytics stats error:', error)
        return NextResponse.json({ 
            message: error.message,
            details: error.details,
            hint: error.hint
        }, { status: 500 })
    }
}
