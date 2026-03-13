"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import Flipbook from "@/components/common/Flipbook";
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
        <main className="min-h-screen bg-black text-white">
            <Flipbook
                images={images}
                onClose={() => window.location.href = `/cases/${params.slug}`}
            />
        </main>
    );
}
