"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    Image as ImageIcon,
    MoreVertical,
    GripVertical,
    X,
    Save,
    Calendar,
    User,
    Tag,
    Upload
} from "lucide-react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { cmsService, MediaItem } from "@/services/api";
import RichTextEditor from "@/components/common/RichTextEditor";
import MediaLibraryModal from "@/components/common/MediaLibraryModal";
import { slugify } from "@/lib/utils";

interface Case {
    id: string;
    title: string;
    slug: string;
    category: string;
    image_url: string;
    grid_row: number;
    grid_col: number;
    grid_row_span: number;
    grid_col_span: number;
    content?: string;
    industry?: string;
    menu_url?: string;
}

export default function AdminCasesPage() {
    const [items, setItems] = useState<Case[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Case | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [mediaModal, setMediaModal] = useState<{ isOpen: boolean; field: 'image_url' | 'menu_url'; type: string; multiple?: boolean }>({
        isOpen: false,
        field: 'image_url',
        type: 'image/*'
    });
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        image_url: "",
        grid_row: 1,
        grid_col: 1,
        grid_row_span: 1,
        grid_col_span: 12,
        content: "",
        industry: "",
        menu_url: ""
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'menu_url' = 'image_url') => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const response = await cmsService.uploadFile(files[0]);
            if (field === 'menu_url') {
                const newUrls = (response.data as any).map((res: any) => res.url).join(',');
                setFormData(prev => ({
                    ...prev,
                    [field]: prev[field] ? `${prev[field]},${newUrls}` : newUrls
                }));
            } else {
                setFormData(prev => ({ ...prev, [field]: response.data[0].url }));
            }
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Tải lên thất bại!");
        } finally {
            setIsUploading(false);
        }
    };

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await cmsService.getCases();
            setItems(response.data);
        } catch (err) {
            console.error("Error fetching cases:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (item: Case | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                slug: item.slug || "",
                category: item.category,
                image_url: item.image_url,
                grid_row: item.grid_row,
                grid_col: item.grid_col,
                grid_row_span: item.grid_row_span,
                grid_col_span: item.grid_col_span,
                content: item.content || "",
                industry: item.industry || "",
                menu_url: item.menu_url || ""
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: "",
                slug: "",
                category: "",
                image_url: "",
                grid_row: 1,
                grid_col: 1,
                grid_row_span: 1,
                grid_col_span: 12,
                content: "",
                industry: "",
                menu_url: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await cmsService.updateCase(editingItem.id, formData);
            } else {
                await cmsService.createCase(formData);
            }
            fetchItems();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving case:", err);
            alert("Có lỗi xảy ra khi lưu dự án.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
            try {
                await cmsService.deleteCase(id);
                fetchItems();
            } catch (err) {
                console.error("Error deleting case:", err);
                alert("Không thể xóa dự án.");
            }
        }
    };

    const handleReorder = (newOrder: Case[]) => {
        setItems(newOrder);
        setIsOrderChanged(true);
    };

    const saveOrder = async () => {
        setIsReordering(true);
        try {
            const reorderData = items.map((item, index) => ({
                id: item.id,
                grid_row: index + 1
            }));
            await cmsService.reorderCases(reorderData);
            setIsOrderChanged(false);
            alert("Đã lưu thứ tự mới thành công!");
        } catch (err) {
            console.error("Error saving order:", err);
            alert("Lỗi khi lưu thứ tự.");
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter lowercase">Quản lý Dự án</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Kéo thả để sắp xếp thứ tự hiển thị của các dự án (Cases) trên trang chủ.</p>
                    </div>

                    <div className="flex gap-4">
                        {isOrderChanged && (
                            <button
                                onClick={saveOrder}
                                disabled={isReordering}
                                className={`bg-[#dafc69] text-black px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-xl text-sm whitespace-nowrap lowercase tracking-tight ${isReordering ? 'opacity-50' : 'hover:bg-[#cce854] transition-all'}`}
                            >
                                <Save className="w-5 h-5" />
                                {isReordering ? 'đang lưu...' : 'lưu thứ tự mới'}
                            </button>
                        )}
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-black hover:bg-gray-800 transition-all text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-xl text-sm whitespace-nowrap lowercase tracking-tight"
                        >
                            <Plus className="w-5 h-5 text-[#dafc69]" />
                            thêm dự án mới
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm dự án bằng tên hoặc hạng mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 transition-all outline-none font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3 px-2">
                        <button className="p-4 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-px bg-gray-100 mx-2 hidden md:block"></div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">{filteredItems.length} dự án</p>
                    </div>
                </div>

                {/* Drag and Drop List */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Dự án</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Hạng mục</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Khách hàng</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Thao tác</th>
                                </tr>
                            </thead>
                        </table>

                        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="divide-y divide-gray-50">
                            {filteredItems.map((item) => (
                                <Reorder.Item
                                    key={item.id}
                                    value={item}
                                    className="bg-white hover:bg-gray-50 transition-colors group cursor-default"
                                >
                                    <div className="flex items-center w-full">
                                        <div className="px-8 py-6 flex items-center gap-6 flex-grow">
                                            <div className="cursor-grab active:cursor-grabbing p-1">
                                                <GripVertical className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                                            </div>
                                            <div className="w-20 h-14 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                                                <ImageIcon className="w-6 h-6 text-gray-300" />
                                            </div>
                                            <div className="truncate max-w-[200px]">
                                                <h4 className="font-black text-gray-900 tracking-tight lowercase truncate">{item.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-widest font-bold">id: #{item.id}</p>
                                            </div>
                                        </div>
                                        <div className="px-8 py-6 w-1/4">
                                            <span className="text-xs font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg whitespace-nowrap">{item.category}</span>
                                        </div>
                                        <div className="px-8 py-6 w-1/6">
                                            <p className="text-sm font-bold text-gray-700 tracking-tight whitespace-nowrap">{item.grid_col_span} cols</p>
                                        </div>
                                        <div className="px-8 py-6 text-right flex items-center justify-end gap-3 flex-shrink-0 min-w-[200px]">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-gray-100"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-3 text-gray-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-gray-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>
                </div>

                {/* Modal Form */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl z-10"
                            >
                                <form onSubmit={handleSave}>
                                    <div className="p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-3xl font-black lowercase tracking-tighter">
                                                    {editingItem ? 'chỉnh sửa dự án' : 'thêm dự án mới'}
                                                </h2>
                                                <p className="text-gray-500 mt-1">Điền đầy đủ thông tin để hiển thị trên portfolio.</p>
                                            </div>
                                            <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                                                <X className="w-6 h-6 text-gray-400" />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                        <Tag className="w-3 h-3" /> tên dự án
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.title}
                                                        onChange={(e) => {
                                                            const newTitle = e.target.value;
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                title: newTitle,
                                                                slug: editingItem ? prev.slug : slugify(newTitle)
                                                            }));
                                                        }}
                                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none transition-all"
                                                        placeholder="Vd: Growe Partners"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                        <Search className="w-3 h-3" /> đường dẫn (slug)
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.slug}
                                                        onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none transition-all"
                                                        placeholder="vd: growe-partners"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                        <Filter className="w-3 h-3" /> hạng mục
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none transition-all"
                                                        placeholder="Vd: Social Automation"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                        <Search className="w-3 h-3" /> ngành nghề
                                                    </label>
                                                    <select
                                                        value={formData.industry}
                                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none transition-all appearance-none"
                                                    >
                                                        <option value="">Chọn ngành nghề...</option>
                                                        <option value="F&B">F&B (Nhà hàng, Quán cafe)</option>
                                                        <option value="Tech">Công nghệ / Phần mềm</option>
                                                        <option value="Beauty">Làm đẹp / Spa</option>
                                                        <option value="Education">Giáo dục</option>
                                                        <option value="Other">Khác</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                    <Edit2 className="w-3 h-3" /> nội dung chi tiết
                                                </label>
                                                <RichTextEditor
                                                    value={formData.content}
                                                    onChange={(content) => setFormData({ ...formData, content })}
                                                    placeholder="Mô tả chi tiết về dự án..."
                                                />
                                            </div>

                                            {formData.industry === "F&B" && (
                                                <div className="space-y-4 p-6 bg-[#dafc69]/5 rounded-[2rem] border border-[#dafc69]/10">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#a8cc2c] flex items-center gap-2 mb-2">
                                                            <ImageIcon className="w-3 h-3" /> Menu (Dành cho F&B)
                                                        </label>
                                                        <p className="text-xs text-gray-500 mb-4">Bạn có thể chọn nhiều ảnh để tạo hiệu ứng lật trang (Flipbook). Thứ tự ảnh dựa trên lúc chọn.</p>
                                                    </div>

                                                    {/* Preview Grid */}
                                                    {formData.menu_url && (
                                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                                            {formData.menu_url.split(',').map((url, idx) => (
                                                                <div key={idx} className="relative aspect-[3/4] bg-white rounded-xl overflow-hidden border border-gray-200 group">
                                                                    <img src={url} alt={`Menu page ${idx + 1}`} className="w-full h-full object-cover" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const newUrls = formData.menu_url.split(',').filter((_, i) => i !== idx).join(',');
                                                                                setFormData(prev => ({ ...prev, menu_url: newUrls }));
                                                                            }}
                                                                            className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-sm">
                                                                        {idx + 1}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={(e) => handleFileUpload(e, 'menu_url')}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                disabled={isUploading}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
                                                            >
                                                                <Upload className="w-3 h-3" /> tải file ảnh mới
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setMediaModal({ isOpen: true, field: 'menu_url', type: 'image/*', multiple: true })}
                                                            className="flex-1 px-4 py-3 bg-[#dafc69] hover:bg-[#cce854] text-black rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <ImageIcon className="w-3 h-3" /> chọn từ thư viện
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">cột (col)</label>
                                                    <input type="number" value={formData.grid_col} onChange={(e) => setFormData({ ...formData, grid_col: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">độ rộng (span)</label>
                                                    <input type="number" value={formData.grid_col_span} onChange={(e) => setFormData({ ...formData, grid_col_span: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs font-bold" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                    <ImageIcon className="w-3 h-3" /> ảnh đại diện / banner
                                                </label>
                                                <div className="flex flex-col gap-4">
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.image_url}
                                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none transition-all"
                                                        placeholder="Dán URL hoặc chọn file..."
                                                    />
                                                    <div className="flex gap-3">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="file"
                                                                accept="image/*,video/*"
                                                                onChange={(e) => handleFileUpload(e, 'image_url')}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                disabled={isUploading}
                                                            />
                                                            <button
                                                                type="button"
                                                                className={`w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-[1.5rem] font-black text-xs lowercase transition-all flex items-center justify-center gap-2 ${isUploading ? 'opacity-50' : ''}`}
                                                            >
                                                                {isUploading ? (
                                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <Upload className="w-4 h-4" />
                                                                )}
                                                                tải ảnh mới
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setMediaModal({ isOpen: true, field: 'image_url', type: 'image/*' })}
                                                            className="flex-1 py-4 bg-black text-white rounded-[1.5rem] font-black text-xs lowercase transition-all flex items-center justify-center gap-2 hover:bg-gray-800"
                                                        >
                                                            <ImageIcon className="w-4 h-4 text-[#dafc69]" /> chọn từ thư viện
                                                        </button>
                                                    </div>
                                                </div>
                                                {formData.image_url && (
                                                    <div className="mt-4 w-full h-40 bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 relative group">
                                                        <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Xem trước</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full mt-10 py-5 bg-black text-white rounded-full font-black lowercase text-xl hover:scale-[1.02] transition-transform shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                                        >
                                            <Save className="w-6 h-6 text-[#dafc69]" />
                                            {editingItem ? 'cập nhật dự án' : 'lưu dự án mới'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <MediaLibraryModal
                    isOpen={mediaModal.isOpen}
                    onClose={() => setMediaModal(prev => ({ ...prev, isOpen: false }))}
                    onSelect={(url) => setFormData(prev => ({ ...prev, [mediaModal.field]: url }))}
                    onSelectMultiple={(urls) => {
                        setFormData(prev => ({
                            ...prev,
                            [mediaModal.field]: prev[mediaModal.field] ? `${prev[mediaModal.field]},${urls.join(',')}` : urls.join(',')
                        }))
                    }}
                    title={`Chọn ${mediaModal.field === 'image_url' ? 'ảnh' : 'Menu F&B'}`}
                    acceptedTypes={mediaModal.type}
                    multiple={mediaModal.multiple}
                />
            </div>
        </AdminLayout>
    );
}
