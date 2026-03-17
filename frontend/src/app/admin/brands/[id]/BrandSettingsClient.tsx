'use client';

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Sparkles, Globe, Layout, Code } from 'lucide-react'
import { slugify } from '@/lib/utils'
import Link from 'next/link'

interface BrandSettingsClientProps {
    brand: any
}

export default function BrandSettingsClient({ brand }: BrandSettingsClientProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    
    const [name, setName] = useState(brand.name || '')
    const [subdomain, setSubdomain] = useState(brand.subdomain || '')
    const [htmlContent, setHtmlContent] = useState(brand.html_content || '')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData(e.currentTarget)
        const brandData = {
            name: formData.get('name') as string,
            subdomain: formData.get('subdomain') as string,
            hero_title: formData.get('hero_title') as string,
            hero_subtitle: formData.get('hero_subtitle') as string,
            primary_color: formData.get('primary_color') as string,
            contact_email: formData.get('contact_email') as string,
            contact_phone: formData.get('contact_phone') as string,
            html_content: formData.get('html_content') as string,
        }

        const { error: updateError } = await supabase
            .from('brands')
            .update(brandData)
            .eq('id', brand.id)

        if (updateError) {
            setError(updateError.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
            router.refresh()
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-gray-50">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">quay lại</span>
                </button>
                <div>
                    <h1 className="text-3xl font-black lowercase tracking-tighter text-right">thiết lập landing page</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">tùy chỉnh cấu hình và nội dung</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-6 rounded-[1.5rem] border border-red-100 flex items-center gap-4 animate-shake">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">!</div>
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-[#dafc69]/10 text-black p-6 rounded-[1.5rem] border border-[#dafc69]/20 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-10 h-10 rounded-full bg-[#dafc69] flex items-center justify-center flex-shrink-0">✓</div>
                    <p className="text-sm font-bold">Cập nhật thiết lập thành công!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Core Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Thông tin cơ bản</label>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <input
                                        name="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tên landing page"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#dafc69] outline-none font-bold text-sm placeholder:text-gray-300 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center bg-gray-50 rounded-2xl focus-within:ring-2 focus-within:ring-[#dafc69] transition-all">
                                        <input
                                            name="subdomain"
                                            required
                                            value={subdomain}
                                            onChange={(e) => setSubdomain(slugify(e.target.value))}
                                            placeholder="subdomain"
                                            className="flex-1 px-6 py-4 bg-transparent border-none outline-none font-bold text-sm placeholder:text-gray-300"
                                        />
                                        <span className="pr-6 text-gray-300 text-[10px] font-black uppercase tracking-widest">
                                            .augustevents.co.uk
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Nội dung Hero (Fallback)</label>
                            <div className="space-y-4">
                                <input
                                    name="hero_title"
                                    defaultValue={brand.hero_title}
                                    placeholder="Tiêu đề chính"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#dafc69] outline-none font-bold text-sm placeholder:text-gray-300 transition-all"
                                />
                                <textarea
                                    name="hero_subtitle"
                                    defaultValue={brand.hero_subtitle}
                                    rows={4}
                                    placeholder="Mô tả ngắn gọn..."
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#dafc69] outline-none font-bold text-sm placeholder:text-gray-300 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2 italic">Import HTML</label>
                            <textarea
                                name="html_content"
                                value={htmlContent}
                                onChange={(e) => setHtmlContent(e.target.value)}
                                rows={12}
                                placeholder="Dán mã HTML của bạn vào đây..."
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#dafc69] outline-none font-mono text-xs placeholder:text-gray-300 transition-all resize-none"
                            />
                            <p className="text-[9px] text-gray-400 px-2 italic">Hệ thống sẽ ưu tiên hiển thị mã HTML này nếu có.</p>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Thông tin liên hệ</label>
                            <div className="grid md:grid-cols-2 gap-6">
                                <input
                                    name="contact_email"
                                    type="email"
                                    defaultValue={brand.contact_email}
                                    placeholder="Email liên hệ"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#dafc69] outline-none font-bold text-sm placeholder:text-gray-300 transition-all"
                                />
                                <input
                                    name="contact_phone"
                                    defaultValue={brand.contact_phone}
                                    placeholder="Số điện thoại"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#dafc69] outline-none font-bold text-sm placeholder:text-gray-300 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Designer Link */}
                <div className="space-y-8">
                    <div className="bg-black p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Màu sắc chủ đạo</label>
                            <div className="flex items-center gap-6">
                                <input
                                    name="primary_color"
                                    type="color"
                                    defaultValue={brand.primary_color || '#dafc69'}
                                    className="w-16 h-16 bg-transparent border-none rounded-full cursor-pointer p-0 overflow-hidden shadow-xl"
                                />
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Màu thương hiệu
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-[#dafc69]/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                        <Link
                            href={`/admin/brands/${brand.id}/edit`}
                            className="w-full flex items-center justify-center gap-3 py-6 px-4 bg-gray-50 text-black border border-gray-100 rounded-[2rem] font-black text-sm lowercase hover:bg-[#dafc69] transition-all group"
                        >
                            <Code size={18} className="group-hover:scale-110 transition-transform" />
                            <span>mở trình soạn thảo HTML</span>
                        </Link>
                        <a
                            href={`/brand/${brand.subdomain}`}
                            target="_blank"
                            className="w-full flex items-center justify-center gap-3 py-6 px-4 bg-gray-50 text-gray-400 rounded-[2rem] font-black text-sm lowercase hover:text-black transition-all"
                        >
                            <Globe size={18} />
                            <span>Xem trang thực tế</span>
                        </a>
                    </div>

                    <div className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-sm lowercase hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Lưu thay đổi</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
