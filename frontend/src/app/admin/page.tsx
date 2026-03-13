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

export default function AdminDashboard() {
    const stats = [
        { label: "Tổng Dự án", value: "9", icon: Briefcase, color: "bg-blue-500", detail: "3 dự án mới tháng này" },
        { label: "Dịch vụ", value: "2", icon: Wrench, color: "bg-purple-500", detail: "Sự kiện & Marketing" },
        { label: "Tin nhắn mới", value: "24", icon: Mail, color: "bg-[#dafc69]", textColor: "text-black", detail: "5 yêu cầu chưa đọc" },
        { label: "Đối tác", value: "12", icon: Users, color: "bg-gray-900", detail: "Hiển thị trên website" },
    ];

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
                            href={i === 0 ? "/admin/cases" : i === 1 ? "/admin/services" : i === 3 ? "/admin/reviews" : "#"}
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
                            <button className="text-sm font-bold text-blue-600 hover:underline">Xem tất cả</button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {[
                                { name: "Nguyễn Văn A", phone: "0912345678", project: "Marketing Strategy", time: "10 phút trước" },
                                { name: "Growe Partners", phone: "0988776655", project: "Commercial Film", time: "2 giờ trước" },
                                { name: "August Events", phone: "0900112233", project: "Fashion Show", time: "Hôm qua" },
                            ].map((item, i) => (
                                <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold group-hover:bg-[#dafc69] group-hover:text-black transition-colors">
                                            {item.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 tracking-tight">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.phone} • {item.project}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-400">{item.time}</span>
                                </div>
                            ))}
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
