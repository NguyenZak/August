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
    Download,
    History,
    ChevronRight,
    RotateCcw,
    X as CloseIcon
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface HTMLEditorProps {
    brandId: string
    brandName: string
    initialHtml: string
}

interface Version {
    id: string
    html_content: string
    created_at: string
}

export default function HTMLEditor({ brandId, brandName, initialHtml }: HTMLEditorProps) {
    const [html, setHtml] = useState(initialHtml || '')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [showPreview, setShowPreview] = useState(true)
    const [showHistory, setShowHistory] = useState(false)
    const [isVisualMode, setIsVisualMode] = useState(false)
    const [versions, setVersions] = useState<Version[]>([])
    const [loadingVersions, setLoadingVersions] = useState(false)
    const supabase = createClient()
    const router = useRouter()
    const iframeRef = React.useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (saved) setSaved(false)
        }, 3000)
        return () => clearTimeout(timeout)
    }, [saved])

    useEffect(() => {
        if (showHistory) {
            fetchVersions()
        }
    }, [showHistory])

    // Handle messages from the iframe (visual editing)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'HTML_UPDATE') {
                // Remove the injected markers before saving back to state
                let newHtml = event.data.html
                newHtml = newHtml.replace(/<style id="visual-editing-style">[\s\S]*?<\/style>/, '')
                newHtml = newHtml.replace(/\scontenteditable="true"/g, '')
                setHtml(newHtml)
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    // Inject visual editing script when iframe loads or visual mode toggles
    const handleIframeLoad = () => {
        if (!isVisualMode || !iframeRef.current) return

        const iframe = iframeRef.current
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return

        // Inject styles
        if (!doc.getElementById('visual-editing-style')) {
            const style = doc.createElement('style')
            style.id = 'visual-editing-style'
            style.innerHTML = `
                [contenteditable="true"]:hover {
                    outline: 2px dashed #dafc69 !important;
                    outline-offset: 4px;
                    cursor: text;
                }
                [contenteditable="true"]:focus {
                    outline: 2px solid #dafc69 !important;
                    outline-offset: 4px;
                    cursor: text;
                }
            `
            doc.head.appendChild(style)
        }

        // Make elements containing text editable (simpler than making whole body editable)
        const textElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, li, b, i, strong, em, small')
        textElements.forEach(el => {
            (el as HTMLElement).contentEditable = "true"
        })

        // Listen for input
        doc.body.addEventListener('input', () => {
            window.parent.postMessage({
                type: 'HTML_UPDATE',
                html: doc.documentElement.outerHTML
            }, '*')
        }, true)
    }

    // Effect to toggle visual mode on existing iframe
    useEffect(() => {
        if (iframeRef.current) {
            handleIframeLoad()
            if (!isVisualMode) {
                const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
                if (doc) {
                    const style = doc.getElementById('visual-editing-style')
                    if (style) style.remove()
                    const editableElements = doc.querySelectorAll('[contenteditable="true"]')
                    editableElements.forEach(el => {
                        (el as HTMLElement).contentEditable = "false"
                    })
                }
            }
        }
    }, [isVisualMode])

    const fetchVersions = async () => {
        setLoadingVersions(true)
        const { data, error } = await supabase
            .from('brand_history')
            .select('*')
            .eq('brand_id', brandId)
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) {
            console.error('Error fetching versions:', error)
        } else {
            setVersions(data || [])
        }
        setLoadingVersions(false)
    }

    const handleSave = async () => {
        setSaving(true)
        
        // 1. Update brand content
        const { error: updateError } = await supabase
            .from('brands')
            .update({ html_content: html })
            .eq('id', brandId)

        if (updateError) {
            alert('Lỗi khi lưu: ' + updateError.message)
            setSaving(false)
            return
        }

        // 2. Add to history
        const { error: historyError } = await supabase
            .from('brand_history')
            .insert({
                brand_id: brandId,
                html_content: html
            })

        if (historyError) {
            console.error('History Error:', historyError)
        }

        setSaving(false)
        setSaved(true)
        if (showHistory) fetchVersions()
    }

    const restoreVersion = (versionHtml: string) => {
        if (confirm('Bạn có chắc chắn muốn khôi phục về phiên bản này? Mọi thay đổi hiện tại chưa lưu sẽ bị mất.')) {
            setHtml(versionHtml)
            setShowHistory(false)
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
                            title="Máy tính"
                        >
                            <Monitor size={16} />
                        </button>
                        <button 
                            onClick={() => setViewport('tablet')}
                            className={`p-2 rounded-full transition-all ${viewport === 'tablet' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                            title="Máy tính bảng"
                        >
                            <Tablet size={16} />
                        </button>
                        <button 
                            onClick={() => setViewport('mobile')}
                            className={`p-2 rounded-full transition-all ${viewport === 'mobile' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                            title="Điện thoại"
                        >
                            <Smartphone size={16} />
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsVisualMode(!isVisualMode)}
                        className={`px-4 py-2 border border-white/10 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isVisualMode ? 'bg-[#dafc69] text-black border-[#dafc69]' : 'hover:bg-white/5'}`}
                    >
                        <Eye size={14} />
                        <span>sửa trực tiếp</span>
                    </button>

                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`px-4 py-2 border border-white/10 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${showHistory ? 'bg-[#dafc69] text-black border-[#dafc69]' : 'hover:bg-white/5'}`}
                    >
                        <History size={14} />
                        <span>lịch sử</span>
                    </button>

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
            <main className="flex-1 flex overflow-hidden relative">
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
                    <div className="flex-1 bg-[#1A1A1A] flex items-center justify-center p-8 overflow-auto relative">
                        {isVisualMode && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-[#dafc69] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                                <AlertCircle size={12} />
                                chế độ sửa trực tiếp đang bật
                            </div>
                        )}
                        <div 
                            className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden relative ${
                                viewport === 'desktop' ? 'w-full h-full' : 
                                viewport === 'tablet' ? 'w-[768px] h-[1024px]' : 
                                'w-[375px] h-[667px]'
                            }`}
                        >
                            {html ? (
                                <iframe
                                    ref={iframeRef}
                                    srcDoc={html}
                                    title="Preview"
                                    className="w-full h-full border-none"
                                    onLoad={handleIframeLoad}
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

                {/* History Sidebar Overlay */}
                {showHistory && (
                    <div className="absolute top-0 right-0 w-80 h-full bg-[#161616] border-l border-white/10 z-50 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
                        <div className="h-14 px-6 flex items-center justify-between border-b border-white/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Lịch sử chỉnh sửa</h2>
                            <button 
                                onClick={() => setShowHistory(false)}
                                className="p-2 hover:bg-white/5 rounded-full"
                            >
                                <CloseIcon size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-2">
                            {loadingVersions ? (
                                <div className="flex flex-col items-center py-20 gap-4 opacity-50">
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <p className="text-[10px] uppercase font-black tracking-widest">đang tải...</p>
                                </div>
                            ) : versions.length > 0 ? (
                                versions.map((version) => (
                                    <div 
                                        key={version.id}
                                        className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#dafc69]/30 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                {formatDistanceToNow(new Date(version.created_at), { addSuffix: true, locale: vi })}
                                            </span>
                                            <button 
                                                onClick={() => restoreVersion(version.html_content)}
                                                className="p-2 bg-white/5 hover:bg-[#dafc69] hover:text-black rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Khôi phục"
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-mono truncate opacity-50">
                                            {version.html_content.substring(0, 100).replace(/\s+/g, ' ')}...
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center py-32 opacity-30">
                                    <History size={40} className="mb-4" />
                                    <p className="text-[10px] uppercase font-black tracking-widest">chưa có lịch sử</p>
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
