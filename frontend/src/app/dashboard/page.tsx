"use client";
import AppLayout from "@/components/layout/AppLayout";
import { TrendingUp, Users, DollarSign, CalendarRange, ArrowUpRight, CheckCircle2 } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";

export default function DashboardPage() {
    const stats = [
        {
            label: "Chi phí Ads hôm nay",
            value: "1,250,000 đ",
            trend: "+12.5%",
            isPositive: true,
            icon: DollarSign,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            label: "Tổng Leads (Tin nhắn)",
            value: "45",
            trend: "+5.2%",
            isPositive: true,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            label: "Tỷ lệ chuyển đổi",
            value: "3.8%",
            trend: "+0.4%",
            isPositive: true,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            label: "Bài chờ Đăng",
            value: "12",
            trend: "+2 bài/ngày",
            isPositive: true,
            icon: CalendarRange,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
    ];

    const fanpages = [
        { name: "Tiệm Giày Sneaker TPHCM", followers: "14.5k", status: "Đang hoạt động", lastUpdate: "10 phút trước" },
        { name: "Thời trang nữ Cao cấp", followers: "8.2k", status: "Hết hạn phiên", lastUpdate: "2 ngày trước" },
        { name: "August Events UK", followers: "25.1k", status: "Đang hoạt động", lastUpdate: "1 giờ trước" },
    ];

    return (
        <RouteGuard allowedRoles={["USER", "SUPER"]}>
            <AppLayout>
                <div className="space-y-8 pb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
                            <p className="text-gray-500 mt-1">Dữ liệu được cập nhật dựa trên thời gian thực từ các tài khoản đã kết nối.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                Xuất báo cáo (CSV)
                            </button>
                            <button className="px-4 py-2 bg-[#1877F2] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm">
                                Xem chi tiết Ads
                            </button>
                        </div>
                    </div>

                    {/* Modern Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                            <Icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.trend} <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                                    <p className="text-3xl font-black text-gray-900 mt-1 tracking-tight">{stat.value}</p>
                                </div>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Chart Section */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Chart Placeholder */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Chi phí & Lượt liên hệ</h3>
                                        <p className="text-sm text-gray-500">Biểu đồ so sánh 14 ngày gần nhất</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                            Chi phí
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                            Tin nhắn
                                        </div>
                                    </div>
                                </div>
                                <div className="h-72 w-full bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-slate-200">
                                    <TrendingUp className="w-12 h-12 text-slate-300 mb-3" />
                                    <p className="text-slate-400 font-bold lowercase tracking-tight">vui lòng kết nối tài khoản ads để xem biểu đồ</p>
                                </div>
                            </div>

                            {/* Fanpage Status Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900">Trạng thái Fanpage</h3>
                                    <button className="text-[#1877F2] text-sm font-semibold hover:underline">Quản lý tất cả</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tên trang</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Người theo dõi</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cập nhật</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {fanpages.map((page, i) => (
                                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{page.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{page.followers}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${page.status === 'Đang hoạt động'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'Đang hoạt động' ? 'bg-green-500' : 'bg-red-500'
                                                                }`}></span>
                                                            {page.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-400">{page.lastUpdate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Left Sidebar: Activity & Schedule */}
                        <div className="space-y-8">
                            {/* Recent Activity */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                                <h3 className="text-lg font-bold text-gray-900 mb-8 lowercase tracking-tight">Hoạt động</h3>
                                <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                                    <div className="flex gap-6 relative">
                                        <div className="w-3.5 h-3.5 mt-1.5 rounded-full bg-green-500 z-10 border-2 border-white shadow-sm ring-4 ring-green-50"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Chiến dịch Seeding thành công</p>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Post "Sale 50%" đạt target 50 likes.</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">10 phút trước</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 relative">
                                        <div className="w-3.5 h-3.5 mt-1.5 rounded-full bg-blue-500 z-10 border-2 border-white shadow-sm ring-4 ring-blue-50"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Đăng bài tự động</p>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Đã đăng thành công lên 3 Fanpages.</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">1 giờ trước</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 relative">
                                        <div className="w-3.5 h-3.5 mt-1.5 rounded-full bg-orange-500 z-10 border-2 border-white shadow-sm ring-4 ring-orange-50"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 text-orange-600">Hết hạn Access Token</p>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Page "Thời trang nữ" cần kết nối lại.</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">2 giờ trước</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scheduled Content Preview */}
                            <div className="bg-indigo-600 p-8 rounded-2xl shadow-lg text-white">
                                <h3 className="text-lg font-bold lowercase tracking-tight mb-6">Nội dung sắp tới</h3>
                                <div className="space-y-4">
                                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                        <p className="text-xs font-black uppercase text-indigo-200 mb-1">Thứ 7, 15:00</p>
                                        <p className="text-sm font-semibold truncate">Tưng bừng khai trương cơ sở mới...</p>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                        <p className="text-xs font-black uppercase text-indigo-200 mb-1">Chủ nhật, 09:00</p>
                                        <p className="text-sm font-semibold truncate">Review giày Sneaker hot nhất tuần...</p>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-3 bg-[#dafc69] text-black rounded-xl font-bold text-sm lowercase hover:scale-105 transition-transform">
                                    Quản lý lịch đăng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </RouteGuard>
    );
}
