"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Save,
    ChevronLeft,
    Image as ImageIcon,
    Layout,
    Globe,
    Type,
    Zap,
    Target,
    Eye,
    Trash2,
    Plus,
    X,
    MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MediaLibraryModal from "@/components/common/MediaLibraryModal";
import { cmsService, Service } from "@/services/api";
import { slugify } from "@/lib/utils";

export default function ServiceDetailEditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    
    const [formData, setFormData] = useState<Partial<Service>>({
        title: "",
        slug: "",
        description: "",
        content: "",
        category: "Marketing",
        icon: "Zap",
        image_url: ""
    });

    useEffect(() => {
        if (id && id !== "new") {
            const fetchService = async () => {
                try {
                    const response = await cmsService.getServices();
                    const services = response.data;
                    const service = services.find((s: Service) => s.id === id);
                    if (service) {
                        setFormData(service);
                    }
                } catch (err) {
                    console.error("Error fetching service:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchService();
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (id === "new") {
                await cmsService.createService(formData);
            } else {
                await cmsService.updateService(id as string, formData);
            }
            router.push("/admin/services");
        } catch (err) {
            console.error("Error saving service:", err);
            alert("Có lỗi xảy ra khi lưu dịch vụ.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-10 pb-32">
                {/* Fixed Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => router.back()}
                            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black lowercase tracking-tighter">chi tiết dịch vụ</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Chỉnh sửa nội dung chuyên sâu cho dịch vụ</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         <button 
                            onClick={() => setShowPreview(!showPreview)}
                            className="bg-white border border-gray-100 px-6 py-4 rounded-2xl font-black text-sm lowercase flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <Eye className="w-5 h-5" />
                            {showPreview ? 'Chỉnh sửa' : 'Xem trước'}
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm lowercase flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-5 h-5 text-[#dafc69]" />
                            )}
                            lưu thay đổi
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">
                        {showPreview ? (
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-12 min-h-[600px] prose prose-invert max-w-none">
                                <span className="text-xs font-black uppercase tracking-widest text-[#dafc69] bg-black px-4 py-1 rounded-full">{formData.category}</span>
                                <h1 className="text-5xl font-black tracking-tighter mt-6 mb-8 text-black">{formData.title}</h1>
                                {formData.image_url && (
                                    <img src={formData.image_url} alt={formData.title} className="w-full h-[400px] object-cover rounded-[2rem] mb-10 shadow-lg" />
                                )}
                                <p className="text-xl text-gray-600 font-medium leading-relaxed italic border-l-4 border-[#dafc69] pl-6 mb-10">
                                    {formData.description}
                                </p>
                                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {formData.content || <span className="text-gray-300 italic">Chưa có nội dung chi tiết...</span>}
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Essential Info */}
                                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-[#dafc69]"></div>
                                        <h2 className="text-sm font-black uppercase tracking-widest">Thông tin cơ bản</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tên dịch vụ</label>
                                            <input 
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, slug: id === 'new' ? slugify(e.target.value) : prev.slug }))}
                                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none transition-all"
                                                placeholder="Ví dụ: Facebook Ads Automation"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Đường dẫn (Slug)</label>
                                            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-6">
                                                <span className="text-gray-300 text-xs">/service/</span>
                                                <input 
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                                                    className="flex-1 py-4 bg-transparent text-sm font-bold outline-none"
                                                    placeholder="facebook-ads"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mô tả cực ngắn (để list ra bên ngoài)</label>
                                        <textarea 
                                            rows={2}
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none resize-none"
                                            placeholder="Tóm tắt ngắn gọn dịch vụ trong 1-2 câu..."
                                        />
                                    </div>
                                </div>

                                {/* Rich Content */}
                                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-black"></div>
                                            <h2 className="text-sm font-black uppercase tracking-widest">Nội dung chi tiết</h2>
                                        </div>
                                        <div className="text-[9px] font-black uppercase text-gray-300 italic">Hỗ trợ Markdown & HTML</div>
                                    </div>
                                    
                                    <div className="min-h-[400px]">
                                        <textarea 
                                            value={formData.content}
                                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                            className="w-full min-h-[500px] px-8 py-8 bg-gray-50 rounded-[2rem] text-sm font-medium leading-relaxed focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all custom-scrollbar"
                                            placeholder="Bắt đầu viết nội dung chuyên sâu tại đây... Sử dụng dấu xuống dòng để chia đoạn."
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar Controls */}
                    <div className="space-y-8">
                        {/* Settings Card */}
                        <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-xl">
                            <h3 className="text-lg font-black lowercase tracking-tighter mb-8 flex items-center gap-3">
                                <Layout className="w-5 h-5 text-[#dafc69]" /> Cấu hình website
                            </h3>
                            
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Hạng mục hiển thị</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Marketing', 'Events'].map(cat => (
                                            <button 
                                                key={cat}
                                                onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.category === cat ? 'bg-[#dafc69] text-black shadow-lg shadow-[#dafc69]/20' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Biểu tượng (Icon)</label>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setFormData(prev => ({ ...prev, icon: 'Zap' }))}
                                            className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${formData.icon === 'Zap' ? 'bg-white text-black ring-4 ring-[#dafc69]/50' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
                                        >
                                            <Zap className="w-6 h-6" />
                                            <span className="text-[8px] font-black uppercase">Tia sét</span>
                                        </button>
                                        <button 
                                            onClick={() => setFormData(prev => ({ ...prev, icon: 'Target' }))}
                                            className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${formData.icon === 'Target' ? 'bg-white text-black ring-4 ring-[#dafc69]/50' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
                                        >
                                            <Target className="w-6 h-6" />
                                            <span className="text-[8px] font-black uppercase">Mục tiêu</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Preview Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                <ImageIcon className="w-4 h-4 text-blue-500" /> Ảnh đại diện
                            </h3>
                            
                            <div 
                                onClick={() => setIsMediaModalOpen(true)}
                                className="group relative aspect-video bg-gray-50 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-100 hover:border-[#dafc69] hover:bg-gray-100/50 transition-all flex flex-col items-center justify-center gap-3"
                            >
                                {formData.image_url ? (
                                    <>
                                        <img src={formData.image_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Plus className="w-8 h-8 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chọn hình ảnh</span>
                                    </>
                                )}
                            </div>
                            {formData.image_url && (
                                <button 
                                    onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                                    className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                                >
                                    Xóa ảnh hiện tại
                                </button>
                            )}
                        </div>

                        {/* Sidebar Tips */}
                        <div className="bg-blue-50/50 rounded-[2.5rem] p-8 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-4">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-900">Mẹo viết nội dung</h3>
                            </div>
                            <ul className="space-y-3 text-[11px] text-blue-700/80 font-medium leading-relaxed">
                                <li>• Sử dụng tiêu đề lớn để phân chia các phần (H1, H2).</li>
                                <li>• Dùng gạch đầu dòng để nêu bật lợi ích của dịch vụ.</li>
                                <li>• Chèn hình ảnh minh họa xen kẽ lời văn.</li>
                                <li>• Đảm bảo slug ngắn gọn và chứa từ khóa chính.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <MediaLibraryModal 
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                title="Thư viện ảnh dịch vụ"
            />
        </AdminLayout>
    );
}
