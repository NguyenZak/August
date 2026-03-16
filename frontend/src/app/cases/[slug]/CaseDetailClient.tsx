"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, User, Tag, FileText, Image as ImageIcon, ArrowLeft } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { motion, AnimatePresence } from "framer-motion";
import Flipbook from "@/components/common/Flipbook";
import { cmsService, Case } from "@/services/api";

export default function CaseDetailClient() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Case | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [nextProject, setNextProject] = useState<Case | null>(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!params.slug) return;
            setIsLoading(true);
            try {
                const response = await cmsService.getCaseBySlug(params.slug as string);
                setProject(response.data);

                // Fetch all cases to find the next one
                const allCasesRes = await cmsService.getCases();
                const currentIndex = allCasesRes.data.findIndex(c => c.slug === params.slug);
                if (currentIndex !== -1 && currentIndex < allCasesRes.data.length - 1) {
                    setNextProject(allCasesRes.data[currentIndex + 1]);
                } else if (allCasesRes.data.length > 0 && allCasesRes.data[0].slug !== params.slug) {
                    setNextProject(allCasesRes.data[0]);
                }
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
                <div className="w-12 h-12 border-4 border-[#dafc69] border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-500 font-medium lowercase italic">đang tải dữ liệu dự án...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-black lowercase tracking-tighter">dự án không tồn tại</h1>
                <Link href="/cases" className="text-[#dafc69] font-bold border-b border-[#dafc69]">quay lại danh sách</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#dafc69] selection:text-black font-sans antialiased overflow-x-hidden">
            <PublicNavbar />

            {/* Hero Image Section */}
            <section className="relative h-[70vh] md:h-[90vh] overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="absolute bottom-10 left-0 w-full px-6 md:px-20">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-7xl mx-auto"
                    >
                        <Link href="/#cases" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest">tất cả dự án</span>
                        </Link>
                        <h1 className="text-[12vw] md:text-[8vw] font-black lowercase leading-none tracking-tighter">
                            {project.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 md:py-40 px-6 max-w-[95%] mx-auto">
                <div className="grid grid-cols-12 gap-10 md:gap-20">
                    {/* Meta Info */}
                    <div className="col-span-12 md:col-span-4 space-y-12">
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#dafc69]">hạng mục</p>
                                <p className="text-2xl font-bold lowercase tracking-tight flex items-center gap-3">
                                    <Tag className="w-5 h-5 text-gray-500" /> {project.category}
                                </p>
                            </div>
                            {project.industry && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#dafc69]">lĩnh vực</p>
                                    <p className="text-2xl font-bold lowercase tracking-tight flex items-center gap-3">
                                        <ImageIcon className="w-5 h-5 text-gray-500" /> {project.industry}
                                    </p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#dafc69]">năm thực hiện</p>
                                <p className="text-2xl font-bold lowercase tracking-tight flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-500" /> {new Date(project.created_at).getFullYear()}
                                </p>
                            </div>
                        </div>

                        {project.industry === "F&B" && project.menu_url && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 bg-[#dafc69] text-black rounded-[2.5rem] space-y-4 shadow-xl shadow-[#dafc69]/10"
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> tài liệu dự án
                                </p>
                                <h4 className="text-3xl font-black lowercase tracking-tighter leading-none">xem thực đơn<br />(digital menu)</h4>
                                <Link
                                    href={`/cases/${project.slug}/menu`}
                                    className="inline-flex items-center gap-2 font-black border-b-2 border-black hover:gap-4 transition-all"
                                >
                                    mở tài liệu <ArrowUpRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    {/* Main Description */}
                    <div className="col-span-12 md:col-span-8 space-y-20">
                        <div className="prose prose-invert prose-2xl max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-headings:lowercase prose-strong:text-[#dafc69] prose-img:rounded-[2rem] prose-a:text-[#dafc69]">
                            {project.content ? (
                                <div dangerouslySetInnerHTML={{ __html: project.content }} />
                            ) : (
                                <p className="text-2xl md:text-4xl font-medium leading-[1.2] text-gray-300 italic opacity-40">
                                    Nội dung dự án đang được cập nhật...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Next Project CTA */}
            {nextProject && (
                <section className="py-40 bg-[#dafc69] text-black rounded-t-[4rem]">
                    <div className="max-w-[95%] mx-auto px-6 text-center">
                        <p className="text-xl font-serif italic mb-10 opacity-60">tiếp theo.</p>
                        <Link href={`/cases/${nextProject.slug}`} className="group inline-block">
                            <h2 className="text-6xl md:text-[10vw] font-black lowercase leading-none tracking-tighter group-hover:scale-105 transition-transform duration-700">
                                {nextProject.title}
                            </h2>
                            <div className="mt-10 flex items-center justify-center gap-4">
                                <span className="text-2xl font-black uppercase tracking-tight border-b-2 border-black">xem dự án này</span>
                                <ArrowUpRight className="w-10 h-10" />
                            </div>
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}
