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
    Zap,
    Target,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MediaLibraryModal from "@/components/common/MediaLibraryModal";
import { cmsService, Service } from "@/services/api";
import { slugify } from "@/lib/utils";

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        category: "Marketing",
        icon: "Zap",
        image_url: ""
    });
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await cmsService.getServices();
            setServices(response.data);
        } catch (err) {
            console.error("Error fetching services:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenModal = (item: Service | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                slug: item.slug || "",
                description: item.description,
                category: item.category,
                icon: item.icon || "Zap",
                image_url: item.image_url || ""
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: "",
                slug: "",
                description: "",
                category: "Marketing",
                icon: "Zap",
                image_url: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await cmsService.updateService(editingItem.id, formData);
            } else {
                await cmsService.createService(formData);
            }
            fetchServices();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving service:", err);
            alert("Có lỗi xảy ra khi lưu dịch vụ.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa dịch vụ này?")) {
            try {
                await cmsService.deleteService(id);
                fetchServices();
            } catch (err) {
                console.error("Error deleting service:", err);
                alert("Không thể xóa dịch vụ.");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter lowercase">Quản lý Dịch vụ</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Chỉnh sửa nội dung cho các gói dịch vụ hiển thị trên trang chủ và trang chi tiết.</p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-black hover:bg-gray-800 transition-all text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-xl text-sm whitespace-nowrap lowercase tracking-tight"
                    >
                        <Plus className="w-5 h-5 text-[#dafc69]" />
                        thêm dịch vụ
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service) => (
                        <motion.div
                            layout
                            key={service.id}
                            className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
                        >
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${service.category === 'Marketing' ? 'bg-[#dafc69] text-black' : 'bg-black text-[#dafc69]'}`}>
                                        {service.icon === 'Zap' ? <Zap className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenModal(service)} className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(service.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{service.category}</span>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter lowercase mt-1 mb-4">{service.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl z-10">
                                <form onSubmit={handleSave} className="p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-black lowercase tracking-tighter">{editingItem ? 'Sửa dịch vụ' : 'Dịch vụ mới'}</h2>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tên dịch vụ</label>
                                                <input
                                                    required
                                                    value={formData.title}
                                                    onChange={e => {
                                                        const newTitle = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            title: newTitle,
                                                            slug: editingItem ? prev.slug : slugify(newTitle)
                                                        }));
                                                    }}
                                                    className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Đường dẫn (Slug)</label>
                                                <input
                                                    required
                                                    value={formData.slug}
                                                    onChange={e => setFormData({ ...formData, slug: slugify(e.target.value) })}
                                                    className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none"
                                                    placeholder="tên-dich-vu"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mô tả ngắn</label>
                                            <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none resize-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hạng mục</label>
                                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none appearance-none">
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="Events">Events</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Icon</label>
                                                <select value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none appearance-none">
                                                    <option value="Zap">Zap (Tia sét)</option>
                                                    <option value="Target">Target (Mục tiêu)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hình ảnh minh họa</label>
                                            <div className="flex gap-2">
                                                <input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="flex-1 px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none" placeholder="URL hình ảnh..." />
                                                <button type="button" onClick={() => setIsMediaModalOpen(true)} className="px-6 bg-black text-white rounded-[1.5rem] font-black text-xs lowercase hover:bg-gray-800 transition-colors">chọn ảnh</button>
                                            </div>
                                            {formData.image_url && (
                                                <div className="mt-4 w-full h-32 rounded-[1.5rem] overflow-hidden border border-gray-100 italic">
                                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full mt-10 py-5 bg-black text-white rounded-full font-black lowercase text-xl flex items-center justify-center gap-3"><Save className="w-6 h-6 text-[#dafc69]" /> {editingItem ? 'Cập nhật' : 'Lưu dịch vụ'}</button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                <MediaLibraryModal
                    isOpen={isMediaModalOpen}
                    onClose={() => setIsMediaModalOpen(false)}
                    onSelect={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    title="Chọn ảnh dịch vụ"
                />
            </div>
        </AdminLayout>
    );
}
