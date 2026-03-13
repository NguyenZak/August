"use client";

import { useState } from 'react';
import {
    LayoutDashboard,
    Briefcase,
    Wrench,
    Users,
    Mail,
    Settings,
    LogOut,
    ExternalLink,
    Menu,
    X,
    ChevronRight,
    Globe,
    Star,
    Image
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import RouteGuard from "@/components/auth/RouteGuard";
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard CMS', href: '/admin', icon: LayoutDashboard },
        { name: 'Quản lý Dự án', href: '/admin/cases', icon: Briefcase },
        { name: 'Quản lý Dịch vụ', href: '/admin/services', icon: Wrench },
        { name: 'Quản lý Đánh giá', href: '/admin/reviews', icon: Star },
        { name: 'Quản lý Đối tác', href: '/admin/clients', icon: Users },
        { name: 'Hộp thư liên hệ', href: '/admin/inquiries', icon: Mail },
        { name: 'Thư viện Media', href: '/admin/media', icon: Image },
        { name: 'Quản lý AI Apps', href: '/admin/playback', icon: Globe },
    ];

    return (
        <RouteGuard allowedRoles={["ADMIN", "SUPER"]}>
            <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-sans">
                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <aside className={`fixed md:relative w-72 h-full bg-white border-r border-gray-200 flex flex-col z-[50] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    {/* Branding */}
                    <div className="h-20 flex items-center px-8 border-b border-gray-100 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-xs">AG</span>
                            </div>
                            <h1 className="text-xl font-black lowercase tracking-tighter">August <span className="text-gray-400 font-medium text-xs uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded ml-2">CMS</span></h1>
                        </div>
                        <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsSidebarOpen(false)}>
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Quản trị nội dung</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive
                                        ? 'bg-black text-white shadow-lg shadow-black/10'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#dafc69]' : 'text-gray-400 group-hover:text-gray-900 transition-colors'}`} />
                                        <span className="text-sm font-bold lowercase tracking-tight">{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4 text-white/40" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 space-y-2">
                        <Link href="/" className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                            <ExternalLink className="w-5 h-5 text-gray-400" />
                            Xem website
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 rounded-2xl hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5 text-red-400" />
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto flex flex-col relative">
                    {/* Header Bar */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-[30]">
                        <div className="flex items-center gap-4">
                            <button
                                className="md:hidden p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 lowercase tracking-tighter">
                                    {navItems.find(item => item.href === pathname)?.name || 'Admin Panel'}
                                </h2>
                                <p className="text-xs text-gray-400 font-medium">Xin chào, Admin Viz!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">CMS Online</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin+Viz&background=random" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </header>

                    {/* Page Content area */}
                    <div className="p-8 max-w-7xl mx-auto w-full pb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </RouteGuard>
    );
}
