"use client";

import Link from "next/link";
import { Menu, X, Instagram, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useContact } from "@/context/ContactContext";

interface PublicNavbarProps {
    activeSection?: string; // For landing page dynamic theme
}

export default function PublicNavbar({ activeSection = 'dark' }: PublicNavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { openContact } = useContact();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Navbar dynamic styles
    const isLandingPage = pathname === "/";
    const effectiveTheme = isLandingPage ? activeSection : 'dark';

    const buttonStyle = effectiveTheme === 'light'
        ? 'border-black text-black hover:bg-black hover:text-white'
        : 'border-white text-white hover:bg-white hover:text-black';

    const navLinks = [
        { name: "về chúng tôi", href: "/about" },
        { name: "dự án", href: "/cases" },
        { name: "dịch vụ sự kiện", href: "/events" },
        { name: "dịch vụ marketing", href: "/marketing" },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-black/80 backdrop-blur-md' : 'py-8'}`}>
                <div className="max-w-[95%] mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="transition-opacity hover:opacity-70 duration-300">
                        <img src="/assets/august/logo.svg" alt="August" className="h-8 w-auto mix-blend-difference" />
                    </Link>

                    <div className="hidden md:flex items-center gap-10 text-xl font-bold lowercase transition-colors duration-300 mix-blend-difference text-white">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`hover:opacity-70 transition-opacity ${pathname === link.href ? 'text-[#dafc69]' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={openContact}
                            className="hover:opacity-70 transition-opacity"
                        >
                            liên hệ
                        </button>
                    </div>

                    <button
                        onClick={openContact}
                        className={`hidden md:block px-8 py-3 rounded-full border-2 font-black lowercase text-lg transition-all duration-300 mix-blend-difference ${buttonStyle}`}
                    >
                        liên hệ ngay
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white mix-blend-difference"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black z-[60] flex flex-col p-10 pt-32 animate-in fade-in slide-in-from-right duration-500">
                    <button
                        className="absolute top-8 right-6 p-2 text-white"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="flex flex-col gap-8 text-4xl font-black lowercase text-white">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                openContact();
                                setIsMenuOpen(false);
                            }}
                            className="text-left"
                        >
                            liên hệ
                        </button>
                    </div>
                    <div className="mt-20 flex gap-6">
                        <a href="https://www.instagram.com/augustevents.co.uk/" target="_blank" rel="noopener noreferrer" className="text-white opacity-60 hover:opacity-100 transition-opacity">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="mailto:hello@augustevents.co.uk" className="text-white opacity-60 hover:opacity-100 transition-opacity">
                            <Mail className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
