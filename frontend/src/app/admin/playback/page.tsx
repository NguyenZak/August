"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
    Plus,
    Search,
    MoreVertical,
    ExternalLink,
    Edit2,
    Trash2,
    Clock,
    Layout,
    Grid,
    List as ListIcon,
    ArrowRight
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Image from 'next/image';

interface Brand {
    id: string;
    name: string;
    subdomain: string;
    logo_url: string;
    created_at: string;
}

export default function PlaybackPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const supabase = createClient();

    useEffect(() => {
        fetchBrands();
    }, []);

    async function fetchBrands() {
        setLoading(true);
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching brands:', error);
        } else {
            setBrands(data || []);
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc chắn muốn xóa ứng dụng này?')) return;

        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Lỗi khi xóa: ' + error.message);
        } else {
            setBrands(brands.filter(b => b.id !== id));
        }
    }

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0E0E0E] text-slate-900 dark:text-slate-100">
                {/* Header Section */}
                <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-2">Landing Pages</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium lowercase">Quản lý và tối ưu hóa các trang landing page của bạn.</p>
                        </div>
                        <Link
                            href="/admin/brands/new"
                            className="inline-flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create landing page</span>
                        </Link>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search landing pages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#1A73E8] transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/10 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-white/10 text-[#1A73E8]' : 'text-slate-400'}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 dark:bg-white/10 text-[#1A73E8]' : 'text-slate-400'}`}
                            >
                                <ListIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 bg-slate-200 dark:bg-white/5 animate-pulse rounded-2xl"></div>
                            ))}
                        </div>
                    ) : filteredBrands.length === 0 ? (
                        <div className="bg-white dark:bg-[#1E1E1E] border border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Layout className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Chưa có landing page nào</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Bắt đầu bằng cách tạo landing page đầu tiên của bạn.</p>
                            <Link
                                href="/admin/brands/new"
                                className="inline-flex items-center gap-2 text-[#1A73E8] font-bold hover:underline"
                            >
                                Create your first landing page <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBrands.map(brand => (
                                <div
                                    key={brand.id}
                                    className="group bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
                                >
                                    <div className="aspect-video bg-slate-100 dark:bg-white/5 relative group-hover:bg-[#dafc69]/10 transition-colors">
                                        {brand.logo_url ? (
                                            <Image
                                                src={brand.logo_url}
                                                alt={brand.name}
                                                fill
                                                className="object-contain p-8"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Layout className="w-12 h-12 text-slate-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <Link
                                                href={`/admin/brands/${brand.id}/edit`}
                                                className="p-3 bg-white text-black rounded-full hover:bg-[#dafc69] transition-colors"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={`/brand/${brand.subdomain}`}
                                                target="_blank"
                                                className="p-3 bg-white text-black rounded-full hover:bg-[#dafc69] transition-colors"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg truncate pr-4">{brand.name}</h3>
                                            <div className="relative group/menu">
                                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                                    <MoreVertical className="w-5 h-5 text-slate-400" />
                                                </button>
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all z-20">
                                                    <button
                                                        onClick={() => handleDelete(brand.id)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-bold transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete landing page
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium lowercase">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Created {new Date(brand.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-200 dark:border-white/10 text-xs font-black uppercase tracking-widest text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4">Page Name</th>
                                        <th className="px-6 py-4">Subdomain</th>
                                        <th className="px-6 py-4">Modified</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {filteredBrands.map(brand => (
                                        <tr key={brand.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold">{brand.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">{brand.subdomain}.august.co</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                                                {new Date(brand.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/brands/${brand.id}/edit`}
                                                        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(brand.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
