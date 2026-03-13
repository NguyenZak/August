'use client'

import React, { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import {
    Plus, Trash2, GripVertical, Settings2, Eye, Save,
    ChevronLeft, Layout, Sparkles, MessageSquare,
    Code, Monitor, Tablet, Smartphone, Copy, Share2,
    Globe, History, ChevronRight, Check, X, Mic, Paperclip, ArrowUp, Pencil
} from 'lucide-react'
import { Section, SectionRenderer, SectionForm, HTMLBlock } from './SectionRenderer'
import { createClient } from '@/utils/supabase/client'

interface BuilderProps {
    initialSections: Section[]
    brandId: string
    brandName?: string
}

export default function BrandBuilder({ initialSections, brandId, brandName = 'Untitled App' }: BuilderProps) {
    const [sections, setSections] = useState<Section[]>(initialSections || [])
    const [saving, setSaving] = useState(false)
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [logs, setLogs] = useState<any[]>([
        { id: 1, type: 'ai', content: `Chào bạn! Tôi là trợ lý thiết kế. Bạn muốn xây dựng website như thế nào cho thương hiệu **${brandName}**?`, timestamp: new Date() }
    ])
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [appName, setAppName] = useState(brandName)
    const [rawCode, setRawCode] = useState(JSON.stringify(initialSections || [], null, 2))

    const supabase = createClient()
    const logEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (viewMode === 'code') {
            setRawCode(JSON.stringify(sections, null, 2))
        }
    }, [viewMode, sections])

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return
        const items = Array.from(sections)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setSections(items)
        addLog('user', `Hành động: Thay đổi thứ tự các khối.`);
    }

    const addLog = (type: 'user' | 'ai', content: string) => {
        setLogs(prev => [...prev, { id: Date.now(), type, content, timestamp: new Date() }])
    }

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        setIsGenerating(true)
        addLog('user', prompt)

        // Simulating AI Thought Process
        setTimeout(() => {
            const newSections: Section[] = [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'hero',
                    content: { title: 'khám phá sự sang trọng.', subtitle: 'giải pháp hoàn hảo cho thương hiệu của bạn.' }
                },
                {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'features',
                    content: { title: 'tính năng vượt trội.', subtitle: 'được thiết kế để tối ưu trải nghiệm người dùng.' }
                }
            ]
            setSections([...sections, ...newSections])
            addLog('ai', `Đã tạo 2 khối mới dựa trên mô tả: "${prompt}". Bạn có muốn tinh chỉnh thêm gì không?`)
            setIsGenerating(false)
            setPrompt('')
        }, 1500)
    }

    const savePage = async () => {
        setSaving(true)
        const { error } = await supabase
            .from('brands')
            .update({ sections: sections, name: appName })
            .eq('id', brandId)

        setSaving(false)
        if (error) alert('Error saving: ' + error.message)
        else addLog('ai', 'đã lưu tất cả thay đổi vào hệ thống thành công.')
    }

    const removeSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id))
        if (activeSectionId === id) setActiveSectionId(null)
    }

    const handleApplyCode = () => {
        try {
            const parsed = JSON.parse(rawCode)
            if (Array.isArray(parsed)) {
                setSections(parsed)
                addLog('ai', 'đã cập nhật cấu trúc website từ mã nguồn thành công.')
            } else {
                alert('Mã nguồn phải là một mảng các khối (Array).')
            }
        } catch (e) {
            alert('JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.')
        }
    }

    const handleFormatCode = () => {
        try {
            const parsed = JSON.parse(rawCode)
            setRawCode(JSON.stringify(parsed, null, 2))
        } catch (e) {
            alert('Không thể định dạng: JSON không hợp lệ.')
        }
    }

    return (
        <div className="flex h-screen bg-[#F8F9FA] text-[#202124] font-sans overflow-hidden">
            {/* Left Sidebar - AI Assistant (Google AI Studio Copy) */}
            <aside className="w-[400px] bg-white border-r border-[#DEE2E6] flex flex-col relative z-20">
                <div className="h-16 px-6 flex items-center justify-between border-b border-[#DEE2E6]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#1A73E8]"></div>
                        <span className="text-sm font-medium text-[#3C4043]">Code assistant</span>
                    </div>
                    <button className="p-2 hover:bg-[#F1F3F4] rounded-full transition-colors">
                        <Settings2 size={16} className="text-[#5F6368]" />
                    </button>
                </div>

                {/* Interaction Logs */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
                    {logs.map((log) => (
                        <div key={log.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {log.type === 'ai' ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 rounded-full bg-[#1A73E8] flex items-center justify-center text-white">
                                            <Sparkles size={10} />
                                        </div>
                                        <span className="text-[10px] font-bold text-[#1A73E8] uppercase tracking-widest">August AI</span>
                                    </div>
                                    <div className="text-sm leading-relaxed text-[#202124] bg-[#F8F9FA] p-4 rounded-2xl border border-[#DEE2E6] whitespace-pre-wrap">
                                        {log.content}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-end">
                                    <div className="max-w-[85%] bg-[#E8F0FE] text-[#1A73E8] p-4 rounded-2xl text-sm font-medium leading-relaxed">
                                        {log.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>

                {/* Floating Prompt Bar (Bottom) */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#DEE2E6] p-2 pr-4 transition-focus-within focus-within:ring-2 focus-within:ring-[#1A73E8]/20">
                        {/* Suggestion Chips */}
                        <div className="flex gap-2 mb-2 px-2 overflow-x-auto no-scrollbar">
                            {['+ RSVP', '+ Hero', '+ Gallery', 'Animate'].map(chip => (
                                <button key={chip} className="px-3 py-1 bg-[#F1F3F4] text-[10px] font-bold text-[#5F6368] rounded-full hover:bg-[#E8EAED] transition-colors whitespace-nowrap">
                                    {chip}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-end gap-2 px-2">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                                placeholder="Describe your website, add features, ask for anything..."
                                className="w-full bg-transparent border-none outline-none text-sm py-2 resize-none max-h-32 placeholder-[#5F6368]"
                                rows={1}
                            />
                            <div className="flex items-center gap-1 mb-1">
                                <button className="p-2 hover:bg-[#F1F3F4] rounded-full text-[#5F6368] transition-colors">
                                    <Mic size={18} />
                                </button>
                                <button className="p-2 hover:bg-[#F1F3F4] rounded-full text-[#5F6368] transition-colors">
                                    <Paperclip size={18} />
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt.trim()}
                                    className={`p-2 rounded-full transition-all ${prompt.trim() ? 'bg-[#1A73E8] text-white shadow-lg' : 'bg-[#F1F3F4] text-[#5F6368]'}`}
                                >
                                    {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUp size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Workspace (Preview & Code) */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Global Header */}
                <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-[#DEE2E6]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#F1F3F4] rounded-lg transition-colors cursor-pointer group">
                            {isEditingTitle ? (
                                <input
                                    autoFocus
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                    onBlur={() => setIsEditingTitle(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                    className="bg-transparent text-sm font-medium border-none outline-none"
                                />
                            ) : (
                                <>
                                    <span className="text-sm font-medium" onClick={() => setIsEditingTitle(true)}>{appName}</span>
                                    <Pencil size={12} className="text-[#5F6368] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </>
                            )}
                        </div>
                        <div className="h-4 w-[1px] bg-[#DEE2E6]"></div>
                        <div className="flex p-1 bg-[#F1F3F4] rounded-lg">
                            <button
                                onClick={() => setViewMode('preview')}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-white shadow-sm text-[#1A73E8]' : 'text-[#5F6368] hover:text-[#202124]'}`}
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => setViewMode('code')}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'code' ? 'bg-white shadow-sm text-[#1A73E8]' : 'text-[#5F6368] hover:text-[#202124]'}`}
                            >
                                Code
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {viewMode === 'preview' && (
                            <div className="flex items-center gap-1 bg-[#F1F3F4] p-1 rounded-lg mr-4">
                                <button onClick={() => setViewport('desktop')} className={`p-1.5 rounded-md ${viewport === 'desktop' ? 'bg-white shadow-sm text-[#1A73E8]' : 'text-[#5F6368]'}`}><Monitor size={14} /></button>
                                <button onClick={() => setViewport('tablet')} className={`p-1.5 rounded-md ${viewport === 'tablet' ? 'bg-white shadow-sm text-[#1A73E8]' : 'text-[#5F6368]'}`}><Tablet size={14} /></button>
                                <button onClick={() => setViewport('mobile')} className={`p-1.5 rounded-md ${viewport === 'mobile' ? 'bg-white shadow-sm text-[#1A73E8]' : 'text-[#5F6368]'}`}><Smartphone size={14} /></button>
                            </div>
                        )}
                        <button onClick={savePage} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#1A73E8] text-white text-xs font-medium rounded-full hover:bg-[#1557B0] transition-colors disabled:opacity-50">
                            {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                            Publish
                        </button>
                        <button className="p-2 hover:bg-[#F1F3F4] rounded-full text-[#5F6368]"><Copy size={16} /></button>
                        <button className="p-2 hover:bg-[#F1F3F4] rounded-full text-[#5F6368]"><Share2 size={16} /></button>
                        <button className="p-2 hover:bg-[#F1F3F4] rounded-full text-[#5F6368]"><History size={16} /></button>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    {viewMode === 'preview' ? (
                        <div className="absolute inset-0 bg-[#F8F9FA] flex flex-col">
                            {/* URL Bar Overlay */}
                            <div className="mx-auto mt-6 w-full max-w-4xl px-4 flex items-center gap-3 bg-white border border-[#DEE2E6] h-10 rounded-xl shadow-sm z-10">
                                <Globe size={14} className="text-[#5F6368]" />
                                <span className="text-xs text-[#5F6368] truncate">https://{brandName.toLowerCase().replace(/\s+/g, '-')}.august.co</span>
                            </div>

                            {/* Canvas Wrapper */}
                            <div className="flex-1 overflow-y-auto pt-8 pb-32 flex justify-center custom-scrollbar">
                                <div className={`bg-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-[#DEE2E6] transition-all duration-700 h-fit ${viewport === 'desktop' ? 'w-full max-w-6xl rounded-2xl' :
                                    viewport === 'tablet' ? 'w-[768px] rounded-2xl' :
                                        'w-[375px] rounded-3xl'
                                    }`}>
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="sections">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="p-1">
                                                    {sections.map((section, index) => (
                                                        <Draggable key={section.id} draggableId={section.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`group relative border-2 border-transparent hover:border-[#1A73E8]/30 transition-all ${snapshot.isDragging ? 'ring-4 ring-[#1A73E8]/10' : ''}`}
                                                                >
                                                                    {/* Simple Block Overlay */}
                                                                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                                        <div {...provided.dragHandleProps} className="p-2 bg-white shadow-xl rounded-lg cursor-grab active:cursor-grabbing border border-[#DEE2E6]"><GripVertical size={14} className="text-[#5F6368]" /></div>
                                                                        <button onClick={() => removeSection(section.id)} className="p-2 bg-white text-red-500 shadow-xl rounded-lg hover:bg-red-50 border border-[#DEE2E6]"><Trash2 size={14} /></button>
                                                                    </div>

                                                                    <SectionRenderer section={section} />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                    {sections.length === 0 && (
                                        <div className="py-48 text-center bg-white rounded-2xl">
                                            <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Sparkles className="w-10 h-10 text-[#DEE2E6]" />
                                            </div>
                                            <h3 className="text-xl font-medium text-[#202124] mb-2">Trình tạo website AI</h3>
                                            <p className="text-sm text-[#5F6368]">Hãy mô tả website bạn muốn ở cột bên trái.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col bg-white">
                            {/* Toolbar for Code Mode */}
                            <div className="h-12 border-b border-[#DEE2E6] bg-[#F8F9FA] px-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest px-2">sections.json</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleFormatCode}
                                        className="text-[10px] font-bold text-[#1A73E8] hover:bg-[#1A73E8]/10 px-3 py-1 rounded transition-colors"
                                    >
                                        Format JSON
                                    </button>
                                    <button
                                        onClick={handleApplyCode}
                                        className="flex items-center gap-1.5 bg-[#1A73E8] text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm hover:bg-[#1557B0] transition-colors"
                                    >
                                        <Check size={12} /> Sync to UI
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                {/* File Tree Placeholder */}
                                <div className="w-64 border-r border-[#DEE2E6] p-4 bg-[#F8F9FA] hidden lg:block">
                                    <p className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest mb-4">Files</p>
                                    <div className="space-y-1">
                                        {['metadata.json', 'index.html', 'sections.json', 'style.css'].map(f => (
                                            <div key={f} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer ${f === 'sections.json' ? 'bg-[#1A73E8]/10 text-[#1A73E8]' : 'text-[#3C4043] hover:bg-[#F1F3F4]'}`}>
                                                <Code size={14} /> {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Code Editor */}
                                <div className="flex-1 relative bg-white group">
                                    <textarea
                                        value={rawCode}
                                        onChange={(e) => setRawCode(e.target.value)}
                                        className="absolute inset-0 w-full h-full p-12 outline-none font-mono text-sm leading-relaxed text-[#202124] resize-none overflow-y-auto custom-scrollbar"
                                        spellCheck={false}
                                    />
                                    <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <span className="text-[10px] font-medium text-slate-300">Nhấn 'Sync to UI' để áp dụng thay đổi</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
