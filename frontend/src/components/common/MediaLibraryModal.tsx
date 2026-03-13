"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Image as ImageIcon,
    Upload,
    Trash2,
    Check,
    FileText,
    Search,
    Loader2
} from 'lucide-react';
import { cmsService, MediaItem } from '@/services/api';

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (url: string) => void;
    onSelectMultiple?: (urls: string[]) => void;
    title?: string;
    acceptedTypes?: string;
    multiple?: boolean;
}

export default function MediaLibraryModal({
    isOpen,
    onClose,
    onSelect,
    onSelectMultiple,
    title = "Thư viện Media",
    acceptedTypes = "image/*",
    multiple = false
}: MediaLibraryModalProps) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const response = await cmsService.getMedia();
            setMediaItems(response.data);
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setSelectedIds([]); // Reset selection on open
        }
    }, [isOpen]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            await cmsService.uploadFiles(files);
            await fetchMedia();
        } catch (error: any) {
            console.error("Upload failed:", error?.response?.data || error);
            alert("Tải lên thất bại: " + (error?.response?.data?.message || error.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Bạn có chắc chắn muốn xóa tệp này khỏi thư viện?")) {
            try {
                await cmsService.deleteMedia(id);
                setMediaItems(prev => prev.filter(item => item.id !== id));
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Không thể xóa tệp.");
            }
        }
    };

    const filteredItems = mediaItems.filter(item =>
        item.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (item: MediaItem) => {
        if (multiple) {
            setSelectedIds(prev =>
                prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
            );
        } else {
            setSelectedIds([item.id]);
            if (onSelect) onSelect(item.url);
            onClose();
        }
    };

    const handleConfirmMultiple = () => {
        if (onSelectMultiple) {
            const urls = selectedIds
                .map(id => mediaItems.find(item => item.id === id)?.url)
                .filter((url): url is string => Boolean(url));
            onSelectMultiple(urls);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl z-10 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-2xl font-black lowercase tracking-tighter flex items-center gap-3">
                                <ImageIcon className="w-6 h-6 text-[#a8cc2c]" /> {title}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Chọn hoặc tải lên tệp mới để sử dụng.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tệp..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#dafc69] transition-all"
                                />
                            </div>
                            <label className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl text-xs font-black lowercase cursor-pointer flex items-center gap-2 transition-all shadow-lg active:scale-95">
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#dafc69]" />}
                                {isUploading ? "đang tải..." : "tải lên"}
                                <input type="file" className="hidden" onChange={handleUpload} accept={acceptedTypes} disabled={isUploading} multiple />
                            </label>
                            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-[#dafc69]" />
                                <p className="font-black lowercase tracking-tight">đang tải thư viện...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-6 opacity-50">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-xl lowercase tracking-tighter">thư viện trống</p>
                                    <p className="text-sm font-medium mt-1">hãy tải lên tệp đầu tiên của bạn.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={item.id}
                                        onClick={() => handleSelect(item)}
                                        className={`group relative aspect-square rounded-[2rem] overflow-hidden bg-white border-2 cursor-pointer transition-all ${selectedIds.includes(item.id) ? 'border-[#a8cc2c] shadow-xl shadow-[#a8cc2c]/10' : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        {item.resource_type === 'image' ? (
                                            <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50/30 gap-3">
                                                <FileText className="w-10 h-10 text-blue-400" />
                                                <p className="text-[10px] font-black uppercase text-blue-600 px-2 text-center truncate w-full">{item.filename.split('.').pop()}</p>
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${selectedIds.includes(item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {selectedIds.includes(item.id) ? (
                                                <div className="bg-[#a8cc2c] p-3 rounded-full shadow-lg">
                                                    <Check className="w-6 h-6 text-black" />
                                                </div>
                                            ) : (
                                                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-black shadow-sm">
                                                    Chọn
                                                </div>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm z-20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Info Tag */}
                                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            <p className="text-[10px] font-bold text-gray-900 truncate lowercase">{item.filename}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {filteredItems.length} tệp trong thư viện
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-black text-xs lowercase transition-all"
                            >
                                Đóng
                            </button>
                            {multiple && selectedIds.length > 0 && (
                                <button
                                    onClick={handleConfirmMultiple}
                                    className="px-8 py-3 bg-[#dafc69] hover:bg-[#cce854] text-black rounded-xl font-black text-xs lowercase transition-all shadow-lg"
                                >
                                    chọn {selectedIds.length} tệp
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
