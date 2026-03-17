"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Instagram, Info, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useContact } from "@/context/ContactContext";
import { cmsService, HeroSlide } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

/* Tailwind Safelist for dynamic grids:
md:col-start-1 md:col-start-2 md:col-start-3 md:col-start-4 md:col-start-5 md:col-start-6 md:col-start-7 md:col-start-8 md:col-start-9 md:col-start-10 md:col-start-11 md:col-start-12
md:col-span-1 md:col-span-2 md:col-span-3 md:col-span-4 md:col-span-5 md:col-span-6 md:col-span-7 md:col-span-8 md:col-span-9 md:col-span-10 md:col-span-11 md:col-span-12
md:col-end-1 md:col-end-2 md:col-end-3 md:col-end-4 md:col-end-5 md:col-end-6 md:col-end-7 md:col-end-8 md:col-end-9 md:col-end-10 md:col-end-11 md:col-end-12 md:col-end-13
*/

export default function HomeClient() {
  const [activeSection, setActiveSection] = useState<'light' | 'dark' | 'blue'>('blue');
  const [visibleCases, setVisibleCases] = useState(6);
  const [cases, setCases] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { openContact } = useContact();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, servicesRes, reviewsRes, partnersRes, settingsRes, heroRes] = await Promise.all([
          cmsService.getCases(),
          cmsService.getServices(),
          cmsService.getReviews(),
          cmsService.getPartners(),
          cmsService.getSettings(),
          cmsService.getHeroSlides()
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
        setHeroSlides(heroRes.data.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    setMounted(true);
    fetchData();
  }, []);

  // Slider Auto-play
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(interval);
  }, [heroSlides]);

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

      {/* Hero Slider Section */}
      <section className="relative min-h-[120vh] flex flex-col justify-end bg-black overflow-hidden group/hero">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlideIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            {heroSlides.length > 0 ? (
              <>
                {(() => {
                  const url = heroSlides[currentSlideIndex].video_url;
                  const isVid = url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null;
                  
                  return isVid ? (
                    <video 
                      key={url}
                      src={url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover opacity-80" 
                    />
                  ) : (
                    <img 
                      key={url}
                      src={url}
                      className="w-full h-full object-cover opacity-80"
                      alt={heroSlides[currentSlideIndex].heading}
                    />
                  );
                })()}
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-[5]" />
                
                <div className="absolute inset-0 z-10 flex flex-col pt-40 pb-32">
                    <div className="max-w-[95%] mx-auto px-6 w-full h-full flex flex-col justify-between font-suisse">
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <p className="text-white text-6xl md:text-8xl font-serif italic mb-2">
                                {heroSlides[currentSlideIndex].title_1 || "agency sự kiện"}
                            </p>
                            <p className="text-white text-6xl md:text-8xl font-serif italic ml-20 md:ml-40">
                                {heroSlides[currentSlideIndex].title_2 || "& marketing"}
                            </p>
                        </motion.div>

                        <div className="w-full flex justify-end mt-20 font-suisse">
                            <div className="max-w-3xl text-right">
                                <motion.h1 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className="text-[12vw] md:text-[6vw] leading-[0.9] font-black text-white lowercase tracking-tighter select-none mb-10 whitespace-pre-line"
                                >
                                    {heroSlides[currentSlideIndex].heading}
                                </motion.h1>
                                <motion.button
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1.1, duration: 0.5 }}
                                    onClick={openContact}
                                    className="inline-block px-8 md:px-10 py-3 md:py-4 rounded-full border-2 font-black lowercase text-lg md:text-xl transition-all duration-300 bg-[#dafc69] text-black border-[#dafc69] hover:bg-transparent hover:text-[#dafc69]"
                                >
                                    liên hệ ngay
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
              </>
            ) : (
                <>
                {/* Fallback to settings if no slides */}
                {(() => {
                    const url = settings.hero_video_url || "/assets/august/default.mp4";
                    const isVid = url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null;
                    return isVid ? (
                        <video src={url} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <img src={url} className="w-full h-full object-cover opacity-80" alt="Hero background" />
                    );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="max-w-[95%] mx-auto px-6 relative z-10 w-full h-full flex flex-col justify-between pt-40 pb-32 font-suisse">
                    <div>
                        <p className="text-white text-6xl md:text-8xl font-serif italic mb-2">{settings.hero_title_1 || "agency sự kiện"}</p>
                        <p className="text-white text-6xl md:text-8xl font-serif italic ml-20 md:ml-40">{settings.hero_title_2 || "& marketing"}</p>
                    </div>

                    <div className="w-full flex justify-end mt-20 font-suisse">
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
                </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        {heroSlides.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
                <div className="flex gap-2">
                    {heroSlides.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentSlideIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-500 ${idx === currentSlideIndex ? 'w-12 bg-[#dafc69]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                        />
                    ))}
                </div>
                
                <div className="flex gap-2 ml-4">
                    <button 
                        onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                         onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length)}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )}
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 animate-on-scroll gap-6">
            <div>
              <p className="text-2xl font-serif italic opacity-60 mb-4">dịch vụ của chúng tôi.</p>
              <h2 className="text-5xl md:text-7xl font-black lowercase tracking-tighter">Event & Marketing <span className="text-[#dafc69]">Solutions</span></h2>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-2 rounded-full border border-[#dafc69] text-[#dafc69] text-sm font-bold lowercase">đổi mới</div>
              <div className="px-6 py-2 rounded-full border border-white/20 text-white/40 text-sm font-bold lowercase">chuyên nghiệp</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {services.length > 0 ? services.map((s, idx) => (
              <Link key={s.id} href={s.category === 'Events' ? '/events' : '/marketing'} className={`group bg-[#1A1A1A] rounded-[3.5rem] p-10 md:p-14 flex flex-col justify-between min-h-[550px] hover:bg-neutral-900 border border-white/5 hover:border-[#dafc69]/30 transition-all duration-500 animate-on-scroll relative overflow-hidden`}>
                <div className="absolute top-10 right-10 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#dafc69] group-hover:border-[#dafc69] transition-all">
                  <ArrowUpRight className="w-6 h-6 group-hover:text-black transition-colors" />
                </div>

                <div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 inline-block ${s.category === 'Events' ? 'bg-[#dafc69] text-black' : 'bg-white text-black'}`}>
                    {s.category}
                  </span>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black lowercase leading-[0.9] tracking-tighter mb-8 group-hover:text-[#dafc69] transition-colors">{s.title}</h3>
                </div>

                <div className="aspect-video rounded-[2.5rem] overflow-hidden my-8 relative border border-white/5">
                  <img
                    src={s.image_url || (s.category === 'Events' ? "/assets/august/our_services_events_.jpg" : "/assets/august/our_services_marketi.jpg")}
                    alt={s.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex flex-col gap-4">
                  <p className="text-xl text-white/50 lowercase leading-relaxed max-w-[85%]">{s.description}</p>
                </div>
              </Link>
            )) : !isLoading && (
              <p className="col-span-2 text-center text-white/20 py-20 italic">Chưa có dữ liệu dịch vụ...</p>
            )}
          </div>
        </div>
      </section>

      {/* Stats & Partners Section */}
      <section className="py-20 md:py-32 bg-white text-black font-suisse relative z-30 overflow-hidden border-y border-black/10">
        <div className="max-w-[90%] mx-auto relative flex flex-col md:flex-row min-h-[500px] md:min-h-[700px]">

          {/* Floating Background Images */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block opacity-90">
            <div className="absolute top-0 left-[25%] w-48 aspect-square overflow-hidden transform -translate-y-10 shadow-xl">
              <img src="/assets/august/about_center_1.jpg" className="w-full h-full object-cover grayscale" alt="" />
            </div>
            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[400px] aspect-[4/5] overflow-hidden shadow-2xl">
              <img src="/assets/august/our_services_events_.jpg" className="w-full h-full object-cover" alt="" />
            </div>
            <div className="absolute bottom-[20%] right-[0%] w-60 aspect-[3/4] overflow-hidden shadow-2xl">
              <img src="/assets/august/our_services_marketi.jpg" className="w-full h-full object-cover grayscale" alt="" />
            </div>
          </div>

          {/* Left Column */}
          <div className="w-full md:w-[45%] md:border-r border-black/60 relative z-10 flex flex-col justify-between pt-10 px-4 md:px-8">
            <div className="mix-blend-multiply">
              <h2 className="text-[6rem] md:text-[10rem] lg:text-[14rem] font-black leading-[0.8] tracking-tighter text-black">
                {settings.stats_years || "10+"}
              </h2>
              <p className="text-3xl md:text-5xl font-black mt-2 md:mt-4 tracking-tight text-black">years</p>
            </div>

            <p className="text-gray-800 max-w-xs text-lg md:text-xl font-medium mt-20 md:mt-auto pb-10 leading-relaxed mix-blend-multiply">
              {settings.stats_desc || "Our team has been organizing bespoke events and crafting memorable experiences"}
            </p>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-[55%] relative z-10 flex flex-col justify-between pt-10 px-4 md:px-12">
            <div className="mix-blend-multiply">
              <h2 className="text-[6rem] md:text-[10rem] lg:text-[14rem] font-black leading-[0.8] tracking-tighter text-black">
                {settings.stats_clients || "56+"}
              </h2>
              <p className="text-3xl md:text-5xl font-black mt-2 md:mt-4 tracking-tight text-black">clients</p>
            </div>

            {/* Partner Circular Logos Row */}
            <div className="mt-20 md:mt-auto pb-10 overflow-hidden w-full relative z-20">
              <div className="flex gap-4 md:gap-6 animate-partners-grid">
                {partners && partners.length > 0 ? (
                  [...partners, ...partners, ...partners, ...partners].map((p, idx) => (
                    <div key={idx} className="w-24 md:w-32 aspect-square rounded-full bg-[#f8f8f8] flex items-center justify-center flex-shrink-0 shadow-lg border border-black/5 hover:scale-105 transition-transform bg-opacity-95 backdrop-blur-sm">
                      {p.logo ? (
                        <img src={p.logo} alt={p.name} className="w-[65%] h-[65%] object-contain mix-blend-multiply" />
                      ) : (
                        <span className="text-[10px] md:text-xs font-black text-black/60 text-center px-4 mix-blend-multiply lowercase leading-tight">{p.name}</span>
                      )}
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-24 md:w-32 aspect-square rounded-full bg-[#f8f8f8] flex items-center justify-center flex-shrink-0 shadow-lg border border-black/5">
                      <span className="text-xs font-black lowercase text-black/20 text-center">loading</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
        <style jsx>{`
          @keyframes partners-grid { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-partners-grid { animation: partners-grid 30s linear infinite; }
        `}</style>
      </section>

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
              <div className="mt-12 text-gray-500 font-medium">© {mounted ? new Date().getFullYear() : '2025'} August Events</div>
            </div>
          </div>
        </div>
        <style jsx>{` @keyframes draw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } } `}</style>
      </footer>
    </div>
  );
}
