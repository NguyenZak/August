"use client";

import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Briefcase,
    Wrench,
    Users,
    Mail,
    ArrowUpRight,
    Clock,
    FileText,
    Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cmsService, Inquiry } from "@/services/api";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { label: "Tổng Dự án", value: "...", icon: Briefcase, color: "bg-blue-500", detail: "Đang tải...", href: "/admin/cases" },
        { label: "Dịch vụ", value: "...", icon: Wrench, color: "bg-purple-500", detail: "Đang tải...", href: "/admin/services" },
        { label: "Tin nhắn mới", value: "...", icon: Mail, color: "bg-[#dafc69]", textColor: "text-black", detail: "Đang tải...", href: "/admin/inquiries" },
        { label: "Lượt truy cập", value: "...", icon: Activity, color: "bg-orange-500", detail: "Đang tải...", href: "/admin/analytics" },
    ]);
    const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Use Promise.allSettled to handle partial failures
                const results = await Promise.allSettled([
                    cmsService.getCases(),
                    cmsService.getServices(),
                    cmsService.getInquiries(),
                    cmsService.getPartners(),
                    cmsService.getAnalyticsStats()
                ]);

                const casesRes = results[0].status === 'fulfilled' ? results[0].value : null;
                const servicesRes = results[1].status === 'fulfilled' ? results[1].value : null;
                const inquiriesRes = results[2].status === 'fulfilled' ? results[2].value : null;
                // const partnersRes = results[3].status === 'fulfilled' ? results[3].value : null;
                const analyticsRes = results[4].status === 'fulfilled' ? results[4].value : null;

                const cases = casesRes?.data || [];
                const services = servicesRes?.data || [];
                const inquiries = inquiriesRes?.data || [];
                const analyticsData = analyticsRes?.data || { totalVisits: 0, uniqueToday: 0, deviceBreakdown: {}, topPaths: [] };
                
                setAnalytics(analyticsData);
                setRecentInquiries(inquiries.slice(0, 5));

                // Calculate stats
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                
                const newCasesThisMonth = cases.filter(c => new Date(c.created_at) >= startOfMonth).length;
                const unreadInquiries = inquiries.filter(i => i.status === 'pending' || i.status === 'new').length;

                setStats([
                    { 
                        label: "Tổng Dự án", 
                        value: cases.length.toString(), 
                        icon: Briefcase, 
                        color: "bg-blue-500", 
                        detail: casesRes ? `${newCasesThisMonth} dự án mới tháng này` : "Lỗi tải dữ liệu",
                        href: "/admin/cases"
                    },
                    { 
                        label: "Dịch vụ", 
                        value: services.length.toString(), 
                        icon: Wrench, 
                        color: "bg-purple-500", 
                        detail: services.length > 0 ? (services[0].category || "Đã cập nhật") : "Chưa có dịch vụ",
                        href: "/admin/services"
                    },
                    { 
                        label: "Tin nhắn", 
                        value: inquiries.length.toString(), 
                        icon: Mail, 
                        color: "bg-[#dafc69]", 
                        textColor: "text-black", 
                        detail: `${unreadInquiries} tin chưa đọc`,
                        href: "/admin/inquiries"
                    },
                    { 
                        label: "Lượt truy cập", 
                        value: analyticsRes ? analyticsData.totalVisits.toLocaleString() : "Chưa sẵn sàng", 
                        icon: Activity, 
                        color: "bg-orange-500", 
                        detail: analyticsRes ? `${analyticsData.uniqueToday} hôm nay` : "Vui lòng kiểm tra database",
                        href: "/admin/analytics"
                    },
                ]);

                if (results[4].status === 'rejected') {
                    console.error("Analytics fetch failed:", results[4].reason);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-8 pb-10">
                {/* Welcome Card */}
                <div className="bg-black rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black lowercase tracking-tighter leading-none mb-4">
                            quản trị nội dung<br />august agency
                        </h1>
                        <p className="text-gray-400 max-w-md text-sm md:text-base mb-8">
                            Chào mừng bạn đến với hệ thống CMS của August. Tại đây bạn có thể cập nhật các dự án mới nhất, chỉnh sửa dịch vụ và quản lý tin nhắn từ khách hàng.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/cases" className="px-6 py-3 bg-[#dafc69] text-black rounded-2xl font-black text-sm lowercase hover:scale-105 transition-transform flex items-center justify-center">
                                quản lý dự án
                            </Link>
                            <Link href="/admin/services" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-black text-sm lowercase hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center">
                                quản lý dịch vụ
                            </Link>
                        </div>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#dafc69]/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <Link
                            key={i}
                            href={stat.href}
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl ${stat.color} ${stat.textColor || 'text-white'} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{stat.value}</h3>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">{stat.label}</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                                <Clock className="w-3 h-3" /> {stat.detail}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Main Views Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Inquiries List */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 lowercase tracking-tighter">tin nhắn gần đây</h2>
                                <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">từ popup liên hệ</p>
                            </div>
                            <Link href="/admin/inquiries" className="text-sm font-bold text-blue-600 hover:underline">Xem tất cả</Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentInquiries.length > 0 ? (
                                recentInquiries.map((item, i) => (
                                    <Link key={item.id} href={`/admin/inquiries?id=${item.id}`} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold group-hover:bg-[#dafc69] group-hover:text-black transition-colors">
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 tracking-tight">{item.name}</h4>
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest text-[9px]">{item.phone} • {item.project_type || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-gray-400">
                                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <div className="px-8 py-10 text-center text-gray-400 italic text-sm">
                                    {isLoading ? "Đang tải tin nhắn..." : "Chưa có tin nhắn nào"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Activity & Logs */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 h-fit">
                        <h2 className="text-xl font-black text-gray-900 lowercase tracking-tighter mb-8">hoạt động cms</h2>
                        <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                            <div className="flex gap-6 relative">
                                <div className="w-6 h-6 mt-1 rounded-full bg-blue-500 z-10 border-4 border-white shadow-md ring-1 ring-blue-100 flex items-center justify-center">
                                    <FileText className="w-2.5 h-2.5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 tracking-tight">Cập nhật Dự án</p>
                                    <p className="text-xs text-gray-500 mt-1">Admin Viz đã sửa "Growe Partners".</p>
                                    <p className="text-[10px] text-gray-400 mt-1 font-black uppercase">Vừa xong</p>
                                </div>
                            </div>
                            <div className="flex gap-6 relative">
                                <div className="w-6 h-6 mt-1 rounded-full bg-[#dafc69] z-10 border-4 border-white shadow-md ring-1 ring-gray-100 flex items-center justify-center">
                                    <Users className="w-2.5 h-2.5 text-black" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 tracking-tight">Thêm Đối tác</p>
                                    <p className="text-xs text-gray-500 mt-1">Đã thêm logo "Nike" vào website.</p>
                                    <p className="text-[10px] text-gray-400 mt-1 font-black uppercase">1 giờ trước</p>
                                </div>
                            </div>
                            <div className="flex gap-6 relative">
                                <div className="w-6 h-6 mt-1 rounded-full bg-purple-500 z-10 border-4 border-white shadow-md ring-1 ring-purple-100 flex items-center justify-center">
                                    <Activity className="w-2.5 h-2.5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 tracking-tight">Hệ thống đồng bộ</p>
                                    <p className="text-xs text-gray-500 mt-1">Dữ liệu website đã được tối ưu hóa.</p>
                                    <p className="text-[10px] text-gray-400 mt-1 font-black uppercase">5 giờ trước</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
