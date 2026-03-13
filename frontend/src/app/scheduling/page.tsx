"use client";
import AppLayout from "@/components/layout/AppLayout";
import { CalendarClock, ImagePlus, Send, CheckSquare, Clock3, Search } from "lucide-react";

export default function SchedulingPage() {
    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Lên lịch Đăng bài</h1>
                        <p className="text-gray-500 text-sm mt-1">Soạn một lần, xuất bản hàng loạt trang Fanpage vào khung giờ vàng.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

                    {/* Main Editor */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* Content Block */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl"></div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">1</span>
                                Nội dung Bài đăng
                            </h2>

                            <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                                <textarea
                                    className="w-full min-h-[160px] p-4 border-none focus:ring-0 resize-y text-gray-700 leading-relaxed"
                                    placeholder="Bạn đang nghĩ gì? Gõ nội dung bài viết vào đây..."
                                ></textarea>

                                {/* Fake Editor Toolbar */}
                                <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center gap-2">
                                    <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors tooltip">😀</button>
                                    <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors tooltip text-sm font-bold">#</button>
                                </div>
                            </div>

                            {/* Media Uploader Dropzone */}
                            <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors group cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 transition-colors"></div>
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <ImagePlus className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700">Tải lên Media</h3>
                                    <p className="text-xs text-gray-500 mt-1">Kéo thả Ảnh / Video hoặc <span className="text-blue-600 underline">Chọn tệp</span></p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">

                        {/* Target Selector */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">2</span>
                                Chọn Fanpage
                            </h2>

                            <div className="relative mb-4">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Tìm kiếm..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors" />
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {/* Check All */}
                                <label className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Chọn tất cả (2 Trang)</span>
                                    </div>
                                </label>

                                {/* List Imock */}
                                {[1, 2].map((i) => (
                                    <label key={i} className="flex items-center justify-between p-3 border border-transparent hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                            <div className="flex items-center gap-2">
                                                <img src={`https://ui-avatars.com/api/?name=Fanpage+${i}&background=random`} className="w-7 h-7 rounded-sm shadow-sm" />
                                                <span className="text-sm font-medium text-gray-700">Trang Demo {i}</span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Publish Settings */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">3</span>
                                Cài đặt Xuất bản
                            </h2>

                            <div className="space-y-4">
                                <label className="flex p-3 border border-blue-200 bg-blue-50/50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                                    <div className="flex items-center h-5">
                                        <input type="radio" name="schedule_type" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    </div>
                                    <div className="ml-3">
                                        <span className="block text-sm font-semibold text-blue-900">Đăng ngay lập tức</span>
                                        <span className="block text-xs text-blue-700/70 mt-0.5">Bài viết sẽ được Xuất bản ngay bây giờ.</span>
                                    </div>
                                </label>

                                <label className="flex p-3 border border-gray-200 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center h-5">
                                        <input type="radio" name="schedule_type" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    </div>
                                    <div className="ml-3 w-full">
                                        <span className="block text-sm font-semibold text-gray-800">Lên lịch chờ</span>
                                        <span className="block text-xs text-gray-500 mt-0.5">Hệ thống sẽ tự động đăng vào thời gian đã chọn.</span>
                                    </div>
                                </label>

                                {/* Time Inputs (Hidden when immediate is checked, shown as disabled for mockup) */}
                                <div className="grid grid-cols-2 gap-3 opacity-50 relative">
                                    <div className="absolute inset-0 bg-transparent z-10 cursor-not-allowed" title="Chọn Lên Lịch để kích hoạt"></div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Ngày đăng</label>
                                        <div className="relative">
                                            <input type="date" className="w-full border-gray-200 rounded-lg text-sm bg-gray-50 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Khung giờ</label>
                                        <div className="relative">
                                            <input type="time" className="w-full border-gray-200 rounded-lg text-sm bg-gray-50 pointer-events-none" defaultValue="09:00" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Action Button */}
                        <div className="pt-2 sticky bottom-6">
                            <button className="w-full bg-[#1877F2] hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 px-6 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3">
                                <Send className="w-5 h-5" />
                                XUẤT BẢN NGAY (0 TRANG)
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
