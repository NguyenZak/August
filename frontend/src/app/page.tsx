"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Instagram, Info } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useContact } from "@/context/ContactContext";
import { cmsService } from "@/services/api";

/* Tailwind Safelist for dynamic grids:
md:col-start-1 md:col-start-2 md:col-start-3 md:col-start-4 md:col-start-5 md:col-start-6 md:col-start-7 md:col-start-8 md:col-start-9 md:col-start-10 md:col-start-11 md:col-start-12
md:col-span-1 md:col-span-2 md:col-span-3 md:col-span-4 md:col-span-5 md:col-span-6 md:col-span-7 md:col-span-8 md:col-span-9 md:col-span-10 md:col-span-11 md:col-span-12
md:col-end-1 md:col-end-2 md:col-end-3 md:col-end-4 md:col-end-5 md:col-end-6 md:col-end-7 md:col-end-8 md:col-end-9 md:col-end-10 md:col-end-11 md:col-end-12 md:col-end-13
*/

export default function Home() {
  const [activeSection, setActiveSection] = useState<'light' | 'dark' | 'blue'>('blue');
  const [visibleCases, setVisibleCases] = useState(6);
  const [cases, setCases] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { openContact } = useContact();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, servicesRes, reviewsRes, partnersRes, settingsRes] = await Promise.all([
          cmsService.getCases(),
          cmsService.getServices(),
          cmsService.getReviews(),
          cmsService.getPartners(),
          cmsService.getSettings()
        ]);

        // Mapped Cases
        const sortedCases = casesRes.data.sort((a: any, b: any) => (a.grid_row || 0) - (b.grid_row || 0));
        const mappedCases = sortedCases.map(c => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          desc: c.category,
          img: c.image_url,
          className: `col-span-12 md:col-start-${c.grid_col || 1} md:col-end-${(c.grid_col || 1) + (c.grid_col_span || 12)}`
        }));
        setCases(mappedCases);
        setServices(servicesRes.data);
        setReviews(reviewsRes.data);
        setPartners(partnersRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section, footer');
      let currentSection: 'light' | 'dark' | 'blue' = 'blue';

      sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top <= 100) {
          if (section.classList.contains('bg-[#111111]') || section.classList.contains('bg-black')) {
            currentSection = 'dark';
          } else if (section.classList.contains('bg-[#F5F5F5]') || section.classList.contains('bg-white')) {
            currentSection = 'light';
          } else {
            currentSection = 'blue';
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
    return () => {
      observer.disconnect();
    };
  }, [isLoading, cases, services, reviews]);

  return (
    <div className="min-h-screen bg-[#000000] selection:bg-[#dafc69] selection:text-black font-sans antialiased overflow-x-hidden">

      <PublicNavbar activeSection={activeSection} />

      {/* Hero Section */}
      <section className="relative min-h-[120vh] flex flex-col justify-end bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video src={settings.hero_video_url || "/assets/august/default.mp4"} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>

        <div className="max-w-[95%] mx-auto px-6 relative z-10 w-full pb-32 flex flex-col items-start font-suisse">
          <div className="animate-on-scroll">
            <p className="text-white text-6xl md:text-8xl font-serif italic mb-2">{settings.hero_title_1 || "agency sự kiện"}</p>
            <p className="text-white text-6xl md:text-8xl font-serif italic ml-20 md:ml-40">{settings.hero_title_2 || "& marketing"}</p>
          </div>

          <div className="w-full flex justify-end mt-20 animate-on-scroll font-suisse">
            <div className="max-w-2xl text-right">
              <h1 className="text-[12vw] md:text-[6vw] leading-[0.9] font-black text-white lowercase tracking-tighter select-none mb-10 whitespace-pre-line">
                {settings.hero_heading || "from concept,\nto activation,\nto amplification"}
              </h1>
              <button
                onClick={openContact}
                className="inline-block px-8 md:px-10 py-3 md:py-4 rounded-full border-2 font-black lowercase text-lg md:text-xl transition-all duration-300 bg-[#dafc69] text-black border-[#dafc69] hover:bg-transparent hover:text-[#dafc69]"
              >
                liên hệ ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 md:py-48 bg-[#F5F5F5] text-black rounded-t-[3rem] -mt-10 relative z-20 overflow-hidden animate-on-scroll font-suisse">
        <div className="max-w-[95%] mx-auto px-6">
          <p className="text-2xl font-serif italic mb-16 opacity-60">giới thiệu.</p>
          <div className="flex flex-col md:flex-row gap-20 items-start">
            <div className="flex-1 max-w-4xl">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black lowercase leading-[1.0] tracking-tight text-gray-900 mb-12">
                {settings.about_heading || "Chúng tôi là một công ty sự kiện và marketing trọn gói có trụ sở tại Hà Nội, chuyên tạo ra những trải nghiệm thương hiệu có tác động mạnh mẽ"}
              </h2>
              <div className="max-w-2xl">
                <p className="text-xl md:text-2xl font-medium lowercase leading-relaxed text-gray-700 opacity-80">
                  {settings.about_desc || "Đội ngũ của chúng tôi đã tổ chức các sự kiện đặc biệt và tạo ra những trải nghiệm đáng nhớ trên toàn thế giới trong hơn 15 năm."}
                </p>
                <Link href="/about" className="mt-8 md:mt-12 group flex items-center gap-4 text-black hover:text-[#2f70e1] transition-colors">
                  <span className="text-xl md:text-2xl font-bold lowercase border-b-2 border-black group-hover:border-[#2f70e1]">tìm hiểu thêm</span>
                  <ArrowUpRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
            <div className="w-full md:w-[30%] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl flex-shrink-0">
              <img src={settings.about_image_url || "/assets/august/about_center_1.jpg"} alt="Về August" className="w-full h-full object-cover grayscale" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 md:py-48 bg-[#111111] text-white font-suisse">
        <div className="max-w-[95%] mx-auto px-6">
          <div className="flex justify-between items-end mb-24 animate-on-scroll">
            <p className="text-2xl font-serif italic opacity-60">dịch vụ của chúng tôi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.length > 0 ? services.slice(0, 2).map((s, idx) => (
              <Link key={s.id} href={s.category === 'Events' ? '/events' : '/marketing'} className={`group bg-[#1A1A1A] rounded-[3rem] p-12 md:p-16 flex flex-col justify-between min-h-[600px] hover:bg-[#2f70e1] transition-colors duration-700 animate-on-scroll ${idx === 1 ? 'delay-100' : ''}`}>
                <h3 className="text-[8vw] md:text-[5vw] font-black lowercase leading-none tracking-tighter">{s.title}</h3>
                <div className="aspect-[4/5] md:aspect-video rounded-[2rem] overflow-hidden my-12 relative">
                  <img src={s.image_url || (s.category === 'Events' ? "/assets/august/our_services_events_.jpg" : "/assets/august/our_services_marketi.jpg")} alt={s.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
                  <p className="text-xl opacity-60 lowercase md:max-w-[60%]">{s.description}</p>
                  <span className="text-xl font-bold lowercase border-b border-white group-hover:border-[#dafc69] group-hover:text-[#dafc69] transition-all flex items-center gap-2 self-end md:self-auto">
                    (khám phá dịch vụ) <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            )) : !isLoading && (
              <>
                <Link href="/events" className="group bg-[#1A1A1A] rounded-[3rem] p-12 md:p-16 flex flex-col justify-between min-h-[600px] hover:bg-[#2f70e1] transition-colors duration-700">
                  <h3 className="text-[8vw] md:text-[5vw] font-black lowercase leading-none tracking-tighter">Sự kiện</h3>
                  <div className="aspect-[4/5] md:aspect-video rounded-[2rem] overflow-hidden my-12 relative">
                    <img src="/assets/august/our_services_events_.jpg" alt="Sự kiện" className="w-full h-full object-cover grayscale" />
                  </div>
                  <p className="text-xl opacity-60 lowercase">Sự kiện đặc biệt, quản lý điểm đến và marketing trải nghiệm.</p>
                </Link>
                <Link href="/marketing" className="group bg-[#1A1A1A] rounded-[3rem] p-12 md:p-16 flex flex-col justify-between min-h-[600px] hover:bg-[#2f70e1] transition-colors duration-700">
                  <h3 className="text-[8vw] md:text-[5vw] font-black lowercase leading-none tracking-tighter">Marketing</h3>
                  <div className="aspect-[4/5] md:aspect-video rounded-[2rem] overflow-hidden my-12 relative">
                    <img src="/assets/august/our_services_marketi.jpg" alt="Marketing" className="w-full h-full object-cover grayscale" />
                  </div>
                  <p className="text-xl opacity-60 lowercase">Chiến lược nội dung, tự động hóa mạng xã hội và hợp tác sáng tạo.</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {partners.length > 0 && (
        <section className="py-20 bg-[#111111] border-y border-white/5 overflow-hidden font-suisse">
          <div className="flex overflow-hidden group select-none">
            <div className="flex animate-partners-marquee whitespace-nowrap gap-20 py-4 items-center">
              {[...partners, ...partners, ...partners, ...partners].map((p, idx) => (
                <div key={idx} className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="h-10 md:h-14 w-auto object-contain" />
                  ) : (
                    <span className="text-2xl font-black text-white lowercase tracking-tighter">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
            @keyframes partners-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-partners-marquee { animation: partners-marquee 60s linear infinite; }
          `}</style>
        </section>
      )}

      {/* Cases Section */}
      <section id="cases" className="py-32 md:py-64 bg-black text-white overflow-hidden font-suisse">
        <div className="max-w-[95%] mx-auto px-6">
          <p className="text-2xl font-serif italic mb-24 opacity-60">các dự án.</p>

          <div className="grid grid-cols-12 gap-y-32 md:gap-y-64 gap-x-8">
            {cases.length > 0 ? (
              cases.slice(0, visibleCases).map((c) => (
                <Link key={c.id} href={`/cases/${c.slug}`} className={`${c.className} group cursor-pointer animate-on-scroll`}>
                  <div className="aspect-[1.46] overflow-hidden rounded-[2.5rem] bg-zinc-900 mb-8">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black lowercase tracking-tighter group-hover:text-[#dafc69] transition-colors leading-tight">{c.title}</h3>
                  <p className="text-xl text-gray-500 mt-2 lowercase font-medium tracking-tight">{c.desc}</p>
                </Link>
              ))
            ) : !isLoading ? (
              <p className="col-span-12 text-center text-gray-500 py-20 font-medium lowercase italic opacity-40">Dữ liệu đang được cập nhật từ hệ thống CMS...</p>
            ) : (
              <div className="col-span-12 flex justify-center py-20 text-[#dafc69]">
                <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-32 bg-[#dafc69] text-black rounded-[3rem] overflow-hidden font-suisse">
        <div className="max-w-[95%] mx-auto px-6 mb-16 flex flex-col items-center">
          <p className="text-2xl font-serif italic opacity-60">đánh giá.</p>
          <h2 className="text-4xl md:text-6xl font-black lowercase tracking-tighter mt-4 text-center">những gì đối tác nói về chúng tôi</h2>
        </div>

        <div className="flex overflow-hidden group select-none relative">
          <div className="flex animate-marquee whitespace-nowrap gap-8 py-4">
            {(reviews.length > 0 ? [...reviews, ...reviews, ...reviews] : [1, 2, 3, 1, 2, 3]).map((r, idx) => {
              const review = typeof r === 'object' ? r : {
                author: idx % 3 === 0 ? "CMO, Global Fintech" : idx % 3 === 1 ? "Giám đốc Marketing" : "CEO, Tech Startup",
                content: idx % 3 === 0 ? "August thực sự hiểu DNA của thương hiệu chúng tôi." : idx % 3 === 1 ? "Đội ngũ chuyên nghiệp và bám sát tiến độ." : "Một trải nghiệm thương hiệu hoàn toàn khác biệt.",
                project: "Đối tác chiến lược"
              };
              return (
                <div key={idx} className="w-[300px] md:w-[450px] bg-white rounded-[2rem] p-8 md:p-10 flex flex-col justify-between shadow-sm whitespace-normal">
                  <p className="text-xl md:text-3xl font-black italic lowercase leading-tight tracking-tight mb-8">"{review.content}"</p>
                  <div className="flex items-center gap-4 pt-8 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#dafc69] font-black italic">{review.author[0]}</div>
                    <div>
                      <p className="text-lg font-black lowercase">{review.author}</p>
                      <p className="text-sm opacity-40 lowercase">{review.project}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 40s linear infinite; }
          .animate-marquee:hover { animation-play-state: paused; }
        `}</style>
      </section>

      <footer id="contact" className="bg-black text-white py-32 md:py-48 relative overflow-hidden font-suisse">
        <div className="max-w-[95%] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-64 md:h-80 flex items-center justify-center lg:justify-start pl-16 md:pl-32">
              <div className="relative">
                <span className="text-[#dafc69] text-4xl md:text-6xl font-black lowercase tracking-tighter absolute -top-14 left-0 -translate-x-1/2">idea</span>
                <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className="transform">
                  <path d="M10 10C80 10 180 60 210 150" stroke="#dafc69" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8" className="animate-[draw_3s_linear_infinite]" />
                  <circle cx="210" cy="150" r="6" stroke="#dafc69" strokeWidth="3" fill="black" />
                </svg>
                <span className="text-[#dafc69] text-4xl md:text-6xl font-black lowercase tracking-tighter absolute -bottom-14 left-[210px] -translate-x-1/2">activation</span>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end text-right gap-6">
              <a href={`tel:${(settings.contact_phone || "+44 7555181094").replace(/\s/g, '')}`} className="text-4xl md:text-7xl font-black hover:text-[#dafc69] transition-colors tracking-tighter">{settings.contact_phone || "+44 7555181094"}</a>
              <div className="space-y-2 opacity-80">
                <p className="flex items-center justify-end gap-3 text-xl"><Mail className="w-5 h-5" /> {settings.contact_email || "sophie.w@augustevents.co.uk"}</p>
                <p className="flex items-center justify-end gap-3 text-xl"><Instagram className="w-5 h-5" /> {settings.contact_instagram || "augustevents.co.uk"}</p>
              </div>
              <div className="mt-12 text-gray-500 font-medium">© {new Date().getFullYear()} August Events</div>
            </div>
          </div>
        </div>
        <style jsx>{` @keyframes draw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } } `}</style>
      </footer>
    </div>
  );
}
