"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Save,
    X,
    Star,
    MessageSquare,
    UserCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cmsService, Review } from "@/services/api";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Review | null>(null);
    const [formData, setFormData] = useState({
        author: "",
        content: "",
        project: ""
    });

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const response = await cmsService.getReviews();
            setReviews(response.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleOpenModal = (item: Review | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                author: item.author,
                content: item.content,
                project: item.project
            });
        } else {
            setEditingItem(null);
            setFormData({
                author: "",
                content: "",
                project: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await cmsService.updateReview(editingItem.id, formData);
            } else {
                await cmsService.createReview(formData);
            }
            fetchReviews();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving review:", err);
            alert("Có lỗi xảy ra khi lưu đánh giá.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa đánh giá này?")) {
            try {
                await cmsService.deleteReview(id);
                fetchReviews();
            } catch (err) {
                console.error("Error deleting review:", err);
                alert("Không thể xóa đánh giá.");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter lowercase">Quản lý Đánh giá</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Quản lý nhận xét từ khách hàng và đối tác để hiển thị trên phần Testimonials.</p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-black hover:bg-gray-800 transition-all text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-xl text-sm whitespace-nowrap lowercase tracking-tight"
                    >
                        <Plus className="w-5 h-5 text-[#dafc69]" />
                        thêm đánh giá
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <motion.div
                            layout
                            key={review.id}
                            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black">
                                    <UserCircle className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(review)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(review.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <blockquote className="text-lg font-bold italic text-gray-900 mb-6 leading-relaxed">
                                "{review.content}"
                            </blockquote>

                            <div className="pt-6 border-t border-gray-50">
                                <p className="font-black text-gray-900 lowercase tracking-tight">{review.author}</p>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">{review.project}</p>
                            </div>
                        </motion.div>
                    ))}
                    {reviews.length === 0 && !isLoading && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">Chưa có đánh giá nào được tạo.</p>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl z-10">
                                <form onSubmit={handleSave} className="p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-black lowercase tracking-tighter">{editingItem ? 'Sửa đánh giá' : 'Thêm đánh giá'}</h2>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tên tác giả / Chức vụ</label>
                                            <input required value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none" placeholder="Vd: Mr. Sophie - CEO August" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dự án / Công ty</label>
                                            <input required value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none" placeholder="Vd: Growe Partners" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nội dung nhận xét</label>
                                            <textarea required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none resize-none" placeholder="Nhập nội dung đánh giá..." />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full mt-10 py-5 bg-black text-white rounded-full font-black lowercase text-xl flex items-center justify-center gap-3"><Save className="w-6 h-6 text-[#dafc69]" /> {editingItem ? 'Cập nhật' : 'Lưu đánh giá'}</button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}
