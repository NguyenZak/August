import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Section, SectionRenderer } from '@/components/builder/SectionRenderer'

interface BrandPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function BrandLandingPage({ params }: BrandPageProps) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch brand data from Supabase
    const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('subdomain', slug)
        .single()

    if (error || !brand) {
        return notFound()
    }

    if (brand.html_content) {
        const isFullPage = brand.html_content.toLowerCase().includes('<html') || 
                          brand.html_content.toLowerCase().includes('<!doctype');

        if (isFullPage) {
            return (
                <iframe 
                    srcDoc={brand.html_content} 
                    className="fixed inset-0 w-full h-full border-none z-[9999]"
                    title={brand.name}
                />
            )
        }

        return (
            <div 
                className="min-h-screen bg-white"
                dangerouslySetInnerHTML={{ __html: brand.html_content }}
            />
        )
    }

    const sections = (brand.sections || []) as Section[]

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden" style={{ '--primary-color': brand.primary_color } as any}>
            {/* Premium Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {brand.logo_url && (
                            <div className="relative w-10 h-10">
                                <Image
                                    src={brand.logo_url}
                                    alt={brand.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <span className="text-xl font-bold tracking-tighter">{brand.name}.</span>
                    </div>
                    <button className="bg-black text-white px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#dafc69] hover:text-black transition-all shadow-xl">
                        Liên hệ ngay
                    </button>
                </div>
            </nav>

            <div className="pt-20">
                {/* Hero Section (Fallback if no sections) */}
                {sections.length === 0 ? (
                    <header className="max-w-7xl mx-auto px-8 py-32 text-center">
                        <span className="inline-block px-4 py-1.5 bg-[#dafc69] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
                            welcome to our brand
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-[0.9]">
                            {brand.name}.
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium italic">
                            Chưa có nội dung thiết kế. Vui lòng quay lại sau.
                        </p>
                    </header>
                ) : (
                    <div className="sections-container">
                        {sections.map((section) => (
                            <SectionRenderer key={section.id} section={section} />
                        ))}
                    </div>
                )}
            </div>

            {/* Premium Footer */}
            <footer className="py-20 bg-gray-50 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-black rounded-lg"></div>
                        <span className="text-lg font-bold tracking-tighter">{brand.name}.</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
                        &copy; {new Date().getFullYear()} {brand.name}. Powered by August.
                    </p>
                    <div className="flex gap-8">
                        {['instagram', 'facebook', 'twitter'].map(social => (
                            <a key={social} href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">{social}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
