"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Save,
    X,
    Zap,
    Target,
    Check,
    ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cmsService, Service } from "@/services/api";

export default function AdminServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await cmsService.getServices();
            setServices(response.data);
        } catch (err) {
            console.error("Error fetching services:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenEditor = (item: Service | null = null) => {
        if (item) {
            router.push(`/admin/services/${item.id}`);
        } else {
            router.push("/admin/services/new");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa dịch vụ này?")) {
            try {
                await cmsService.deleteService(id);
                fetchServices();
            } catch (err) {
                console.error("Error deleting service:", err);
                alert("Không thể xóa dịch vụ.");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter lowercase">Quản lý Dịch vụ</h1>
                        <p className="text-gray-500 mt-2 max-w-md">Chỉnh sửa nội dung cho các gói dịch vụ hiển thị trên trang chủ và trang chi tiết.</p>
                    </div>

                    <button
                        onClick={() => handleOpenEditor()}
                        className="bg-black hover:bg-gray-800 transition-all text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-xl text-sm whitespace-nowrap lowercase tracking-tight"
                    >
                        <Plus className="w-5 h-5 text-[#dafc69]" />
                        thêm dịch vụ
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service) => (
                            <motion.div
                                layout
                                key={service.id}
                                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
                            >
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${service.category === 'Marketing' ? 'bg-[#dafc69] text-black' : 'bg-black text-[#dafc69]'}`}>
                                            {service.icon === 'Zap' ? <Zap className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleOpenEditor(service)} 
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(service.id)} 
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{service.category}</span>
                                    <div 
                                        className="flex items-center justify-between mt-1 mb-4 group/title cursor-pointer" 
                                        onClick={() => handleOpenEditor(service)}
                                    >
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter lowercase">{service.title}</h3>
                                        <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{service.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
                
                {services.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold lowercase">Chưa có dịch vụ nào được tạo.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
