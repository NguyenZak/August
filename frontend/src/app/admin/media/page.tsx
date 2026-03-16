"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image as ImageIcon,
    Upload,
    Trash2,
    Search,
    FileText,
    LayoutGrid,
    List,
    Info,
    ChevronRight,
    Filter,
    Plus,
    Loader2,
    Calendar,
    HardDrive,
    ArrowUpRight,
    Folder as FolderIcon,
    FolderPlus,
    ChevronLeft,
    Edit3,
    MoreVertical,
    Check,
    X,
    AlertCircle
} from 'lucide-react';
import { cmsService, MediaItem, Folder } from '@/services/api';
import AdminLayout from '@/components/layout/AdminLayout';

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface ModalState {
    isOpen: boolean;
    type: 'input' | 'confirm';
    title: string;
    message?: string;
    value?: string;
    placeholder?: string;
    onConfirm: (val?: string) => void;
}

interface UploadProgress {
    total: number;
    completed: number;
    percentage: number;
    isUploading: boolean;
}

export default function AdminMediaPage() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterType, setFilterType] = useState<string>('all');
    const [folders, setFolders] = useState<Folder[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, folderId: string } | null>(null);
    const [draggedItem, setDraggedItem] = useState<{ type: 'file' | 'folder', id: string } | null>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        total: 0,
        completed: 0,
        percentage: 0,
        isUploading: false
    });

    // Custom Modal State
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        type: 'confirm',
        title: "",
        onConfirm: () => { }
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
        fetchData();
    }, [currentFolderId]);

    const toggleSelect = (id: string, isShift: boolean) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const categories = [
        { id: 'all', label: 'Tất cả tệp', icon: LayoutGrid },
        { id: 'image', label: 'Hình ảnh', icon: ImageIcon },
        { id: 'raw', label: 'Tài liệu (PDF/Khác)', icon: FileText },
    ];

    const filteredItems = mediaItems.filter(item => {
        const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || item.resource_type === filterType;
        return matchesSearch && matchesFilter;
    });

    const handleSelectAll = () => {
        if (selectedIds.size === filteredItems.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredItems.map(item => item.id)));
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                // Check if not typing in an input
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                    return;
                }
                e.preventDefault();
                setSelectedIds(new Set(filteredItems.map(item => item.id)));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredItems]);

    const handleUpload = async (files: File[]) => {
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
                setUploadProgress(prev => ({
                    ...prev,
                    completed,
                    percentage: Math.round((completed / files.length) * 100)
                }));
            }
            await fetchData();
        } catch (error) {
            alert("Tải lên thất bại!");
        } finally {
            setTimeout(() => {
                setUploadProgress(prev => ({ ...prev, isUploading: false }));
            }, 1000);
        }
    };

    // --- REPLACED NATIVE DIALOGS ---

    const openCreateFolderModal = (parentId?: string | null) => {
        setModal({
            isOpen: true,
            type: 'input',
            title: "Tạo thư mục mới",
            placeholder: "Nhập tên thư mục...",
            value: "",
            onConfirm: async (name: string | undefined) => {
                if (!name) return;
                try {
                    await cmsService.createFolder({ name, parent_id: parentId || currentFolderId });
                    await fetchData();
                } catch (error) {
                    alert("Không thể tạo thư mục.");
                }
            }
        });
    };

    const openRenameFolderModal = (id: string) => {
        const folder = folders.find(f => f.id === id);
        setModal({
            isOpen: true,
            type: 'input',
            title: "Đổi tên thư mục",
            placeholder: "Nhập tên mới...",
            value: folder?.name || "",
            onConfirm: async (newName: string | undefined) => {
                if (!newName || newName === folder?.name) return;
                try {
                    await cmsService.updateFolder(id, { name: newName });
                    await fetchData();
                } catch (error) {
                    alert("Không thể đổi tên.");
                }
            }
        });
        setContextMenu(null);
    };

    const openDeleteFolderModal = (id: string) => {
        setModal({
            isOpen: true,
            type: 'confirm',
            title: "Xác nhận xóa thư mục",
            message: "Xóa thư mục sẽ đưa các tệp tin bên trong ra ngoài thư viện gốc. Bạn có chắc chắn muốn xóa?",
            onConfirm: async () => {
                try {
                    await cmsService.deleteFolder(id);
                    if (currentFolderId === id) setCurrentFolderId(null);
                    await fetchData();
                } catch (error) {
                    alert("Không thể xóa thư mục.");
                }
            }
        });
        setContextMenu(null);
    };

    const openDeleteMediaModal = (id: string) => {
        setModal({
            isOpen: true,
            type: 'confirm',
            title: "Xóa tệp tin",
            message: "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa tệp tin này?",
            onConfirm: async () => {
                try {
                    await cmsService.deleteMedia(id);
                    fetchData();
                } catch (error) {
                    alert("Không thể xóa tệp tin.");
                }
            }
        });
    };

    const openBulkDeleteModal = () => {
        setModal({
            isOpen: true,
            type: 'confirm',
            title: "Xóa tệp đã chọn",
            message: `Bạn đang chuẩn bị xóa ${selectedIds.size} tệp tin. Tiếp tục?`,
            onConfirm: async () => {
                try {
                    for (const id of Array.from(selectedIds)) await cmsService.deleteMedia(id);
                    setSelectedIds(new Set());
                    fetchData();
                } catch (error) {
                    alert("Có lỗi xảy ra khi xóa hàng loạt.");
                }
            }
        });
    };

    // --- DRAG & DROP ---

    const onDragStart = (type: 'file' | 'folder', id: string) => {
        setDraggedItem({ type, id });
    };

    const onDropToFolder = async (targetFolderId: string | null) => {
        if (!draggedItem) return;
        if (draggedItem.id === targetFolderId) return;

        try {
            if (draggedItem.type === 'file') {
                const idsToMove = selectedIds.has(draggedItem.id)
                    ? Array.from(selectedIds)
                    : [draggedItem.id];
                await cmsService.bulkMoveMedia(idsToMove, targetFolderId);
            } else {
                await cmsService.updateFolder(draggedItem.id, { parent_id: targetFolderId });
            }
            await fetchData();
            setSelectedIds(new Set());
        } catch (error) {
            alert("Không thể di chuyển mục.");
        } finally {
            setDraggedItem(null);
        }
    };

    // --- DRAG & DROP ---

    const renderFolderTree = (parentId: string | null, depth = 0) => {
        return folders
            .filter(f => f.parent_id === parentId)
            .map(folder => (
                <div key={folder.id}>
                    <button
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({ x: e.clientX, y: e.clientY, folderId: folder.id });
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDropToFolder(folder.id)}
                        onClick={() => setCurrentFolderId(folder.id)}
                        className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${currentFolderId === folder.id ? 'bg-[#dafc69] text-black shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        style={{ marginLeft: `${depth * 12}px` }}
                        draggable
                        onDragStart={() => onDragStart('folder', folder.id)}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <FolderIcon className={`w-3.5 h-3.5 shrink-0 ${currentFolderId === folder.id ? 'text-black' : 'text-gray-400'}`} />
                            <span className="truncate">{folder.name}</span>
                        </div>
                    </button>
                    {renderFolderTree(folder.id, depth + 1)}
                </div>
            ));
    };

    return (
        <AdminLayout>
            <div
                className="flex bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden h-[calc(100vh-160px)] relative"
                onClick={() => setContextMenu(null)}
            >
                {/* --- CUSTOM MODAL --- */}
                <AnimatePresence>
                    {modal.isOpen && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setModal({ ...modal, isOpen: false })}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="relative bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden"
                            >
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-black lowercase tracking-tighter text-gray-900">{modal.title}</h3>
                                        <button
                                            onClick={() => setModal({ ...modal, isOpen: false })}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>

                                    {modal.type === 'input' ? (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={modal.value}
                                                    placeholder={modal.placeholder}
                                                    onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && (modal.onConfirm(modal.value), setModal({ ...modal, isOpen: false }))}
                                                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-[#dafc69]/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 p-4 bg-red-50/50 rounded-2xl border border-red-100/50 mb-6">
                                            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                                            <p className="text-xs font-bold text-red-600/80 leading-relaxed">{modal.message}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-8">
                                        <button
                                            onClick={() => setModal({ ...modal, isOpen: false })}
                                            className="flex-1 px-6 py-4 rounded-2xl text-xs font-black lowercase text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
                                        >
                                            hủy bỏ (esc)
                                        </button>
                                        <button
                                            onClick={() => {
                                                modal.onConfirm(modal.value);
                                                setModal({ ...modal, isOpen: false });
                                            }}
                                            className={`flex-1 px-6 py-4 rounded-2xl text-xs font-black lowercase transition-all shadow-lg active:scale-95 ${modal.type === 'confirm'
                                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200'
                                                    : 'bg-[#dafc69] text-black hover:bg-[#cce854] shadow-[#dafc69]/20'
                                                }`}
                                        >
                                            {modal.type === 'confirm' ? "xác nhận xóa" : "lưu thay đổi"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* --- CONTEXT MENU --- */}
                <AnimatePresence>
                    {contextMenu && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="fixed z-[100] bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 w-48"
                            style={{ left: contextMenu.x, top: contextMenu.y }}
                        >
                            <button onClick={() => openRenameFolderModal(contextMenu.folderId)} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                                <Edit3 className="w-4 h-4" /> Đổi tên thư mục
                            </button>
                            <button onClick={() => openCreateFolderModal(contextMenu.folderId)} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                                <FolderPlus className="w-4 h-4" /> Thư mục con mới
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button onClick={() => openDeleteFolderModal(contextMenu.folderId)} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 className="w-4 h-4" /> Xóa thư mục
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

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

                {/* Sidebar */}
                <div className="w-64 bg-gray-50/50 border-r border-gray-100 flex flex-col shrink-0">
                    <div className="p-8 pb-4">
                        <div className="flex gap-1.5 mb-8">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-4 text-center">Library Explorer</p>
                    </div>

                    <div className="px-4 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                        <section>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">Thông minh</p>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFilterType(cat.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${filterType === cat.id ? 'bg-black text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <cat.icon className={`w-4 h-4 ${filterType === cat.id ? 'text-[#dafc69]' : 'text-gray-400'}`} />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between px-3 mb-3">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Thư mục</p>
                                <button onClick={() => openCreateFolderModal(null)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                                    <FolderPlus className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setCurrentFolderId(null)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => onDropToFolder(null)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${currentFolderId === null ? 'bg-[#dafc69] text-black shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <FolderIcon className={`w-4 h-4 ${currentFolderId === null ? 'text-black' : 'text-gray-400'}`} />
                                    Thư viện gốc
                                </button>
                                {renderFolderTree(null)}
                            </div>
                        </section>
                    </div>

                    <div className="p-6 mt-auto">
                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 mb-2 uppercase">
                                <HardDrive className="w-3 h-3 text-black" /> Storage Used
                            </div>
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-black w-[42%]" />
                            </div>
                            <p className="text-[9px] font-bold text-gray-500 tracking-tight">4.2 GB / 10 GB (42%)</p>
                        </div>
                    </div>
                </div>

                {/* Main View Area */}
                <div
                    className={`flex-1 flex flex-col min-w-0 transition-opacity ${isDragActive ? 'opacity-50' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragActive(false);
                        if (e.dataTransfer.files.length > 0) {
                            handleUpload(Array.from(e.dataTransfer.files));
                        }
                    }}
                >
                    {/* Tool Bar */}
                    <div className="p-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/40 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-4 flex-1">
                            {currentFolderId && (
                                <button
                                    onClick={() => {
                                        const currentFolder = folders.find(f => f.id === currentFolderId);
                                        setCurrentFolderId(currentFolder?.parent_id || null);
                                    }}
                                    className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            )}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Search library items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#dafc69] transition-all"
                                />
                            </div>
                            {selectedIds.size > 0 && (
                                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-2xl shadow-xl">
                                    <span className="text-[10px] font-black lowercase">{selectedIds.size} files selected</span>
                                    <button
                                        onClick={() => openBulkDeleteModal()}
                                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSelectAll}
                                className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:border-gray-200 transition-all flex items-center gap-2 shadow-sm"
                            >
                                {selectedIds.size === filteredItems.length && filteredItems.length > 0 ? (
                                    <>Bỏ chọn tất cả</>
                                ) : (
                                    <>Chọn tất cả <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] ml-1">⌘A</span></>
                                )}
                            </button>
                            <label className="bg-[#dafc69] hover:bg-[#cce854] text-black px-6 py-3 rounded-2xl text-xs font-black lowercase cursor-pointer flex items-center gap-2 transition-all shadow-lg active:scale-95">
                                {uploadProgress.isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {uploadProgress.isUploading ? "uploading..." : "upload items"}
                                <input type="file" className="hidden" onChange={(e) => handleUpload(Array.from(e.target.files || []))} disabled={uploadProgress.isUploading} multiple />
                            </label>
                        </div>
                    </div>

                    {/* Media Body */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 opacity-50">
                                <Loader2 className="w-12 h-12 animate-spin text-[#dafc69]" />
                                <p className="font-black lowercase text-sm tracking-widest">Scanning files...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-6 opacity-30">
                                <ImageIcon className="w-24 h-24" />
                                <p className="font-black lowercase text-xl tracking-tighter">This folder is empty</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                {filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        draggable
                                        onDragStart={() => onDragStart('file', item.id)}
                                        onClick={(e) => toggleSelect(item.id, e.shiftKey)}
                                        className={`group relative aspect-square rounded-[2rem] bg-white border-2 cursor-pointer transition-all duration-300 ${selectedIds.has(item.id) ? 'border-black ring-4 ring-black/5' : 'border-transparent hover:border-gray-100 hover:shadow-xl'
                                            }`}
                                    >
                                        <div className="absolute inset-2.5 rounded-[1.5rem] overflow-hidden bg-gray-50">
                                            {item.resource_type === 'image' ? (
                                                <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50/50">
                                                    <FileText className="w-10 h-10 text-blue-400" />
                                                </div>
                                            )}
                                        </div>

                                        {selectedIds.has(item.id) && (
                                            <div className="absolute top-4 right-4 z-10 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                                <Check className="w-3.5 h-3.5 text-[#dafc69]" />
                                            </div>
                                        )}

                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all z-20">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openDeleteMediaModal(item.id); }}
                                                className="p-2.5 bg-white/90 backdrop-blur-md text-red-500 rounded-xl border border-gray-100 shadow-xl hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-14 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-100 shadow-xl">
                                                <p className="text-[9px] font-black text-gray-900 truncate lowercase">{item.filename}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{formatSize(item.size || 0)}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isDragActive && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 pointer-events-none border-4 border-dashed border-black/10 m-8 rounded-[3rem]" />
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
            `}</style>
        </AdminLayout>
    );
}
