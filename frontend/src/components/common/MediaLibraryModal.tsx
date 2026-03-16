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
    Loader2,
    Folder as FolderIcon,
    ChevronLeft,
    Plus,
    AlertCircle
} from 'lucide-react';
import { cmsService, MediaItem, Folder } from '@/services/api';

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (url: string) => void;
    onSelectMultiple?: (urls: string[]) => void;
    title?: string;
    acceptedTypes?: string;
    multiple?: boolean;
}

interface UploadProgress {
    total: number;
    completed: number;
    percentage: number;
    isUploading: boolean;
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
    const [folders, setFolders] = useState<Folder[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        total: 0,
        completed: 0,
        percentage: 0,
        isUploading: false
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [mediaRes, folderRes] = await Promise.all([
                cmsService.getMedia(currentFolderId || 'root'),
                cmsService.getFolders()
            ]);
            setMediaItems(mediaRes.data);
            setFolders(folderRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
            setSelectedIds([]); // Reset selection on open
        }
    }, [isOpen, currentFolderId]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploadProgress({
            total: files.length,
            completed: 0,
            percentage: 0,
            isUploading: true
        });

        try {
            let completed = 0;
            for (const file of files) {
                await cmsService.uploadFile(file, currentFolderId || undefined);
                completed++;
                setUploadProgress((prev: UploadProgress) => ({
                    ...prev,
                    completed,
                    percentage: Math.round((completed / files.length) * 100)
                }));
            }
            await fetchData();
        } catch (error: any) {
            console.error("Upload failed:", error?.response?.data || error);
            alert("Tải lên thất bại: " + (error?.response?.data?.message || error.message));
        } finally {
            setTimeout(() => {
                setUploadProgress((prev: UploadProgress) => ({ ...prev, isUploading: false }));
            }, 1000);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Bạn có chắc chắn muốn xóa tệp này khỏi thư viện?")) {
            try {
                await cmsService.deleteMedia(id);
                setMediaItems((prev: MediaItem[]) => prev.filter((item: MediaItem) => item.id !== id));
                setSelectedIds((prev: string[]) => prev.filter((selectedId: string) => selectedId !== id));
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

    const handleSelectAll = () => {
        if (!multiple) return;
        if (selectedIds.length === filteredItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredItems.map(item => item.id));
        }
    };

    useEffect(() => {
        if (!isOpen || !multiple) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                    return;
                }
                e.preventDefault();
                setSelectedIds(filteredItems.map(item => item.id));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, multiple, filteredItems]);

    const handleConfirmMultiple = () => {
        if (onSelectMultiple) {
            const urls = selectedIds
                .map((id: string) => mediaItems.find((item: MediaItem) => item.id === id)?.url)
                .filter((url: string | undefined): url is string => Boolean(url));
            onSelectMultiple(urls);
        }
        onClose();
    };

    const renderFolderTree = (parentId: string | null, depth = 0): React.ReactNode => {
        return folders
            .filter((f: Folder) => f.parent_id === parentId)
            .map((folder: Folder) => (
                <div key={folder.id}>
                    <button
                        onClick={() => setCurrentFolderId(folder.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${currentFolderId === folder.id ? 'bg-[#dafc69] text-black shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        style={{ marginLeft: `${depth * 12}px` }}
                    >
                        <FolderIcon className={`w-3.5 h-3.5 shrink-0 ${currentFolderId === folder.id ? 'text-black' : 'text-gray-400'}`} />
                        <span className="truncate">{folder.name}</span>
                    </button>
                    {renderFolderTree(folder.id, depth + 1)}
                </div>
            ));
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
                
                {/* Upload Progress Overlay */}
                <AnimatePresence>
                    {uploadProgress.isUploading && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-12 right-12 z-[300] bg-black text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 w-72"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#dafc69] rounded-lg">
                                        <Loader2 className="w-4 h-4 text-black animate-spin" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">đang tải lên...</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#dafc69]">{uploadProgress.percentage}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                                <motion.div 
                                    className="h-full bg-[#dafc69]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress.percentage}%` }}
                                />
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                {uploadProgress.completed} / {uploadProgress.total} tệp đã hoàn tất
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-6xl h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl z-10 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            {currentFolderId && (
                                <button
                                    onClick={() => {
                                        const currentFolder = folders.find(f => f.id === currentFolderId);
                                        setCurrentFolderId(currentFolder?.parent_id || null);
                                    }}
                                    className="p-3 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            )}
                            <div>
                                <h2 className="text-2xl font-black lowercase tracking-tighter flex items-center gap-3">
                                    <ImageIcon className="w-6 h-6 text-[#a8cc2c]" /> {title}
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Chọn hoặc tải lên tệp mới để sử dụng.</p>
                            </div>
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
                            {multiple && (
                                <button
                                    onClick={handleSelectAll}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-black rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border border-transparent hover:border-gray-200"
                                >
                                    {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? "bỏ chọn hết" : "chọn tất cả"}
                                </button>
                            )}
                            <label className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl text-xs font-black lowercase cursor-pointer flex items-center gap-2 transition-all shadow-lg active:scale-95">
                                {uploadProgress.isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#dafc69]" />}
                                {uploadProgress.isUploading ? "đang tải..." : "tải lên"}
                                <input type="file" className="hidden" onChange={handleUpload} accept={acceptedTypes} disabled={uploadProgress.isUploading} multiple />
                            </label>
                            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-1 min-h-0">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-gray-100 bg-gray-50/50 overflow-y-auto p-6 hidden md:block">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-4">Thư mục</p>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setCurrentFolderId(null)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${currentFolderId === null ? 'bg-[#dafc69] text-black shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <FolderIcon className={`w-4 h-4 ${currentFolderId === null ? 'text-black' : 'text-gray-400'}`} />
                                    Thư viện gốc
                                </button>
                                {renderFolderTree(null)}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 bg-white flex flex-col">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-[#dafc69]" />
                                    <p className="font-black lowercase tracking-tight">đang tải dữ liệu...</p>
                                </div>
                            ) : (filteredItems.length === 0 && folders.filter((f: Folder) => f.parent_id === currentFolderId).length === 0) ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-6 opacity-30">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ImageIcon className="w-10 h-10" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-xl lowercase tracking-tighter">thư mục trống</p>
                                        <p className="text-sm font-medium mt-1">hãy tải lên tệp đầu tiên của bạn.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 content-start">
                                    {/* Sub-folders in main view for mobile or better accessibility */}
                                    {folders.filter((f: Folder) => f.parent_id === currentFolderId).map((folder: Folder) => (
                                        <motion.div
                                            key={folder.id}
                                            onClick={() => setCurrentFolderId(folder.id)}
                                            className="group relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border-2 border-transparent hover:border-gray-200 cursor-pointer transition-all flex flex-col items-center justify-center gap-4"
                                        >
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <FolderIcon className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-xs font-bold text-gray-600 truncate px-4 w-full text-center lowercase">{folder.name}</p>
                                        </motion.div>
                                    ))}

                                    {/* Files */}
                                    {filteredItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layoutId={item.id}
                                            onClick={() => handleSelect(item)}
                                            className={`group relative aspect-square rounded-[2rem] overflow-hidden bg-white border-2 cursor-pointer transition-all ${selectedIds.includes(item.id) ? 'border-[#a8cc2c] shadow-xl shadow-[#a8cc2c]/10' : 'border-transparent hover:border-gray-100'
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
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {filteredItems.length} tệp trong {currentFolderId ? `thư mục: ${folders.find((f: Folder) => f.id === currentFolderId)?.name}` : 'thư viện gốc'}
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
