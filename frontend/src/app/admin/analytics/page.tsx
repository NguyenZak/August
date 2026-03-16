'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import { useState, useEffect } from 'react'
import { cmsService } from '@/services/api'
import { 
    Activity, 
     Smartphone, 
    Monitor, 
    Tablet, 
    Globe, 
    Link as LinkIcon,
    ChevronRight,
    Search
} from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null)
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await cmsService.getAnalyticsStats()
                setAnalytics(statsRes.data)
                setLogs(statsRes.data.recentLogs || [])
            } catch (error) {
                console.error('Error fetching analytics:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredLogs = logs.filter(log => 
        log.pathname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.os?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.browser?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getDeviceIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'mobile': return <Smartphone className="w-4 h-4" />
            case 'tablet': return <Tablet className="w-4 h-4" />
            default: return <Monitor className="w-4 h-4" />
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black lowercase tracking-tighter">phân tích truy cập</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Dữ liệu thời gian thực từ website</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Tổng lượt xem</span>
                        </div>
                        <h3 className="text-4xl font-black tracking-tighter">{analytics?.totalVisits?.toLocaleString() || '...'}</h3>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Unique (Hôm nay)</span>
                        </div>
                        <h3 className="text-4xl font-black tracking-tighter">{analytics?.uniqueToday?.toLocaleString() || '...'}</h3>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                <LinkIcon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Trang phổ biến nhất</span>
                        </div>
                        <h3 className="text-lg font-black tracking-tight truncate">{analytics?.topPaths?.[0]?.[0] || '...'}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Device Breakdown */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden h-fit">
                        <h2 className="text-xl font-black tracking-tighter lowercase mb-6">Thiết bị truy cập</h2>
                        <div className="space-y-4">
                            {analytics?.deviceBreakdown && Object.entries(analytics.deviceBreakdown).map(([device, count]: [string, any]) => (
                                <div key={device} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            {getDeviceIcon(device)}
                                        </div>
                                        <span className="text-sm font-bold capitalize">{device}</span>
                                    </div>
                                    <span className="text-xs font-black">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Logs */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-xl font-black tracking-tighter lowercase">Nhật ký truy cập gần đây</h2>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm trang, os..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-6 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#dafc69] outline-none w-full md:w-64 transition-all"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thời gian</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Trang</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thiết bị / OS</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Nguồn</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">
                                                {new Date(log.created_at).toLocaleTimeString('vi-VN')}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-bold text-gray-900 truncate max-w-[150px]">
                                                    {log.pathname}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-black uppercase">{log.browser}</span>
                                                    <span className="text-gray-400">/</span>
                                                    <span className="font-bold text-gray-600">{log.os}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-bold text-blue-500 truncate max-w-[150px]">
                                                {log.referrer}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredLogs.length === 0 && (
                                <div className="px-8 py-12 text-center text-gray-300 italic text-sm">
                                    Chưa có dữ liệu truy cập
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
