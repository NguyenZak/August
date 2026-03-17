'use client'

import React, { useState, useEffect } from 'react'
import { 
    Save, 
    Eye, 
    Code, 
    Monitor, 
    Smartphone, 
    Tablet, 
    ArrowLeft,
    Globe,
    Check,
    AlertCircle,
    Maximize2,
    Download
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface HTMLEditorProps {
    brandId: string
    brandName: string
    initialHtml: string
}

export default function HTMLEditor({ brandId, brandName, initialHtml }: HTMLEditorProps) {
    const [html, setHtml] = useState(initialHtml || '')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [showPreview, setShowPreview] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (saved) setSaved(false)
        }, 3000)
        return () => clearTimeout(timeout)
    }, [saved])

    const handleSave = async () => {
        setSaving(true)
        const { error } = await supabase
            .from('brands')
            .update({ html_content: html })
            .eq('id', brandId)

        setSaving(false)
        if (error) {
            alert('Lỗi khi lưu: ' + error.message)
        } else {
            setSaved(true)
        }
    }

    const downloadHtml = () => {
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-landing.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="fixed inset-0 bg-[#0E0E0E] text-white flex flex-col z-[100]">
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0E0E0E]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-[1px] bg-white/10"></div>
                    <div>
                        <h1 className="text-sm font-black lowercase tracking-tight">{brandName}</h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">html landing page editor</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/5 rounded-full p-1 mr-4">
                        <button 
                            onClick={() => setViewport('desktop')}
                            className={`p-2 rounded-full transition-all ${viewport === 'desktop' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Monitor size={16} />
                        </button>
                        <button 
                            onClick={() => setViewport('tablet')}
                            className={`p-2 rounded-full transition-all ${viewport === 'tablet' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Tablet size={16} />
                        </button>
                        <button 
                            onClick={() => setViewport('mobile')}
                            className={`p-2 rounded-full transition-all ${viewport === 'mobile' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Smartphone size={16} />
                        </button>
                    </div>

                    <button 
                        onClick={downloadHtml}
                        className="px-4 py-2 border border-white/10 rounded-full text-xs font-bold hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <Download size={14} />
                        <span>tải về</span>
                    </button>

                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-2 rounded-full text-xs font-black lowercase transition-all flex items-center gap-2 ${saved ? 'bg-[#dafc69] text-black' : 'bg-white text-black hover:bg-[#dafc69]'}`}
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : saved ? (
                            <><Check size={14} /> <span>đã lưu</span></>
                        ) : (
                            <><Save size={14} /> <span>lưu thay đổi</span></>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Side: Code Editor */}
                <div className={`flex-1 flex flex-col border-r border-white/10 ${!showPreview ? 'w-full' : 'max-w-[50%]'}`}>
                    <div className="h-10 px-4 flex items-center justify-between bg-white/5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Code size={14} className="text-[#dafc69]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">index.html</span>
                        </div>
                        <button 
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-[10px] font-black uppercase tracking-widest text-[#dafc69] hover:underline"
                        >
                            {showPreview ? 'ẩn xem trước' : 'hiện xem trước'}
                        </button>
                    </div>
                    <textarea
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        className="flex-1 w-full bg-[#0E0E0E] p-6 font-mono text-sm text-gray-300 outline-none resize-none selection:bg-[#dafc69] selection:text-black line-clamp-none custom-scrollbar"
                        placeholder="<!-- Dán mã HTML của bạn vào đây... -->"
                        spellCheck={false}
                    />
                </div>

                {/* Right Side: Preview */}
                {showPreview && (
                    <div className="flex-1 bg-[#1A1A1A] flex items-center justify-center p-8 overflow-auto">
                        <div 
                            className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden relative ${
                                viewport === 'desktop' ? 'w-full h-full' : 
                                viewport === 'tablet' ? 'w-[768px] h-[1024px]' : 
                                'w-[375px] h-[667px]'
                            }`}
                        >
                            {html ? (
                                <iframe
                                    srcDoc={html}
                                    title="Preview"
                                    className="w-full h-full border-none"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                                        <Eye className="text-gray-200" size={32} />
                                    </div>
                                    <p className="text-sm font-bold lowercase">nhập mã html để xem trước</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    )
}
