"use client";

import React, { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface FlipbookProps {
    images: string[];
    onClose: () => void;
}

const Page = React.forwardRef<HTMLDivElement, { image: string; number: number }>(
    (props, ref) => {
        return (
            <div className="bg-black" ref={ref}>
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={props.image}
                        alt={`Menu Page ${props.number}`}
                        className="w-full h-full object-contain pointer-events-none"
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-white/50 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                        {props.number}
                    </div>
                </div>
            </div>
        );
    }
);
Page.displayName = "Page";

export default function Flipbook({ images, onClose }: FlipbookProps) {
    const bookRef = useRef<any>(null);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const nextButtonClick = () => {
        bookRef.current?.pageFlip()?.flipNext();
    };

    const prevButtonClick = () => {
        bookRef.current?.pageFlip()?.flipPrev();
    };

    const onPage = (e: any) => {
        setPage(e.data);
    };

    useEffect(() => {
        setTotalPage(images.length);
    }, [images]);

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-10 transition-all duration-500">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#dafc69]/20 via-transparent to-transparent"></div>
            </div>

            {/* Header Controls */}
            <div className="absolute top-6 left-0 w-full px-6 md:px-10 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#dafc69] flex items-center justify-center text-black font-black text-sm md:text-base">
                        {page + (isMobile ? 1 : 1)}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 md:p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 backdrop-blur-md group"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            {/* Main Flipbook Area */}
            <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] flex items-center justify-center mt-10 z-10">
                {images.length > 0 && (
                    <HTMLFlipBook
                        width={isMobile ? window.innerWidth - 40 : 450}
                        height={isMobile ? (window.innerWidth - 40) * 1.414 : 636}
                        size="stretch"
                        minWidth={300}
                        maxWidth={isMobile ? window.innerWidth - 40 : 1000}
                        minHeight={400}
                        maxHeight={isMobile ? (window.innerWidth - 40) * 1.414 : 1000}
                        maxShadowOpacity={0.5}
                        showCover={true}
                        mobileScrollSupport={true}
                        onFlip={onPage}
                        className="shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-auto"
                        ref={bookRef}
                        style={{ margin: "0 auto" }}
                        usePortrait={true}
                        startPage={0}
                        drawShadow={true}
                        flippingTime={1000}
                        useMouseEvents={true}
                        swipeDistance={30}
                        showPageCorners={true}
                        disableFlipByClick={false}
                        autoSize={true}
                        startZIndex={0}
                        clickEventForward={true}
                    >
                        {images.map((img, index) => (
                            <Page key={index} image={img} number={index + 1} />
                        ))}
                    </HTMLFlipBook>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10">
                <button
                    onClick={prevButtonClick}
                    disabled={page === 0}
                    className="p-4 md:p-6 bg-white/5 hover:bg-[#dafc69] hover:text-black text-white rounded-full transition-all border border-white/10 backdrop-blur-md disabled:opacity-20 disabled:cursor-not-allowed group shadow-lg"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
                <div className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                    {page + 1} {isMobile ? '' : `- ${Math.min(page + 2, totalPage)}`} / {totalPage}
                </div>
                <button
                    onClick={nextButtonClick}
                    disabled={page >= totalPage - (isMobile ? 1 : 2)}
                    className="p-4 md:p-6 bg-white/5 hover:bg-[#dafc69] hover:text-black text-white rounded-full transition-all border border-white/10 backdrop-blur-md disabled:opacity-20 disabled:cursor-not-allowed group shadow-lg"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
            </div>

            {/* Hints */}
            <div className="absolute bottom-10 right-10 hidden md:block">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                    Kéo thả góc trang để lật
                </p>
            </div>
        </div>
    );
}
