"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useContact } from "@/context/ContactContext";
import { cmsService } from "@/services/api";

/* Tailwind Safelist for dynamic grids:
md:col-start-1 md:col-start-2 md:col-start-3 md:col-start-4 md:col-start-5 md:col-start-6 md:col-start-7 md:col-start-8 md:col-start-9 md:col-start-10 md:col-start-11 md:col-start-12
md:col-span-1 md:col-span-2 md:col-span-3 md:col-span-4 md:col-span-5 md:col-span-6 md:col-span-7 md:col-span-8 md:col-span-9 md:col-span-10 md:col-span-11 md:col-span-12
md:col-end-1 md:col-end-2 md:col-end-3 md:col-end-4 md:col-end-5 md:col-end-6 md:col-end-7 md:col-end-8 md:col-end-9 md:col-end-10 md:col-end-11 md:col-end-12 md:col-end-13
*/

export default function CasesPage() {
    const { openContact } = useContact();
    const [allCases, setAllCases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await cmsService.getCases();
                const sortedCases = res.data.sort((a: any, b: any) => (a.grid_row || 0) - (b.grid_row || 0));
                const mappedCases = sortedCases.map((c: any) => ({
                    id: c.id,
                    slug: c.slug,
                    title: c.title,
                    desc: c.category,
                    img: c.image_url,
                    className: `col-span-12 md:col-start-${c.grid_col || 1} md:col-end-${(c.grid_col || 1) + (c.grid_col_span || 12)}`
                }));
                setAllCases(mappedCases);
            } catch (err) {
                console.error("Error fetching cases:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCases();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [isLoading, allCases]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#dafc69] selection:text-black font-sans antialiased overflow-x-hidden">
            <PublicNavbar />

            <section className="pt-40 md:pt-60 pb-20 px-6 max-w-[95%] mx-auto">
                <div className="animate-on-scroll">
                    <p className="text-[#dafc69] text-2xl font-serif italic mb-6">kho lưu trữ.</p>
                    <h1 className="text-[12vw] md:text-[8vw] font-black lowercase leading-none tracking-tighter mb-24">
                        dự án đã<br />thực hiện
                    </h1>
                </div>

                <div className="grid grid-cols-12 gap-y-32 md:gap-y-64 gap-x-8">
                    {isLoading ? (
                        <div className="col-span-12 flex justify-center py-20 text-[#dafc69]">
                            <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : allCases.length > 0 ? (
                        allCases.map((c) => (
                            <Link key={c.id} href={`/cases/${c.slug}`} className={`${c.className} group cursor-pointer animate-on-scroll`}>
                                <div className="aspect-[1.46] overflow-hidden rounded-[2.5rem] bg-zinc-900 mb-8">
                                    <img
                                        src={c.img || "/assets/placeholder-image.png"}
                                        alt={c.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black lowercase tracking-tighter group-hover:text-[#dafc69] transition-colors leading-tight">
                                    {c.title}
                                </h3>
                                <p className="text-xl text-gray-500 mt-2 lowercase font-medium tracking-tight">
                                    {c.desc}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <p className="col-span-12 text-center text-gray-500 py-20 font-medium lowercase italic opacity-40">Chưa có dự án nào.</p>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-48 px-6 bg-[#dafc69] text-black rounded-t-[3rem] mt-32 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-12 animate-on-scroll">
                    <h2 className="text-5xl md:text-8xl font-black lowercase tracking-tighter leading-none">
                        bạn có dự án mới cần hiện thực hóa?
                    </h2>
                    <button
                        onClick={openContact}
                        className="px-12 py-5 rounded-full bg-black text-white font-black text-2xl lowercase hover:scale-105 transition-transform"
                    >
                        bắt đầu ngay
                    </button>
                </div>
            </section>
        </div>
    );
}
