"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { cmsService, Service } from "@/services/api";

export default function Marketing() {
    const [navBackground, setNavBackground] = useState("bg-transparent");
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsService.getServices();
                const filtered = res.data.filter((s: Service) => s.category === 'Marketing');
                setServices(filtered);
            } catch (err) {
                console.error("Error fetching services:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        const handleScroll = () => {
            setNavBackground(window.scrollY > 50 ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent");
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
        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-[#dafc69] selection:text-black font-sans antialiased overflow-x-hidden">

            {/* Navigation */}
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-end pb-12 pt-40 px-6 max-w-[95%] mx-auto z-10">
                <div className="absolute top-40 left-6 lowercase text-[#dafc69] font-bold text-lg md:text-xl flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-1000">
                    <span>trang chủ</span>
                    <span className="font-serif italic">/</span>
                    <span className="font-serif italic font-normal">dịch vụ marketing</span>
                </div>

                {/* Dynamic Abstract Image Composition */}
                <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center opacity-70">
                    <div className="relative w-full max-w-6xl h-[60vh]">
                        <div className="absolute top-[10%] left-[10%] w-[30%] aspect-[4/5] rounded-[2rem] transform -rotate-6 shadow-2xl overflow-hidden animate-[float_10s_ease-in-out_infinite]">
                            <img src="/assets/august/our_services_marketi.jpg" alt="Marketing" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute top-[30%] right-[10%] w-[35%] aspect-square rounded-[2.5rem] transform rotate-3 shadow-2xl overflow-hidden animate-[float_12s_ease-in-out_infinite_reverse]">
                            <img src="/assets/august/our_services_events_.jpg" alt="Thành tựu" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Massive Background Text Element acting as floor */}
                <h1 className="text-[17vw] font-black text-white lowercase tracking-tighter leading-[0.8] z-10 select-none relative -bottom-8">
                    marketing
                </h1>
            </section>

            {/* Intro Description */}
            <section className="py-24 px-6 max-w-[95%] mx-auto relative z-20">
                <div className="max-w-4xl ml-auto">
                    <h2 className="text-3xl md:text-5xl font-medium text-white lowercase leading-tight">
                        chúng tôi không chỉ cung cấp giải pháp. chúng tôi thiết kế những chiến dịch bùng nổ, định hình lại quy chuẩn trên facebook.
                    </h2>
                </div>
            </section>

            {/* Asymmetrical Services Grid */}
            <section className="py-32 bg-black px-6">
                <div className="max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-x-12 md:gap-y-32">
                    {isLoading ? (
                        <div className="col-span-12 flex justify-center py-20 text-[#dafc69]">
                            <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : services.length > 0 ? (
                        services.map((service, idx) => {
                            let colClasses = "md:col-span-12 lg:col-span-7";
                            if (idx % 3 === 1) {
                                colClasses = "md:col-span-12 lg:col-span-5 lg:col-start-8";
                            }
                            return (
                                <div key={service.id} className={`${colClasses} bg-[#f3f3f3] text-black rounded-[3rem] p-12 md:p-16 flex flex-col justify-between min-h-[500px] hover:scale-[1.01] transition-transform duration-500 overflow-hidden relative group animate-on-scroll`}>
                                    <div className={`absolute inset-0 ${idx % 3 === 2 ? 'bg-[#dafc69] mix-blend-color-burn opacity-0 group-hover:opacity-10' : 'bg-white opacity-0 group-hover:opacity-50'} transition-opacity duration-500 pointer-events-none`}></div>
                                    <h3 className={`text-5xl md:text-7xl font-black lowercase tracking-tight z-10 ${idx % 3 !== 1 ? 'w-3/4' : ''}`}>{service.title}</h3>
                                    <div className="self-center my-12 z-10">
                                        <Plus className="w-24 h-24 text-black opacity-20 group-hover:rotate-90 group-hover:opacity-100 transition-all duration-700" strokeWidth={1} />
                                    </div>
                                    <p className={`text-xl md:text-2xl font-medium text-gray-700 lowercase leading-relaxed z-10 ${idx % 3 !== 1 ? 'w-3/4' : ''}`}>
                                        {service.description}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="col-span-12 text-center text-white/40 italic lowercase">chưa có dịch vụ nào.</p>
                    )}
                </div>
            </section>

            {/* Transition / Watch Next */}
            <section className="py-48 px-6 max-w-[95%] mx-auto flex flex-col items-center justify-center text-center border-t border-white/10 group cursor-pointer relative z-20">
                <span className="text-[#dafc69] text-3xl font-serif italic mb-8 group-hover:-translate-y-2 transition-transform">(xem tiếp theo)</span>
                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-[10vw] md:text-[12vw] font-black lowercase leading-none tracking-tighter text-white hover:text-[#dafc69] transition-colors">
                        bảng giá
                    </Link>
                    <ArrowUpRight className="w-[8vw] h-[8vw] text-[#dafc69] group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
                </div>
            </section>

            {/* Footer / Final CTA */}
            <footer className="bg-[#111] text-white py-32 md:py-48 relative border-t border-white/10 overflow-hidden">
                {/* Massive Logo Background */}
                <div className="absolute bottom-0 inset-x-0 pointer-events-none">
                    <img src="/assets/august/logo1.svg" alt="" className="w-full opacity-5 scale-125" />
                </div>

                <div className="relative z-10 max-w-[95%] mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-4 mb-20">
                        <span className="text-4xl md:text-5xl font-serif italic text-white opacity-80">idea.</span>
                        <svg width="100" height="40" viewBox="0 0 100 40" fill="none" className="text-[#dafc69] hidden md:block">
                            <path d="M5 35 Q 50 -10 95 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="transparent" />
                            <path d="M85 30 L 95 35 L 90 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="transparent" />
                        </svg>
                    </div>

                    <h2 className="text-6xl md:text-[6rem] lg:text-[8rem] font-black lowercase tracking-tighter mb-16 mix-blend-difference hover:text-[#dafc69] transition-colors duration-500 cursor-pointer">
                        hello@vizsolution.com
                    </h2>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-2xl font-bold lowercase">
                        <span className="hover:text-[#dafc69] cursor-pointer transition-colors">instagram <ArrowUpRight className="inline w-6 h-6" /></span>
                        <span className="hover:text-[#dafc69] cursor-pointer transition-colors">whatsapp <ArrowUpRight className="inline w-6 h-6" /></span>
                    </div>

                    <div className="mt-40 opacity-40 font-medium lowercase flex flex-col items-center gap-4 text-lg">
                        <p>tổng đài hỗ trợ: 1900 xxxx</p>
                        <p>august © 2026. architecture by viz solution.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
