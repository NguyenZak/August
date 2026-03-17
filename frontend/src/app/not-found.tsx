'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#dafc69]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Animated 404 Text */}
        <h1 className="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none">
          404
        </h1>
        
        <div className="mt-[-2rem] space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black lowercase tracking-tight">không tìm thấy trang</h2>
            <p className="text-gray-500 text-sm font-medium">
              Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đã được chuyển sang một địa chỉ khác.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/"
              className="flex items-center gap-2 px-8 py-3 bg-[#dafc69] text-black rounded-full text-xs font-black lowercase transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(218,252,105,0.2)]"
            >
              <Home size={16} />
              <span>về trang chủ</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-8 py-3 bg-white/5 text-white rounded-full text-xs font-black lowercase border border-white/10 transition-all hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              <span>quay lại</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
            &copy; {new Date().getFullYear()} ViZ Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
