"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import { cmsService, Case } from "@/services/api";

export default function ProjectMenuPage() {
    const params = useParams();
    const [project, setProject] = useState<Case | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!params.slug) return;
            setIsLoading(true);
            try {
                const response = await cmsService.getCaseBySlug(params.slug as string);
                setProject(response.data);
            } catch (err) {
                console.error("Error fetching project:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjectData();
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#dafc69]" />
                <p className="mt-4 text-gray-500 font-medium lowercase italic">đang tải thực đơn...</p>
            </div>
        );
    }

    if (!project || !project.menu_url) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-black lowercase tracking-tighter">không tìm thấy thực đơn</h1>
                <Link href={`/cases/${params.slug}`} className="text-[#dafc69] font-bold border-b border-[#dafc69]">quay lại dự án</Link>
            </div>
        );
    }

    const images = project.menu_url.split(',');

    return (
        <main className="min-h-screen bg-[#111] text-white">
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
                <h1 className="text-lg md:text-2xl font-black uppercase tracking-widest text-[#dafc69]">{project.title} - Menu</h1>
                <button
                    onClick={() => window.location.href = `/cases/${params.slug}`}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-all group"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform" />
                </button>
            </div>
            <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto hidden-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative w-full bg-black/50 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                            <img src={img} alt={`Menu Page ${idx + 1}`} className="w-full h-auto object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
