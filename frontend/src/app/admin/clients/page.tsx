"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Plus, Search, Trash2, Edit2, Save, X, Image as ImageIcon, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cmsService, Partner } from "@/services/api";

export default function AdminClientsPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partner | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({ name: "", url: "", logo: "" });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await cmsService.uploadFiles([file]);
            setFormData(prev => ({ ...prev, logo: response.data[0].url }));
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Tải lên thất bại!");
        } finally {
            setIsUploading(false);
        }
    };

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const response = await cmsService.getPartners();
            setPartners(response.data);
        } catch (err) {
            console.error("Error fetching partners:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleOpenModal = (item: Partner | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ name: item.name, url: item.url, logo: item.logo });
        } else {
            setEditingItem(null);
            setFormData({ name: "", url: "", logo: "" });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await cmsService.updatePartner(editingItem.id, formData);
            } else {
                await cmsService.createPartner(formData);
            }
            fetchPartners();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving partner:", err);
            alert("Có lỗi xảy ra khi lưu đối tác.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa đối tác này?")) {
            try {
                await cmsService.deletePartner(id);
                fetchPartners();
            } catch (err) {
                console.error("Error deleting partner:", err);
                alert("Không thể xóa đối tác.");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter lowercase">Quản lý Đối tác</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Cập nhật logo các đối tác và khách hàng chiến lược hiển thị trên website.</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="bg-black text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl text-sm lowercase tracking-tight">
                        <Plus className="w-5 h-5 text-[#dafc69]" /> Thêm đối tác
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {partners.map((partner) => (
                        <motion.div layout key={partner.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center group relative overflow-hidden">
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(partner)} className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleDelete(partner.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="w-24 h-24 bg-gray-50 rounded-full mb-6 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform shadow-inner overflow-hidden">
                                {partner.logo ? (
                                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain p-4" />
                                ) : (
                                    <span className="text-3xl font-black text-gray-200 uppercase">{partner.name.charAt(0)}</span>
                                )}
                            </div>
                            <h4 className="font-black text-gray-900 tracking-tight lowercase">{partner.name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1"><Globe className="w-3 h-3" /> {partner.url || 'chưa có website'}</p>
                        </motion.div>
                    ))}
                    {partners.length === 0 && !isLoading && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">Chưa có đối tác nào được cập nhật.</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl z-10 p-10">
                                <div className="flex items-center justify-between mb-8 text-black">
                                    <h2 className="text-2xl font-black lowercase tracking-tighter">{editingItem ? 'Sửa đối tác' : 'Đối tác mới'}</h2>
                                    <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-black transition-colors" /></button>
                                </div>
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="space-y-2 text-black">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tên thương hiệu</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none" />
                                    </div>
                                    <div className="space-y-2 text-black">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Website URL</label>
                                        <input value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none" placeholder="example.com" />
                                    </div>
                                    <div className="space-y-2 text-black">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logo thương hiệu</label>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.logo}
                                                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none"
                                                    placeholder="Dán URL hoặc tải lên..."
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    disabled={isUploading}
                                                />
                                                <div className={`h-full px-5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                                    {isUploading ? (
                                                        <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Plus className="w-3 h-3" />
                                                    )}
                                                    tải
                                                </div>
                                            </div>
                                        </div>
                                        {formData.logo && (
                                            <div className="mt-4 w-24 h-24 mx-auto bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-4 shadow-inner">
                                                <img src={formData.logo} className="w-full h-full object-contain" alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                    <button type="submit" className="w-full mt-6 py-4 bg-black text-white rounded-full font-black lowercase text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform"><Save className="w-5 h-5 text-[#dafc69]" /> {editingItem ? 'Cập nhật' : 'Thêm mới'}</button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}
