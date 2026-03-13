"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Save, Settings as SettingsIcon, Image as ImageIcon, Video, Type, Phone, Mail, Instagram, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cmsService } from "@/services/api";
import MediaLibraryModal from "@/components/common/MediaLibraryModal";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [mediaModal, setMediaModal] = useState<{ isOpen: boolean; field: string; title: string }>({
        isOpen: false,
        field: "",
        title: ""
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await cmsService.getSettings();
            setSettings(response.data);
        } catch (err) {
            console.error("Error fetching settings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await cmsService.updateSettings(settings);
            alert("Đã lưu cấu hình thành công!");
        } catch (err) {
            console.error("Error saving settings:", err);
            alert("Lưu thất bại!");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#dafc69]" />
                </div>
            </AdminLayout>
        );
    }

    const Section = ({ title, children, icon: Icon }: any) => (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <Icon className="w-6 h-6 text-gray-900" />
                </div>
                <h2 className="text-2xl font-black lowercase tracking-tighter">{title}</h2>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );

    const InputField = ({ label, field, placeholder, icon: Icon, type = "text" }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                <Icon className="w-3 h-3" /> {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    value={settings[field] || ""}
                    onChange={e => handleUpdate(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none resize-none"
                    rows={4}
                />
            ) : (
                <div className="flex gap-2">
                    <input
                        value={settings[field] || ""}
                        onChange={e => handleUpdate(field, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 px-6 py-4 bg-gray-50 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#dafc69] outline-none"
                    />
                    {(field.includes('url') || field.includes('image')) && (
                        <button
                            onClick={() => setMediaModal({ isOpen: true, field, title: `Chọn ${label}` })}
                            className="px-6 bg-black text-white rounded-[1.5rem] font-black text-xs lowercase hover:bg-gray-800 transition-colors"
                        >
                            chọn
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <AdminLayout>
            <div className="space-y-10 pb-40">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black lowercase tracking-tighter">Cấu hình trang chủ</h1>
                        <p className="text-gray-500 mt-2">Tùy chỉnh nội dung hiển thị ở các phần Hero, About và Footer.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-black text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 text-[#dafc69]" />}
                        lưu tất cả thay đổi
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Section title="hero (banner)" icon={SettingsIcon}>
                        <InputField label="Dòng tiêu đề 1" field="hero_title_1" placeholder="Vd: agency sự kiện" icon={Type} />
                        <InputField label="Dòng tiêu đề 2" field="hero_title_2" placeholder="Vd: & marketing" icon={Type} />
                        <InputField label="Heading chính (Sử dụng \n để xuống dòng)" field="hero_heading" placeholder="Nội dung lớn..." icon={Type} type="textarea" />
                        <InputField label="Video nền (URL)" field="hero_video_url" placeholder="URL video .mp4..." icon={Video} />
                    </Section>

                    <Section title="về chúng tôi (about)" icon={SettingsIcon}>
                        <InputField label="Heading giới thiệu" field="about_heading" placeholder="Tiêu đề to..." icon={Type} type="textarea" />
                        <InputField label="Mô tả chi tiết" field="about_desc" placeholder="Nội dung phụ..." icon={Type} type="textarea" />
                        <InputField label="Ảnh đại diện" field="about_image_url" placeholder="URL hình ảnh..." icon={ImageIcon} />
                    </Section>

                    <Section title="liên hệ (contact)" icon={Phone}>
                        <InputField label="Số điện thoại" field="contact_phone" placeholder="+44..." icon={Phone} />
                        <InputField label="Email" field="contact_email" placeholder="email@..." icon={Mail} />
                        <InputField label="Instagram" field="contact_instagram" placeholder="username" icon={Instagram} />
                    </Section>
                </div>

                <MediaLibraryModal
                    isOpen={mediaModal.isOpen}
                    onClose={() => setMediaModal(prev => ({ ...prev, isOpen: false }))}
                    onSelect={(url) => {
                        handleUpdate(mediaModal.field, url);
                        setMediaModal(prev => ({ ...prev, isOpen: false }));
                    }}
                    title={mediaModal.title}
                />
            </div>
        </AdminLayout>
    );
}
