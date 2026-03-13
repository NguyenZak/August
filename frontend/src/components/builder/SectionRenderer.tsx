import React from 'react';

export type SectionType = 'hero' | 'features' | 'testimonials' | 'faq' | 'contact' | 'html'

export interface Section {
    id: string
    type: SectionType
    content: any
}

function Decoration() {
    return (
        <div className="absolute top-0 right-0 -z-10 opacity-20 pointer-events-none">
            <div className="w-[500px] h-[500px] bg-gradient-to-br from-[#dafc69] to-transparent rounded-full blur-3xl -mr-64 -mt-64"></div>
        </div>
    )
}

export function HTMLBlock({ content }: { content: any }) {
    if (!content?.html) return <div className="p-20 text-center text-gray-400 italic font-mono text-xs border border-dashed rounded-3xl">{'< dán mã html của bạn vào đây >'}</div>
    return (
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
    )
}

export function HeroBlock({ content }: { content: any }) {
    return (
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-12 py-24 text-center overflow-hidden">
            <Decoration />
            <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-7xl font-bold tracking-tighter leading-[0.9] mb-12">
                    {content?.title || 'Khám phá sự sang trọng.'}
                </h1>
                <p className="text-xl font-medium text-gray-500 max-w-2xl mx-auto mb-16 leading-relaxed">
                    {content?.subtitle || 'Giải pháp hoàn hảo cho thương hiệu của bạn. Tối ưu hóa quy trình và nâng tầm trải nghiệm.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="px-12 py-6 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-2xl">bắt đầu ngay</button>
                    <button className="px-12 py-6 bg-white border border-gray-100 text-xs font-black uppercase tracking-widest rounded-full hover:bg-gray-50 transition-colors shadow-sm">tìm hiểu thêm</button>
                </div>
            </div>
        </section>
    )
}

export function FeaturesBlock({ content }: { content: any }) {
    const defaultFeatures = [
        { title: 'thiết kế hiện đại', desc: 'giao diện sang trọng, bắt kịp xu hướng' },
        { title: 'tối ưu hóa', desc: 'tốc độ tải trang nhanh, trải nghiệm mượt mà' },
        { title: 'linh hoạt', desc: 'dễ dàng tùy chỉnh theo nhu cầu' }
    ]
    const features = content?.features || defaultFeatures

    return (
        <section className="px-12 py-32 bg-gray-50/50 rounded-[4rem] mx-4 mb-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-24 text-left">
                    <h2 className="text-5xl font-bold tracking-tighter mb-6">{content?.title || 'Tính năng vượt trội.'}</h2>
                    <p className="text-gray-500 font-medium max-w-xl">{content?.subtitle || 'Chúng tôi cung cấp các công cụ mạnh mẽ nhất để bạn phát triển.'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f: any, i: number) => (
                        <div key={i} className="group p-10 bg-white border border-gray-100 rounded-[3rem] hover:ring-4 hover:ring-[#dafc69]/20 transition-all hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl mb-8 flex items-center justify-center group-hover:bg-[#dafc69] transition-colors">
                                <div className="w-6 h-6 bg-black/10 rounded-full"></div>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-4">{f.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function TestimonialsBlock({ content }: { content: any }) {
    const testimonials = content?.testimonials || [
        { name: 'Anh Tuấn', role: 'CEO Startup', content: 'Quy trình làm việc cực kỳ chuyên nghiệp và hiệu quả.' },
        { name: 'Chị Lan', role: 'Designer', content: 'Giao diện tuyệt đẹp, dễ dàng sử dụng và tùy chỉnh.' }
    ]

    return (
        <section className="px-12 py-32">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold tracking-tighter mb-20">Khách hàng nói gì.</h2>
                <div className="space-y-12">
                    {testimonials.map((t: any, i: number) => (
                        <div key={i} className="p-12 border border-gray-100 rounded-[4rem] text-left hover:bg-gray-50 transition-colors">
                            <p className="text-2xl font-medium tracking-tight italic mb-8">"{t.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#dafc69] rounded-2xl"></div>
                                <div>
                                    <h4 className="font-bold tracking-tight">{t.name}</h4>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function FAQBlock({ content }: { content: any }) {
    const faqs = content?.faqs || [
        { q: 'Làm thế nào để bắt đầu?', a: 'Bạn chỉ cần đăng ký tài khoản và chọn mẫu thiết kế.' },
        { q: 'Có hỗ trợ 24/7 không?', a: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.' }
    ]

    return (
        <section className="px-12 py-32 bg-black text-white rounded-[4rem] mx-4 mb-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold tracking-tighter mb-20 text-center">Câu hỏi thường gặp.</h2>
                <div className="space-y-6">
                    {faqs.map((f: any, i: number) => (
                        <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                            <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center justify-between">
                                {f.q}
                                <span className="text-[#dafc69]">+</span>
                            </h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">{f.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function ContactBlock({ content }: { content: any }) {
    return (
        <section className="px-12 py-32">
            <div className="max-w-6xl mx-auto bg-gray-50 rounded-[5rem] p-20 flex flex-col md:flex-row gap-20 items-center">
                <div className="flex-1">
                    <h2 className="text-6xl font-bold tracking-tighter leading-none mb-8">{content?.title || 'Hãy kết nối với chúng tôi.'}</h2>
                    <p className="text-gray-500 font-medium mb-12">{content?.subtitle || 'Chúng tôi luôn lắng nghe và sẵn sàng đồng hành cùng bạn.'}</p>
                    <div className="space-y-4">
                        <div className="p-8 bg-white rounded-[2rem] border border-gray-100 font-bold tracking-tight">contact@august.co</div>
                        <div className="p-8 bg-white rounded-[2rem] border border-gray-100 font-bold tracking-tight">090 123 4567</div>
                    </div>
                </div>
                <div className="flex-1 w-full flex flex-col gap-6 p-12 bg-white rounded-[4rem] shadow-2xl">
                    <input placeholder="Họ tên của bạn" className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#dafc69]/20 transition-all font-medium text-sm" />
                    <input placeholder="Địa chỉ email" className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#dafc69]/20 transition-all font-medium text-sm" />
                    <textarea placeholder="Lời nhắn của bạn" rows={4} className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#dafc69]/20 transition-all font-medium text-sm resize-none"></textarea>
                    <button className="w-full py-6 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-xl">Gửi thông tin</button>
                </div>
            </div>
        </section>
    )
}

export function SectionRenderer({ section }: { section: Section }) {
    switch (section.type) {
        case 'hero': return <HeroBlock content={section.content} />;
        case 'features': return <FeaturesBlock content={section.content} />;
        case 'testimonials': return <TestimonialsBlock content={section.content} />;
        case 'faq': return <FAQBlock content={section.content} />;
        case 'contact': return <ContactBlock content={section.content} />;
        case 'html': return <HTMLBlock content={section.content} />;
        default: return <div className="p-20 border-2 border-dashed rounded-[3rem] text-center text-gray-300 font-bold italic">Section type not implemented yet: {section.type}</div>;
    }
}

export const SectionForm = ({ section, onChange }: { section: Section, onChange: (content: any) => void }) => {
    const handleChange = (key: string, value: any) => {
        onChange({ ...section.content, [key]: value });
    };

    const inputStyle = "w-full bg-black/5 border border-black/5 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#dafc69] focus:bg-white outline-none transition-all placeholder:text-gray-300 mb-6";
    const labelStyle = "block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1";

    switch (section.type) {
        case 'html':
            return (
                <div className="space-y-2">
                    <div>
                        <label className={labelStyle}>mã html/css thô.</label>
                        <textarea className={`${inputStyle} font-mono text-[10px]`} rows={15} value={section.content.html || ''} onChange={(e) => handleChange('html', e.target.value)} placeholder="<div class='...'>Hello World</div>" />
                    </div>
                </div>
            );
        case 'hero':
            return (
                <div className="space-y-2">
                    <div>
                        <label className={labelStyle}>badge text.</label>
                        <input className={inputStyle} value={section.content.badge || ''} onChange={(e) => handleChange('badge', e.target.value)} placeholder="premium experience" />
                    </div>
                    <div>
                        <label className={labelStyle}>main title.</label>
                        <textarea className={inputStyle} rows={3} value={section.content.title || ''} onChange={(e) => handleChange('title', e.target.value)} placeholder="designing the future..." />
                    </div>
                    <div>
                        <label className={labelStyle}>subtitle.</label>
                        <textarea className={inputStyle} rows={3} value={section.content.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} placeholder="we build digital identities..." />
                    </div>
                    <div>
                        <label className={labelStyle}>button text.</label>
                        <input className={inputStyle} value={section.content.buttonText || ''} onChange={(e) => handleChange('buttonText', e.target.value)} placeholder="get started" />
                    </div>
                </div>
            );
        case 'features':
            return (
                <div className="space-y-2">
                    <div>
                        <label className={labelStyle}>section title.</label>
                        <input className={inputStyle} value={section.content.title || ''} onChange={(e) => handleChange('title', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>section subtitle.</label>
                        <input className={inputStyle} value={section.content.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} />
                    </div>
                </div>
            );
        case 'contact':
            return (
                <div className="space-y-2">
                    <div>
                        <label className={labelStyle}>title.</label>
                        <input className={inputStyle} value={section.content.title || ''} onChange={(e) => handleChange('title', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>email address.</label>
                        <input className={inputStyle} value={section.content.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>phone number.</label>
                        <input className={inputStyle} value={section.content.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
                    </div>
                </div>
            );
        case 'testimonials':
        case 'faq':
            return (
                <div className="space-y-2">
                    <div>
                        <label className={labelStyle}>title.</label>
                        <input className={inputStyle} value={section.content.title || ''} onChange={(e) => handleChange('title', e.target.value)} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed p-4 bg-gray-50 rounded-2xl">
                        chỉnh sửa danh sách chi tiết sẽ sớm được cập nhật.
                    </p>
                </div>
            );
        default:
            return null;
    }
};
