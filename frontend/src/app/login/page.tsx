"use client";

import { useState } from "react";
import { LogIn, Lock, Mail, AlertCircle, ArrowUpRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cmsService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await cmsService.login({ email, password });
            const { token, user: backendUser } = response.data;

            // Map backend user to UI role
            // In a real app, role would come from DB. For now, assume ADMIN for successful login.
            login(backendUser.email, "ADMIN", token);
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-[#dafc69] selection:text-black font-sans antialiased overflow-hidden flex items-center justify-center p-6 relative">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] -left-[10%] text-[30vw] font-black text-white/[0.03] select-none tracking-tighter lowercase leading-[0.8] whitespace-nowrap">
                    august
                </div>
            </div>

            <div className="max-w-md w-full relative z-10">

                {/* Logo & Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-block transition-opacity hover:opacity-70 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#dafc69] rounded-xl flex items-center justify-center">
                                <span className="text-black font-black text-xl">A</span>
                            </div>
                            <span className="text-3xl font-black lowercase tracking-tighter">august</span>
                        </div>
                    </Link>
                    <p className="text-gray-400 font-medium lowercase tracking-tight">Hệ thống Quản lý & Tự động hóa Marketing</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#111111] rounded-[2.5rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#dafc69]/5 blur-3xl rounded-full"></div>
                    <h2 className="text-3xl font-black lowercase mb-10 tracking-tighter relative">đăng nhập.</h2>

                    {error && (
                        <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-xs font-bold uppercase tracking-tight leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8 relative">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">tài khoản email.</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-600" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#dafc69] focus:border-[#dafc69] transition-all placeholder:text-gray-700 text-sm font-medium text-white outline-none"
                                    placeholder="ten@viz.vn"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3 ml-1">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">mật khẩu.</label>
                                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-[#dafc69] hover:opacity-70 transition-opacity">quên mật khẩu?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-600" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#dafc69] focus:border-[#dafc69] transition-all placeholder:text-gray-700 text-sm font-medium text-white outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#dafc69] hover:bg-white text-black font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed text-lg lowercase tracking-tighter"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        vào hệ thống <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Hint for tester */}
                    <div className="mt-10 p-4 bg-[#dafc69]/5 rounded-2xl border border-[#dafc69]/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-3.5 h-3.5 text-[#dafc69]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#dafc69]">Thông tin demo (pass: 123456)</span>
                        </div>
                        <ul className="text-[10px] font-bold text-gray-500 space-y-1 uppercase tracking-tight">
                            <li>• user@viz.vn: Truy cập Dashboard</li>
                            <li>• admin@viz.vn: Truy cập Agency CMS</li>
                            <li>• super@viz.vn: Toàn quyền truy cập</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-500 font-medium lowercase">
                        bạn chưa được cấp tài khoản? <a href="#" className="text-white hover:text-[#dafc69] font-bold transition-colors">liên hệ quản trị viên</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
