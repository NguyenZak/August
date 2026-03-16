"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Plus,
    Trash2,
    Save,
    X,
    Video,
    Type,
    GripVertical,
    Play,
    Loader2,
    ChevronUp,
    ChevronDown,
    Zap,
    Layout,
    Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MediaLibraryModal from "@/components/common/MediaLibraryModal";
import { cmsService, HeroSlide } from "@/services/api";

export default function AdminHeroPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [formData, setFormData] = useState<Partial<HeroSlide>>({
        title_1: "",
        title_2: "",
        heading: "",
        video_url: ""
    });
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setIsLoading(true);
        try {
            const res = await cmsService.getHeroSlides();
            setSlides(res.data.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
        } catch (err) {
            console.error("Error fetching slides:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (slide: HeroSlide | null = null) => {
        if (slide) {
            setEditingSlide(slide);
            setFormData({
                title_1: slide.title_1,
                title_2: slide.title_2,
                heading: slide.heading,
                video_url: slide.video_url
            });
        } else {
            setEditingSlide(null);
            setFormData({
                title_1: "",
                title_2: "",
                heading: "",
                video_url: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingSlide) {
                await cmsService.updateHeroSlide(editingSlide.id, formData);
            } else {
                await cmsService.createHeroSlide({
                    ...formData,
                    order_index: slides.length
                });
            }
            setIsModalOpen(false);
            fetchSlides();
        } catch (err) {
            console.error("Error saving slide:", err);
            alert("Không thể lưu slide.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa slide này?")) {
            try {
                await cmsService.deleteHeroSlide(id);
                fetchSlides();
            } catch (err) {
                console.error("Error deleting slide:", err);
            }
        }
    };

    const moveSlide = async (index: number, direction: 'up' | 'down') => {
        const newSlides = [...slides];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newSlides.length) return;
        
        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
        
        const updateData = newSlides.map((s, idx) => ({
            id: s.id,
            order_index: idx
        }));
        
        setSlides(newSlides);
        
        try {
            await cmsService.reorderHeroSlides(updateData);
        } catch (err) {
            console.error("Error reordering:", err);
            fetchSlides();
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-10 pb-40">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter lowercase">Quản lý Hero Slider</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Tạo nhiều slide video ấn tượng cho màn hình chuyển động đầu trang chủ.</p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-black hover:bg-gray-800 transition-all text-white px-8 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl lowercase tracking-tight"
                    >
                        <Plus className="w-6 h-6 text-[#dafc69]" />
                        thêm slide mới
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="w-10 h-10 animate-spin text-[#dafc69]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {slides.map((slide, index) => (
                            <motion.div
                                layout
                                key={slide.id}
                                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
                            >
                                <div className="flex flex-col md:flex-row items-center">
                                    {/* Video Preview */}
                                    <div className="w-full md:w-80 aspect-video md:aspect-[4/3] bg-black relative overflow-hidden flex-shrink-0">
                                        <video 
                                            src={slide.video_url} 
                                            autoPlay 
                                            loop 
                                            muted 
                                            className="w-full h-full object-cover opacity-60"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Play className="w-10 h-10 text-white/50" />
                                        </div>
                                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Slide #{index + 1}</span>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="flex-1 p-8 md:p-10 space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dafc69] bg-black px-4 py-1.5 rounded-full inline-block mb-2">
                                                {slide.title_1 || "Chưa có tiêu đề 1"} • {slide.title_2 || "Chưa có tiêu đề 2"}
                                            </p>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter lowercase leading-none pt-2">
                                                {slide.heading || "Chưa có heading"}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-center gap-6 pt-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Video className="w-4 h-4" />
                                                <span className="text-xs font-bold truncate max-w-[200px]">{slide.video_url.split('/').pop()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="p-8 border-t md:border-t-0 md:border-l border-gray-50 flex md:flex-col gap-3">
                                        <div className="flex flex-col gap-1 mr-4 md:mr-0 md:mb-4">
                                            <button 
                                                onClick={() => moveSlide(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-20"
                                            >
                                                <ChevronUp className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => moveSlide(index, 'down')}
                                                disabled={index === slides.length - 1}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-20"
                                            >
                                                <ChevronDown className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleOpenModal(slide)}
                                            className="flex-1 md:flex-none p-4 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-2xl transition-all"
                                        >
                                            <Layout className="w-6 h-6 mx-auto" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(slide.id)}
                                            className="flex-1 md:flex-none p-4 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-2xl transition-all"
                                        >
                                            <Trash2 className="w-6 h-6 mx-auto" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {slides.length === 0 && (
                            <div className="text-center py-40 border-4 border-dashed border-gray-50 rounded-[3rem]">
                                <Video className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                                <p className="text-gray-300 font-black text-xl lowercase tracking-tighter">Chưa có slide nào. Hãy thêm cái đầu tiên!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Slide Editor Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl z-10"
                        >
                            <form onSubmit={handleSave} className="p-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-black lowercase tracking-tighter">
                                        {editingSlide ? 'Chỉnh sửa slide' : 'Tạo slide mới'}
                                    </h2>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tiêu đề phụ 1</label>
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-[1.5rem] px-6 py-4 focus-within:ring-2 focus-within:ring-[#dafc69] transition-all">
                                                <Type className="w-4 h-4 text-gray-300" />
                                                <input
                                                    required
                                                    value={formData.title_1}
                                                    onChange={e => setFormData({ ...formData, title_1: e.target.value })}
                                                    className="w-full bg-transparent text-sm font-bold outline-none"
                                                    placeholder="Vd: Agency sự kiện"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tiêu đề phụ 2</label>
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-[1.5rem] px-6 py-4 focus-within:ring-2 focus-within:ring-[#dafc69] transition-all">
                                                <Type className="w-4 h-4 text-gray-300" />
                                                <input
                                                    required
                                                    value={formData.title_2}
                                                    onChange={e => setFormData({ ...formData, title_2: e.target.value })}
                                                    className="w-full bg-transparent text-sm font-bold outline-none"
                                                    placeholder="Vd: & Marketing"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Heading chính (Sử dụng \n để xuống dòng)</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.heading}
                                            onChange={e => setFormData({ ...formData, heading: e.target.value })}
                                            className="w-full px-8 py-6 bg-gray-50 rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none resize-none leading-relaxed"
                                            placeholder="Nhập nội dung chính..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Video nền (.mp4)</label>
                                        <div className="flex gap-3">
                                            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-[1.5rem] px-6 py-4">
                                                <Video className="w-4 h-4 text-gray-300" />
                                                <input
                                                    required
                                                    value={formData.video_url}
                                                    onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                                    className="w-full bg-transparent text-sm font-bold outline-none"
                                                    placeholder="URL video hoặc chọn từ thư viện..."
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setIsMediaModalOpen(true)}
                                                className="px-8 bg-black text-white rounded-[1.5rem] font-black lowercase text-xs hover:bg-gray-800 transition-colors"
                                            >
                                                chọn video
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-6 bg-black text-white rounded-full font-black text-xl lowercase flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-8 h-8 animate-spin" /> : <Save className="w-8 h-8 text-[#dafc69]" />}
                                    {editingSlide ? 'Cập nhật slide' : 'Tạo slide ngay'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <MediaLibraryModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={(url) => setFormData(prev => ({ ...prev, video_url: url }))}
                title="Chọn Video Background"
            />
        </AdminLayout>
    );
}
