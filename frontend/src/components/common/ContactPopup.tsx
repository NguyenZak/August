"use client";

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useContact } from '@/context/ContactContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function ContactPopup() {
    const { isOpen, closeContact } = useContact();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessModel: '',
        website: '',
        fanpage: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
    };

    const handleClose = () => {
        setIsSubmitted(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            businessModel: '',
            website: '',
            fanpage: ''
        });
        closeContact();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 10,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-2xl bg-white text-black rounded-[2.5rem] overflow-hidden shadow-2xl z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleClose}
                            className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                            {/* Left Side: Branding */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="hidden md:flex md:w-1/3 bg-[#dafc69] p-10 flex-col justify-between"
                            >
                                <div>
                                    <img src="/assets/august/logo.svg" alt="August" className="h-8 w-auto mb-8 invert" />
                                    <h2 className="text-3xl font-black lowercase leading-none tracking-tighter">
                                        {isSubmitted ? 'tuyệt vời!' : 'bắt đầu\ndự án ngay'}
                                    </h2>
                                </div>
                                <p className="text-sm font-bold opacity-60 lowercase">
                                    hệ thống sự kiện<br />& marketing hàng đầu
                                </p>
                            </motion.div>

                            {/* Right Side Content */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[90vh]">
                                <AnimatePresence mode="wait">
                                    {isSubmitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            className="text-center"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                                                className="w-20 h-20 bg-[#dafc69] rounded-full flex items-center justify-center mx-auto mb-8"
                                            >
                                                <Send className="w-10 h-10 text-black" />
                                            </motion.div>
                                            <h3 className="text-4xl font-black lowercase tracking-tighter mb-4">gửi thành công!</h3>
                                            <p className="text-xl text-gray-500 lowercase leading-relaxed">
                                                Cảm ơn bạn đã tin tưởng August. Đội ngũ chuyên gia của chúng tôi sẽ xem xét và liên hệ lại với bạn trong vòng <span className="text-black font-bold italic">24 giờ làm việc.</span>
                                            </p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleClose}
                                                className="mt-10 px-8 py-3 rounded-full bg-black text-white font-bold lowercase hover:bg-[#dafc69] hover:text-black transition-all"
                                            >
                                                đóng thông báo
                                            </motion.button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="form" className="w-full">
                                            <motion.h3 variants={itemVariants} className="text-2xl font-black lowercase mb-8 flex md:hidden">liên hệ</motion.h3>

                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <motion.div variants={itemVariants}>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Họ và tên *</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dafc69] transition-all outline-none"
                                                            placeholder="Nguyễn Văn A"
                                                        />
                                                    </motion.div>
                                                    <motion.div variants={itemVariants}>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Số điện thoại *</label>
                                                        <input
                                                            required
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dafc69] transition-all outline-none"
                                                            placeholder="09xx xxx xxx"
                                                        />
                                                    </motion.div>
                                                </div>

                                                <motion.div variants={itemVariants}>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dafc69] transition-all outline-none"
                                                        placeholder="name@example.com"
                                                    />
                                                </motion.div>

                                                <motion.div variants={itemVariants}>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Mô hình kinh doanh hiện tại</label>
                                                    <input
                                                        type="text"
                                                        name="businessModel"
                                                        value={formData.businessModel}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dafc69] transition-all outline-none"
                                                        placeholder="Vd: Thương mại điện tử, F&B..."
                                                    />
                                                </motion.div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <motion.div variants={itemVariants}>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Website</label>
                                                        <input
                                                            type="url"
                                                            name="website"
                                                            value={formData.website}
                                                            onChange={handleChange}
                                                            className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dafc69] transition-all outline-none"
                                                            placeholder="https://..."
                                                        />
                                                    </motion.div>
                                                    <motion.div variants={itemVariants}>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Fanpage</label>
                                                        <input
                                                            type="text"
                                                            name="fanpage"
                                                            value={formData.fanpage}
                                                            onChange={handleChange}
                                                            className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dafc69] transition-all outline-none"
                                                            placeholder="facebok.com/..."
                                                        />
                                                    </motion.div>
                                                </div>

                                                <motion.button
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.02, backgroundColor: '#dafc69', color: '#000' }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="submit"
                                                    className="w-full bg-black text-white py-4 rounded-full font-black lowercase text-lg transition-all flex items-center justify-center gap-3 mt-4"
                                                >
                                                    Gửi yêu cầu <Send className="w-5 h-5" />
                                                </motion.button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
