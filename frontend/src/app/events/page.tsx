"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { cmsService, Service } from "@/services/api";

export default function EventsPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsService.getServices();
                const filtered = res.data.filter((s: Service) => s.category === 'Events');
                setServices(filtered);
            } catch (err) {
                console.error("Error fetching services:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
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
        <div className="min-h-screen bg-black text-white selection:bg-[#dafc69] selection:text-black font-sans antialiased overflow-x-hidden">

            {/* Header / Nav */}
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-40 md:pt-60 pb-20 overflow-hidden">
                {/* Large Background Text */}
                <div className="absolute top-[20%] left-0 w-full pointer-events-none z-0">
                    <h1 className="text-[35vw] font-black text-white/[0.05] leading-none select-none tracking-tighter">
                        sự kiện
                    </h1>
                </div>

                <div className="max-w-[95%] mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-xl md:text-2xl font-serif italic mb-12 animate-on-scroll">
                            <span className="opacity-40">trang chủ / </span>
                            <span className="text-[#dafc69]">dịch vụ sự kiện</span>
                        </p>

                        <div className="relative w-full max-w-6xl mx-auto grid grid-cols-12 gap-4 items-center">
                            {/* Scattered Images */}
                            <div className="col-span-4 md:col-span-3 -rotate-6 animate-on-scroll">
                                <img src="/assets/august/about_right.jpg" className="w-full aspect-[3/4] object-cover rounded-[2rem] grayscale" />
                            </div>
                            <div className="col-span-8 md:col-span-6 z-10 animate-on-scroll delay-100">
                                <img src="/assets/august/about_center_1.jpg" className="w-full aspect-square md:aspect-[4/5] object-cover rounded-[3rem]" />
                            </div>
                            <div className="col-span-4 md:col-span-3 rotate-12 mt-20 animate-on-scroll delay-200">
                                <img src="/assets/august/photo.jpg" className="w-full aspect-[3/4] object-cover rounded-[2rem] grayscale" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 md:py-40 bg-black">
                <div className="max-w-[95%] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {isLoading ? (
                            <div className="col-span-full flex justify-center py-20 text-[#dafc69]">
                                <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (services.length > 0 ? services : [
                            { id: 'sample-e1', title: 'entertainment parties', description: 'Experience the most immersive brand parties with custom themes and VIP treatment.', image_url: '/assets/august/about_center_1.jpg' },
                            { id: 'sample-e2', title: 'grand opening', description: 'Make a lasting impression with a spectacular launch event for your new location.', image_url: '/assets/august/photo.jpg' },
                            { id: 'sample-e3', title: 'corporate gala', description: 'Elegant and professional galas tailored to celebrate your company\'s milestones.', image_url: '/assets/august/about_right.jpg' }
                        ] as any[]).map((service, idx) => (
                            <Link 
                                key={service.id} 
                                href={service.slug ? `/services/${service.slug}` : '#'}
                                className="bg-white text-black p-8 md:p-10 aspect-[3/4] rounded-[2rem] border border-black/10 flex flex-col justify-between overflow-hidden relative group animate-on-scroll"
                            >
                                {/* Background Image Reveal on Hover */}
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                    <img 
                                        src={service.image_url || "/assets/august/our_services_events_.jpg"} 
                                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
                                        alt={service.title} 
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10 h-full flex flex-col justify-between group-hover:text-white transition-colors duration-500">
                                    <div>
                                        <h3 className="text-4xl md:text-5xl font-bold lowercase tracking-tighter leading-[0.9] max-w-[80%]">
                                            {(service.title as string).split(' ').map((word, i) => (
                                                <span key={i} className="block">{word}</span>
                                            ))}
                                        </h3>
                                    </div>

                                    <div className="flex justify-center items-center">
                                        <Plus className="w-20 h-20 text-black group-hover:text-white group-hover:rotate-90 transition-all duration-500" strokeWidth={0.5} />
                                    </div>

                                    <div className="max-w-[90%]">
                                        <p className="text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Next Section Transition */}
            <section className="py-40 bg-[#111111] border-t border-white/5">
                <div className="max-w-[95%] mx-auto px-6 text-center">
                    <p className="text-[#dafc69] text-2xl font-serif italic mb-12 opacity-60">tiếp theo.</p>
                    <Link href="/marketing" className="group block">
                        <h2 className="text-[10vw] font-black lowercase leading-none tracking-tighter transition-all group-hover:italic group-hover:text-[#dafc69]">
                            dịch vụ marketing
                        </h2>
                        <div className="mt-12 flex justify-center">
                            <div className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#dafc69] transition-all">
                                <ArrowUpRight className="w-10 h-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-24 border-t border-white/5">
                <div className="max-w-[95%] mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-40 lowercase text-sm">
                    <p>© 2026 August Events.</p>
                    <p>Kích hoạt / Lan tỏa</p>
                </div>
            </footer>
        </div>
    );
}
