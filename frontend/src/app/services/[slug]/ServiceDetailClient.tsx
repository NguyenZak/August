"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { motion } from "framer-motion";
import { cmsService, Service } from "@/services/api";

export default function ServiceDetailClient() {
    const params = useParams();
    const router = useRouter();
    const [service, setService] = useState<Service | null>(null);
    const [relatedServices, setRelatedServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!params.slug) return;
            setIsLoading(true);
            try {
                const res = await cmsService.getServiceBySlug(params.slug as string);
                setService(res.data);

                // Fetch related services
                const allRes = await cmsService.getServices();
                const filtered = allRes.data.filter(s => s.slug !== params.slug).slice(0, 3);
                setRelatedServices(filtered);
            } catch (err) {
                console.error("Error fetching service:", err);
                
                // Fallback sample data if slug matches common ones
                const sampleSlug = params.slug as string;
                if (sampleSlug === "entertainment-parties") {
                    setService({
                        id: 'sample-p1',
                        title: 'entertainment parties',
                        slug: 'entertainment-parties',
                        category: 'Events',
                        description: 'High-energy, immersive parties that bring your brand to life!',
                        content: '<p>From VIP after-parties to themed galas, we make sure your event is memorable, stylish, and engaging for every guest.</p>',
                        icon: 'PartyPopper'
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#dafc69] border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-500 font-medium lowercase italic">đang tải dịch vụ...</p>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-black lowercase tracking-tighter">không tìm thấy dịch vụ</h1>
                <Link href="/" className="text-[#dafc69] font-bold border-b border-[#dafc69]">về trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#dafc69] selection:text-black font-sans antialiased overflow-x-hidden">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 md:pt-60 md:pb-40 px-6 max-w-[95%] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="max-w-4xl">
                        <Link href={service.category === 'Events' ? "/events" : "/marketing"} className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest">{service.category} services</span>
                        </Link>
                        <h1 className="text-[10vw] md:text-[8vw] font-black lowercase leading-[0.8] tracking-tighter mb-10">
                            {service.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Description & Features Section */}
            <section className="py-20 px-6 max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20">
                <div className="md:col-span-12">
                    <div className="prose prose-invert prose-2xl max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-headings:lowercase prose-strong:text-[#dafc69]">
                        {service.content ? (
                            <div dangerouslySetInnerHTML={{ __html: service.content }} />
                        ) : (
                            <p className="text-2xl md:text-4xl font-medium leading-[1.2] text-gray-300 italic opacity-40">
                                {service.description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Services / "Blocks" Section */}
            <section className="py-32 px-6 max-w-[95%] mx-auto border-t border-white/10">
                <div className="mb-20">
                    <p className="text-2xl font-serif italic opacity-60 mb-4">dịch vụ liên quan.</p>
                    <h2 className="text-5xl md:text-7xl font-black lowercase tracking-tighter">more service <span className="text-[#dafc69]">expertise</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(relatedServices.length > 0 ? relatedServices : [
                        { id: 'r-sample-1', title: 'facebook seeding', description: 'Reach thousands of potential customers with our automated and manual seeding strategies.', image_url: '/assets/august/our_services_marketi.jpg', category: 'Marketing', slug: 'facebook-seeding' },
                        { id: 'r-sample-2', title: 'grand opening', description: 'Make a lasting impression with a spectacular launch event for your new location.', image_url: '/assets/august/photo.jpg', category: 'Events', slug: 'grand-opening' },
                        { id: 'r-sample-3', title: 'viral marketing', description: 'Create content that people can\'t help but share across social media platforms.', image_url: '/assets/august/about_right.jpg', category: 'Marketing', slug: 'viral-marketing' }
                    ] as any[]).map((rs) => (
                        <Link 
                            key={rs.id} 
                            href={`/services/${rs.slug}`}
                            className="bg-white text-black p-8 md:p-10 aspect-[3/4] rounded-[2rem] border border-black/10 flex flex-col justify-between overflow-hidden relative group"
                        >
                            {/* Background Image Reveal on Hover */}
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                <img 
                                    src={rs.image_url || "/assets/august/our_services_marketi.jpg"} 
                                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
                                    alt={rs.title} 
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                            </div>

                            {/* Content Container */}
                            <div className="relative z-10 h-full flex flex-col justify-between group-hover:text-white transition-colors duration-500">
                                <div>
                                    <h3 className="text-4xl md:text-5xl font-bold lowercase tracking-tighter leading-[0.9] max-w-[80%]">
                                        {(rs.title as string).split(' ').map((word: string, i: number) => (
                                            <span key={i} className="block">{word}</span>
                                        ))}
                                    </h3>
                                </div>

                                <div className="flex justify-center items-center">
                                    <Plus className="w-20 h-20 text-black group-hover:text-white group-hover:rotate-90 transition-all duration-500" strokeWidth={0.5} />
                                </div>

                                <div className="max-w-[90%]">
                                    <p className="text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                        {rs.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
