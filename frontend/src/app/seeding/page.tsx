"use client";
import AppLayout from "@/components/layout/AppLayout";
import { Link, Play, Settings2, ShieldAlert, FileText, CheckCircle2, MessageSquareText, Activity, Clock } from "lucide-react";

export default function SeedingPage() {
    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Chiến dịch Seeding</h1>
                        <p className="text-gray-500 text-sm mt-1">Tăng tương tác an toàn với các kịch bản bình luận mồi ngẫu nhiên tự nhiên.</p>
                    </div>

                    <button className="bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors text-sm">
                        <Settings2 className="w-5 h-5" />
                        Cấu hình Nguồn Cookie
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Create Campaign Flow */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                                    <Play className="w-5 h-5" fill="currentColor" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Tạo Chiến dịch Mới</h2>
                            </div>

                            <div className="p-6 space-y-8">

                                {/* URL Input */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <Link className="w-4 h-4 text-gray-400" /> URL Bài viết Facebook
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all text-sm font-medium"
                                            placeholder="Dán link bài post vào đây (VD: https://facebook.com/...)"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <CheckCircle2 className="w-5 h-5 text-gray-300" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Seeding Amount */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                            Số lượng Tương tác (Ảo)
                                        </label>
                                        <div className="bg-gray-50 p-2 rounded-xl flex items-center justify-between border border-gray-200">
                                            <button className="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 shadow-sm">-</button>
                                            <input type="number" defaultValue={50} className="w-20 text-center border-none bg-transparent font-bold text-lg text-indigo-700 focus:ring-0 p-0" />
                                            <button className="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 shadow-sm">+</button>
                                        </div>
                                    </div>

                                    {/* Speed Strategy */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                            Chiến lược Tốc độ <Activity className="w-4 h-4 text-indigo-500" />
                                        </label>
                                        <select className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500">
                                            <option>Chậm rãi - 30-40 phút / lượt (Rất an toàn)</option>
                                            <option>Tự nhiên - 5-10 phút / lượt (Khuyên dùng)</option>
                                            <option>Tăng tốc - 1-2 phút / lượt (Rủi ro Checkpoint)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Action Selectors */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                        Cấu hình Hành vi & Kịch bản
                                    </label>

                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-4 bg-white border-2 border-indigo-500 rounded-xl cursor-pointer">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-indigo-600" /> Like ngẫu nhiên (Reacts)
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ dùng acc clone thả ngẫu nhiên ❤️, 👍, 😂.</p>
                                            </div>
                                            <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                        </label>

                                        <div className="pt-2">
                                            <label className="flex items-center justify-between mb-3 px-1">
                                                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                                    <MessageSquareText className="w-4 h-4 text-gray-600" />
                                                    Bình luận kịch bản
                                                </h4>
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Mỗi dòng 1 comment</span>
                                            </label>
                                            <textarea
                                                className="w-full min-h-[160px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all text-sm placeholder:text-gray-400 font-mono shadow-inner custom-scrollbar"
                                                placeholder="Giá bao nhiêu shop?&#10;Inbox em nhe.&#10;Sản phẩm này còn màu đen không ạ?&#10;Ship cod không thế?"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-base transition-colors">
                                    <Play className="w-5 h-5" fill="currentColor" /> KHỞI CHẠY CHIẾN DỊCH
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Running Tasks Status Sidebar */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">

                        <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl flex items-start gap-4">
                            <div className="bg-indigo-100 p-2 rounded-xl h-fit">
                                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-indigo-900 text-sm">Lưu ý an toàn</h3>
                                <p className="text-sm text-indigo-700/80 mt-1.5 leading-relaxed">Không nên seeding quá 100 comment / ngày cho 1 bài viết để tránh bộ lọc Spam của Facebook.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center justify-between">
                                Trạng thái Tiến trình
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">1 đang chạy</span>
                            </h2>

                            <div className="space-y-4">

                                {/* Running Task */}
                                <div className="border border-green-200 bg-green-50/30 p-4 rounded-xl relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 h-1 bg-green-500 w-[45%] transition-all"></div>

                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_0_4px_rgba(34,197,94,0.2)]"></div>
                                            <span className="text-xs font-bold text-green-700 uppercase">ĐANG CHẠY</span>
                                        </div>
                                        <button className="text-xs font-bold text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">DỪNG</button>
                                    </div>

                                    <h4 className="text-sm font-bold text-gray-900 truncate pr-4" title="Sale Cuối Năm - Giảm 50%">Bài viết: Sale Cuối Năm - Giả...</h4>

                                    <div className="mt-4 flex items-center justify-between text-xs text-gray-600 bg-white/50 p-2 rounded-lg border border-green-100/50">
                                        <div className="flex flex-col items-center gap-1">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <span className="font-mono font-medium">15/50</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-amber-600">~25ph còn lại</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Completed Task */}
                                <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-500 uppercase">HOÀN THÀNH</span>
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-700 line-through truncate opacity-70">Bài viết: Khai Trương Chi Nhán...</h4>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
