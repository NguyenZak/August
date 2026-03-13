"use client";
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
    Facebook,
    ShieldCheck,
    AlertCircle,
    RefreshCw,
    XCircle,
    Plus,
    Search,
    Filter,
    Settings,
    MoreVertical,
    CheckCircle2,
    Users,
    Info,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FanpagePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

    const fanpages = [
        {
            id: 1,
            name: "Tiệm Giày Sneaker TPHCM",
            category: "Mua sắm & Bán lẻ",
            role: "Quản trị viên",
            followers: "14,500",
            status: "Active",
            img: "https://ui-avatars.com/api/?name=Sneaker+Store&background=5a67d8&color=fff"
        },
        {
            id: 2,
            name: "Thời trang nữ Cao cấp",
            category: "Quần áo (Thương hiệu)",
            role: "Biên tập viên",
            followers: "8,206",
            status: "Expired",
            img: "https://ui-avatars.com/api/?name=Thoi+Trang+Nu&background=ed64a6&color=fff"
        },
        {
            id: 3,
            name: "August Events UK",
            category: "Công ty sự kiện",
            role: "Quản trị viên",
            followers: "25,100",
            status: "Active",
            img: "https://ui-avatars.com/api/?name=August+Events&background=dafc69&color=000"
        }
    ];

    const filteredPages = fanpages.filter(page =>
        page.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter lowercase">Quản lý Fanpage</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Kết nối và quản lý quyền truy cập các trang Facebook để tự động hóa quy trình seeding và marketing của bạn.</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsSelectModalOpen(true)}
                        className="bg-[#1877F2] hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 text-sm whitespace-nowrap"
                    >
                        <Facebook className="w-5 h-5" />
                        Kết nối Facebook
                    </motion.button>
                </div>

                {/* Quick Stats & Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 flex gap-5">
                        <div className="bg-blue-100 p-3 rounded-2xl h-fit flex-shrink-0">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Bảo mật Access Token</h3>
                            <p className="text-sm text-blue-800/80 mt-2 leading-relaxed">
                                August chỉ yêu cầu các quyền cần thiết để vận hành hệ thống. Chúng tôi cam kết không lưu trữ mật khẩu cá nhân và bạn có thể thu hồi quyền bất cứ lúc nào qua Facebook Business.
                            </p>
                            <button className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                Tìm hiểu thêm về chính sách bảo mật <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col justify-center">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tổng số trang</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black">{fanpages.length}</span>
                            <span className="text-sm font-bold text-[#dafc69]">/ 10 giới hạn</span>
                        </div>
                    </div>
                </div>

                {/* Content Table Area */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm trang bằng tên hoặc ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1877F2] transition-all outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors border-none outline-none">
                                <Filter className="w-5 h-5" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors">
                                <RefreshCw className="w-4 h-4" /> Đồng bộ tất cả
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/30">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Thông tin Fanpage</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Followers</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Vai trò</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trạng thái</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredPages.map((page) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={page.id}
                                        className={`hover:bg-gray-50/50 transition-colors ${page.status === 'Expired' ? 'bg-red-50/20' : ''}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                                                    <img src={page.img} alt={page.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 tracking-tight">{page.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5">{page.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-300" />
                                                <span className="text-sm font-bold text-gray-700">{page.followers}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black uppercase tracking-tighter text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">{page.role}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${page.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${page.status === 'Active' ? 'bg-green-500' : 'bg-red-600 animate-pulse'}`}></div>
                                                {page.status === 'Active' ? 'Đang hoạt động' : 'Hết hạn token'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {page.status === 'Expired' ? (
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all shadow-sm">
                                                        <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                                                    </button>
                                                ) : (
                                                    <button className="p-2.5 text-gray-400 hover:text-[#1877F2] hover:bg-blue-50 rounded-xl transition-all">
                                                        <Settings className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Select Fanpage Modal Mockup */}
                <AnimatePresence>
                    {isSelectModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSelectModalOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl z-10"
                            >
                                <div className="p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black lowercase tracking-tighter">chọn fanpage</h2>
                                            <p className="text-gray-500 mt-1">Chọn những trang bạn muốn August tự động hóa.</p>
                                        </div>
                                        <button onClick={() => setIsSelectModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                                            <XCircle className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-3xl border-2 border-gray-50 hover:border-[#dafc69] hover:bg-gray-50/30 transition-all group cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 truncate max-w-[200px]">Facebook Page #{i}</h4>
                                                        <p className="text-xs text-gray-500">Người theo dõi: 2.4k</p>
                                                    </div>
                                                </div>
                                                <div className="w-6 h-6 rounded-lg border-2 border-gray-200 flex items-center justify-center group-hover:border-[#dafc69]">
                                                    <div className="w-3 h-3 bg-[#dafc69] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full mt-10 py-4 bg-black text-white rounded-full font-black lowercase text-xl hover:scale-[1.02] transition-transform shadow-xl shadow-black/10">
                                        kết nối 5 fanpage đã chọn
                                    </button>
                                </div>
                                <div className="bg-[#dafc69] py-4 px-10 flex items-center gap-3">
                                    <Info className="w-4 h-4 text-black" />
                                    <p className="text-xs font-bold text-black uppercase tracking-tight">nếu không thấy trang của bạn, hãy cập nhật lại quyền truy cập Facebook.</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
