"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";

export default function About() {
    const [navBackground, setNavBackground] = useState("bg-transparent");
    const timelineRef = useRef<HTMLDivElement>(null);
    const [timelineProgress, setTimelineProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Navbar blur effect
            setNavBackground(window.scrollY > 50 ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent");

            // Timeline progress logic
            if (timelineRef.current) {
                const rect = timelineRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Calculate how far the section has scrolled relative to the middle of the viewport
                const scrollPosition = windowHeight / 2 - rect.top;
                const totalHeight = rect.height;

                // Clamp progress between 0 and 1
                let progress = scrollPosition / totalHeight;
                progress = Math.max(0, Math.min(1, progress));
                setTimelineProgress(progress);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Trigger once on mount
        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    const processSteps = [
        { num: "01", label: "analysis.", title: "phân tích fanpage", desc: "Đánh giá toàn diện sức khỏe hiện tại của các trang vệ tinh, định vị lại tệp khán giả mục tiêu và phân tích đối thủ cạnh tranh để tìm ra ngách nội dung." },
        { num: "02", label: "concept.", title: "xây dựng kịch bản", desc: "Lên dàn bài nội dung dài hạn, kịch bản seeding tự nhiên, kịch bản chatbot phản hồi tự động bám sát chân dung khách hàng." },
        { num: "03", label: "automation.", title: "lên lịch tự động", desc: "Setting hệ thống publish đa kênh, cài đặt thời gian vàng để bài đăng đạt organic reach cao nhất trước khi bơm tương tác." },
        { num: "04", label: "interaction.", title: "quản lý tương tác", desc: "Kích hoạt mô hình seeding tự động mô phỏng người dùng thật. Phân luồng inbox/comment về hệ thống quản lý tập trung." },
        { num: "05", label: "reporting.", title: "báo cáo & tối ưu", desc: "Theo dõi báo cáo real-time về chi phí, leads và độ chuyển đổi. Đưa ra các mốc A/B testing để liên tục tinh chỉnh campaign." }
    ];

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-[#dafc69] selection:text-black font-sans antialiased overflow-x-hidden">

            {/* Navigation */}
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex flex-col justify-end pb-32 pt-40 px-6 max-w-[95%] mx-auto z-10">
                <div className="mb-12 lowercase text-[#dafc69] font-bold text-lg md:text-xl flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-1000">
                    <span>trang chủ</span>
                    <span>/</span>
                    <span>về chúng tôi</span>
                </div>

                {/* Massive Background Text Element */}
                <h1 className="absolute top-[30%] -left-[10%] text-[20vw] font-black text-white/[0.03] select-none tracking-tighter lowercase leading-[0.8] z-0 whitespace-nowrap pointer-events-none">
                    về chúng tôi
                </h1>

                {/* Floating Imagery from Source */}
                <div className="absolute top-[10%] right-[5%] w-[25%] aspect-[3/4] rounded-[2rem] transform rotate-6 shadow-2xl overflow-hidden opacity-40 animate-[float_15s_ease-in-out_infinite_reverse] pointer-events-none hidden md:block">
                    <img src="/assets/august/about_right.jpg" alt="Về chúng tôi" className="w-full h-full object-cover grayscale mix-blend-screen" />
                </div>

                <div className="relative z-10 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-forwards opacity-0">
                    <h2 className="text-4xl md:text-7xl lg:text-8xl font-black lowercase leading-tight tracking-tight">
                        chúng tôi là một tổ hợp sáng tạo công nghệ.
                    </h2>
                    <p className="mt-12 text-2xl md:text-4xl text-gray-400 font-medium lowercase max-w-3xl leading-relaxed">
                        với sứ mệnh tối ưu hóa mọi luồng cảm hứng, giải phóng thời gian cho những ý tưởng táo bạo nhất trên nền tảng mạng xã hội.
                    </p>
                </div>
            </section>

            {/* S-Curve Process Timeline */}
            <section className="relative py-32 md:py-48 px-6 max-w-[95%] mx-auto border-t border-white/10 mt-20">
                <div className="text-center mb-32 relative z-10">
                    <p className="text-4xl md:text-5xl font-serif italic text-[#dafc69]">quy trình.</p>
                </div>

                <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
                    {/* Faded Background Line */}
                    <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/10"></div>

                    {/* Active Progress Line */}
                    <div
                        className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 w-[2px] bg-[#dafc69] shadow-[0_0_15px_rgba(209,255,0,0.5)] transition-all duration-300 ease-out"
                        style={{ height: `${timelineProgress * 100}%` }}
                    ></div>

                    <div className="space-y-32">
                        {processSteps.map((step, idx) => {
                            // Calculate threshold for when this step becomes "active"
                            const progressThreshold = idx / (processSteps.length - 1);
                            // Activate step slightly before the line reaches it perfectly
                            const isActive = timelineProgress >= (progressThreshold - 0.05);

                            return (
                                <div key={idx} className={`relative flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} group`}>

                                    {/* Node Point */}
                                    <div className={`absolute left-[13px] md:left-1/2 md:-ml-[8px] top-6 w-4 h-4 rounded-full border-2 border-[#dafc69] z-10 transition-all duration-500 shadow-[0_0_15px_rgba(209,255,0,0.5)] ${isActive ? 'scale-150 bg-[#dafc69]' : 'bg-black scale-100 group-hover:scale-125'}`}></div>

                                    {/* Content Block */}
                                    <div className={`ml-16 md:ml-0 md:w-5/12 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-40 blur-[1px]'}`}>
                                        <div className={`flex items-end gap-4 mb-6 ${idx % 2 === 0 ? 'md:justify-end md:flex-row-reverse' : 'justify-start'}`}>
                                            <span className="text-[#dafc69] text-3xl font-serif italic lowercase">{step.label}</span>
                                            <span className="text-gray-600 text-6xl font-black">{step.num}</span>
                                        </div>
                                        <h3 className={`text-4xl font-black lowercase mb-6 tracking-tight transition-colors duration-500 ${isActive ? 'text-[#dafc69]' : 'text-white'}`}>{step.title}</h3>
                                        <p className={`text-xl font-medium leading-relaxed lowercase transition-colors duration-500 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer / Final CTA */}
            <footer className="bg-black text-white py-32 md:py-48 relative border-t border-white/10 mt-20 overflow-hidden">
                {/* Massive Logo Background */}
                <div className="absolute bottom-0 inset-x-0 pointer-events-none overflow-hidden">
                    <img src="/assets/august/logo1.svg" alt="" className="w-full opacity-5 scale-125" />
                </div>

                <div className="relative z-10 max-w-[95%] mx-auto px-6 text-center">
                    <p className="text-4xl md:text-5xl font-serif italic text-white mb-20 opacity-80">liên hệ.</p>

                    <h2 className="text-6xl md:text-[6rem] lg:text-[8rem] font-black lowercase tracking-tighter mb-16 mix-blend-difference hover:text-[#dafc69] transition-colors duration-500 cursor-pointer">
                        hello@vizsolution.com
                    </h2>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-2xl font-bold lowercase">
                        <span className="hover:text-[#dafc69] cursor-pointer transition-colors">instagram <ArrowUpRight className="inline w-6 h-6" /></span>
                        <span className="hover:text-[#dafc69] cursor-pointer transition-colors">whatsapp <ArrowUpRight className="inline w-6 h-6" /></span>
                        <span className="hover:text-[#dafc69] cursor-pointer transition-colors">telegram <ArrowUpRight className="inline w-6 h-6" /></span>
                    </div>

                    <div className="mt-40 opacity-40 font-medium lowercase flex flex-col items-center gap-4 text-lg">
                        <p>tổng đài hỗ trợ: 1900 xxxx</p>
                        <p>august © 2026. hệ thống bởi viz solution.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
