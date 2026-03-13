"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Search,
    Trash2,
    Mail,
    Phone,
    User,
    Calendar,
    MessageSquare,
    Filter,
    X,
    Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cmsService, Inquiry } from "@/services/api";

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const response = await cmsService.getInquiries();
            setInquiries(response.data);
        } catch (err) {
            console.error("Error fetching inquiries:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Xóa tin nhắn này?")) {
            try {
                await cmsService.deleteInquiry(id);
                fetchInquiries();
            } catch (err) {
                console.error("Error deleting inquiry:", err);
                alert("Không thể xóa tin nhắn.");
            }
        }
    };

    const filteredInquiries = inquiries.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter lowercase">Hộp thư liên hệ</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Quản lý các yêu cầu tư vấn và tin nhắn từ khách hàng qua form liên hệ.</p>
                    </div>

                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tin nhắn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] focus:border-transparent outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Khách hàng</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Loại dự án</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Ngày gửi</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredInquiries.map((item) => (
                                    <motion.tr layout key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 lowercase tracking-tight">{item.name}</p>
                                                    <p className="text-xs text-gray-400 font-bold lowercase">{item.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                                                {item.project_type || 'Tư vấn chung'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelectedInquiry(item)} className="p-3 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-200 rounded-xl transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredInquiries.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Mail className="w-12 h-12 text-gray-200" />
                                                <p className="text-gray-400 font-medium">Không tìm thấy tin nhắn nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail View Modal */}
                <AnimatePresence>
                    {selectedInquiry && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedInquiry(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl z-10 p-10">
                                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-black lowercase tracking-tighter">Chi tiết tin nhắn</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {selectedInquiry.id}</p>
                                    </div>
                                    <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Khách hàng</p>
                                            <p className="text-lg font-black text-gray-900 lowercase">{selectedInquiry.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ngày gửi</p>
                                            <p className="text-lg font-bold text-gray-600">{new Date(selectedInquiry.created_at).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                                <Mail className="w-4 h-4" /> {selectedInquiry.email}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số điện thoại</p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                                <Phone className="w-4 h-4" /> {selectedInquiry.phone || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nội dung tin nhắn</p>
                                        <div className="bg-gray-50 p-6 rounded-[2rem] text-sm text-gray-700 leading-relaxed italic border border-gray-100">
                                            "{selectedInquiry.message}"
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <a href={`mailto:${selectedInquiry.email}`} className="flex-1 bg-black text-white py-4 rounded-full font-black text-center flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors">
                                        <Mail className="w-5 h-5 text-[#dafc69]" /> Phản hồi qua Email
                                    </a>
                                    <button onClick={() => setSelectedInquiry(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-full font-black hover:bg-gray-200 transition-colors">
                                        Đã xem
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}
