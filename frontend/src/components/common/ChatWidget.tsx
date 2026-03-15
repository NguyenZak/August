"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Xin chào! Tôi là trợ lý ảo August. Tôi có thể giúp gì cho bạn?',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Mock API call or real one if implemented
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputValue })
            });

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply || 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!',
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[380px] h-[550px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-black text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#dafc69] to-[#b8e030] rounded-xl flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-black" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black lowercase tracking-tighter">August AI</h3>
                                    <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Trực tuyến</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <Minus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-black text-white rounded-tr-none shadow-lg'
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-black transition-all">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 pl-4 pr-12 py-3 bg-transparent text-sm font-bold outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4 text-[#dafc69]" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-black rotate-90' : 'bg-[#dafc69] hover:bg-[#b8e030]'
                    }`}
            >
                {isOpen ? (
                    <X className="w-7 h-7 text-[#dafc69]" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="w-7 h-7 text-black" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                        </span>
                    </div>
                )}
            </motion.button>
        </div>
    );
}
