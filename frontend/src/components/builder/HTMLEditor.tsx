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
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [showPreview, setShowPreview] = useState(true)
    const [showHistory, setShowHistory] = useState(false)
    const [isVisualMode, setIsVisualMode] = useState(false)
    const [versions, setVersions] = useState<Version[]>([])
    const [loadingVersions, setLoadingVersions] = useState(false)
    const [lastHistorySnapshot, setLastHistorySnapshot] = useState<number>(Date.now())
    
    const supabase = createClient()
    const router = useRouter()
    const iframeRef = React.useRef<HTMLIFrameElement>(null)

    // Auto-save logic
    useEffect(() => {
        if (html === initialHtml && saveStatus === 'saved') return

        const delay = 2000 // 2 seconds delay
        setSaveStatus('unsaved')
        
        const timeout = setTimeout(() => {
            handleSave()
        }, delay)

        return () => clearTimeout(timeout)
    }, [html])

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
                newHtml = newHtml.replace(/<script id="silence-tailwind-warning">[\s\S]*?<\/script>/, '')
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

        // Silence Tailwind CDN Production warning
        const silenceScriptId = 'silence-tailwind-warning'
        if (!doc.getElementById(silenceScriptId)) {
            const script = doc.createElement('script')
            script.id = silenceScriptId
            script.innerHTML = `
                (function() {
                    const originalWarn = console.warn;
                    console.warn = function(...args) {
                        if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com should not be used in production')) {
                            return;
                        }
                        originalWarn.apply(console, args);
                    };
                })();
            `
            doc.head.appendChild(script)
        }

        // Make elements containing text editable
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

    const handleSave = async (forceSnapshot = false) => {
        setSaving(true)
        setSaveStatus('saving')
        
        // 1. Update brand content
        const { error: updateError } = await supabase
            .from('brands')
            .update({ html_content: html })
            .eq('id', brandId)

        if (updateError) {
            console.error('Lỗi khi lưu:', updateError.message)
            setSaveStatus('unsaved')
            setSaving(false)
            return
        }

        // 2. Add to history ONLY if more than 5 minutes since last snapshot or forced
        const fiveMinutes = 5 * 60 * 1000
        const now = Date.now()
        
        if (forceSnapshot || (now - lastHistorySnapshot > fiveMinutes)) {
            const { error: historyError } = await supabase
                .from('brand_history')
                .insert({
                    brand_id: brandId,
                    html_content: html
                })

            if (!historyError) {
                setLastHistorySnapshot(now)
                if (showHistory) fetchVersions()
            }
        }

        setSaving(false)
        setSaveStatus('saved')
    }

    const restoreVersion = (versionHtml: string) => {
        if (confirm('Bạn có chắc chắn muốn khôi phục về phiên bản này? Mọi thay đổi hiện tại chưa lưu sẽ bị mất.')) {
            setHtml(versionHtml)
            setShowHistory(false)
            setSaveStatus('unsaved')
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
                    {/* Save Status Indicator */}
                    <div className="flex items-center gap-2 mr-4 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        {saveStatus === 'saving' ? (
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#dafc69]">
                                <div className="w-2 h-2 bg-[#dafc69] rounded-full animate-pulse" />
                                <span>đang lưu...</span>
                            </div>
                        ) : saveStatus === 'saved' ? (
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <Check size={12} className="text-[#dafc69]" />
                                <span>đã lưu vào đám mây</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500">
                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                <span>có thay đổi chưa lưu</span>
                            </div>
                        )}
                    </div>

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
                        onClick={() => handleSave(true)}
                        disabled={saving || saveStatus === 'saved'}
                        className={`px-6 py-2 rounded-full text-xs font-black lowercase transition-all flex items-center gap-2 ${saveStatus === 'saved' ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-[#dafc69]'}`}
                    >
                        <Save size={14} />
                        <span>xuất bản</span>
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
