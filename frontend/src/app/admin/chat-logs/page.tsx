"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Search,
    MessageSquare,
    Calendar,
    Clock,
    User,
    Bot,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatLog {
    id: string;
    user_message: string;
    ai_response: string;
    created_at: string;
}

export default function AdminChatLogsPage() {
    const [logs, setLogs] = useState<ChatLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/cms/chat-logs');
            const data = await response.json();
            setLogs(data);
        } catch (err) {
            console.error("Error fetching chat logs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ai_response.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter lowercase">Lịch sử Chat</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Theo dõi các cuộc hội thoại giữa khách hàng và trợ lý ảo August.</p>
                    </div>

                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nội dung..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-8 py-4 bg-gray-50 border-2 border-transparent rounded-[2rem] text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-40 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">Chưa có lịch sử hội thoại nào.</p>
                        </div>
                    ) : (
                        filteredLogs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] p-8 border-2 border-gray-50 shadow-sm hover:shadow-xl hover:border-black/5 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{formatDate(log.created_at)}</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>

                                <div className="space-y-6">
                                    {/* User Message */}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div className="flex-1 bg-gray-50 p-6 rounded-3xl rounded-tl-none">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Khách hàng</p>
                                            <p className="text-sm font-bold text-gray-900 whitespace-pre-wrap">{log.user_message}</p>
                                        </div>
                                    </div>

                                    {/* AI Response */}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-5 h-5 text-[#dafc69]" />
                                        </div>
                                        <div className="flex-1 bg-black text-white p-6 rounded-3xl rounded-tl-none shadow-lg">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#dafc69]/60 mb-2">August AI</p>
                                            <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{log.ai_response}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
