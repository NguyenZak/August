import { useState } from 'react';
import { LayoutDashboard, Users, CalendarClock, MessageSquareShare, Settings, LogOut, Facebook, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Báo cáo Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Quản lý Fanpage', href: '/fanpages', icon: Users },
        { name: 'Lên lịch bài viết', href: '/scheduling', icon: CalendarClock },
        { name: 'Tự động Seeding', href: '/seeding', icon: MessageSquareShare },
    ];

    return (
        <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative w-64 h-full bg-white border-r border-[#E5E7EB] flex flex-col justify-between flex-shrink-0 shadow-sm z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div>
                    {/* Logo Brand */}
                    <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB] justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#1877F2] p-1.5 rounded-lg flex items-center justify-center">
                                <Facebook className="text-white w-5 h-5" />
                            </div>
                            <h1 className="text-lg font-bold text-[#111827] tracking-tight">August</h1>
                        </div>
                        <button className="md:hidden p-1 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="p-4 space-y-1">
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu chính</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${isActive
                                        ? 'bg-[#EBF5FF] text-[#1877F2]'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#1877F2]' : 'text-gray-400'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Profile Area */}
                <div className="p-4 border-t border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex-shrink-0 border-2 border-white shadow-sm"></div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">Admin Viz</p>
                            <p className="text-xs text-gray-500 truncate">Pro Plan</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                            <Settings className="w-5 h-5 text-gray-400" />
                            Cài đặt
                        </button>
                        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-1">
                            <LogOut className="w-5 h-5 text-red-400" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col relative">
                {/* Header Bar */}
                <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 md:px-8 flex-shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                            {navItems.find(item => item.href === pathname)?.name || 'Trang chủ'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:flex text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Hệ thống ổn định
                        </span>
                        <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 border border-white shadow-sm"></div>
                    </div>
                </header>

                {/* Page Content padding */}
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-20 fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
