"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const DEFAULT_SLIDES = [
  {
    image: "/img/pictures/2/001.jpg",
    headline: "Welcome to The Most Holy Trinity",
    subline: "Presbyterian Church of Ghana - Lashibi",
    accent: "That They All May Be One",
  },
  {
    image: "/img/pictures/2/020.jpg",
    headline: "Experience the Presence of God",
    subline: "Join us every Sunday for worship that transforms lives.",
    accent: "Sunday Service 9:00 AM",
  },
  {
    image: "/img/pictures/2/030.jpg",
    headline: "Growing Together in Faith",
    subline: "Discover community, purpose, and spiritual growth.",
    accent: "Join Our Community",
  },
  {
    image: "/img/pictures/2/040.jpg",
    headline: "Praising God with Energy",
    subline: "With passion and gratitude in His presence.",
    accent: "Worship With Us",
  },
  {
    image: "/img/pictures/2/050.jpg",
    headline: "Building Strong Families",
    subline: "Nurturing faith across generations.",
    accent: "Family Ministry",
  },
  {
    image: "/img/pictures/2/060.jpg",
    headline: "Serving Our Community",
    subline: "Reaching out with love and compassion.",
    accent: "Outreach Programs",
  },
];

interface HeroSlide {
  image: string;
  headline: string;
  subline: string;
  accent: string;
}

interface HeroSectionProps {
  slides?: HeroSlide[];
  autoplaySpeed?: number;
  height?: string;
}

export function HeroSection({ slides, autoplaySpeed = 6000, height }: HeroSectionProps = {}) {
  const HERO_SLIDES = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const animateSlideChange = useCallback((newIndex: number, dir: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setPrevSlideIndex(currentSlide);

    const currentImage = imageRefs.current[currentSlide];
    const textElements = textRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentSlide(newIndex);
        setTimeout(() => setIsAnimating(false), 100);
      },
    });

    if (currentImage) {
      tl.to(currentImage, {
        scale: 1.15,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      }, 0);
    }

    if (textElements) {
      tl.to(textElements.querySelectorAll(".hero-text-animate"), {
        y: dir > 0 ? -60 : 60,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power3.in",
      }, 0);
    }
  }, [currentSlide, isAnimating]);

  const nextSlide = useCallback(() => {
    const newIndex = (currentSlide + 1) % HERO_SLIDES.length;
    animateSlideChange(newIndex, 1);
  }, [currentSlide, animateSlideChange]);

  const prevSlide = useCallback(() => {
    const newIndex = (currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    animateSlideChange(newIndex, -1);
  }, [currentSlide, animateSlideChange]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    const dir = index > currentSlide ? 1 : -1;
    animateSlideChange(index, dir);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, autoplaySpeed);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 6, ease: "none", repeat: -1 }
      );
    }
  }, [currentSlide]);

  useEffect(() => {
    const newImage = imageRefs.current[currentSlide];
    const textElements = textRef.current;

    if (newImage) {
      gsap.fromTo(
        newImage,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
      );
    }

    if (textElements) {
      const elements = textElements.querySelectorAll(".hero-text-animate");
      gsap.fromTo(
        elements,
        { 
          y: direction > 0 ? 80 : -80, 
          opacity: 0,
          rotateX: direction > 0 ? 15 : -15,
        },
        { 
          y: 0, 
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }
  }, [currentSlide, direction]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-nav-btn",
        { scale: 0, opacity: 0, rotate: -180 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.8, stagger: 0.15, delay: 0.8, ease: "back.out(1.7)" }
      );
      gsap.fromTo(
        ".hero-indicator",
        { width: 0, opacity: 0 },
        { width: "auto", opacity: 1, duration: 0.6, stagger: 0.08, delay: 1, ease: "power2.out" }
      );
      gsap.fromTo(
        ".hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 1.2, ease: "power2.out" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[400px] lg:h-[600px] overflow-hidden bg-[#0a0f1a]"
    >
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            ref={(el) => { imageRefs.current[index] = el; }}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentSlide ? "z-10" : "z-0 opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.headline}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
        ))}
      </div>

      {/* Animated Particles/Grain Effect */}
      <div 
        className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-30 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl" ref={textRef}>
            {/* Accent Tag */}
            <div className="hero-text-animate mb-4 lg:mb-6">
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3DA066]/20 border border-[#3DA066]/30 text-[#3DA066] text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#3DA066] animate-pulse" />
                {HERO_SLIDES[currentSlide].accent}
              </motion.span>
            </div>

            {/* Headline with Split Animation */}
            <h1 className="hero-text-animate font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4 lg:mb-6">
              {HERO_SLIDES[currentSlide].headline.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </h1>

            {/* Subline */}
            <p className="hero-text-animate text-base sm:text-lg lg:text-xl text-white/80 max-w-xl mb-6 lg:mb-8 leading-relaxed">
              {HERO_SLIDES[currentSlide].subline}
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/about"
                className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#3DA066] text-white text-sm sm:text-base font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(61,160,102,0.4)]"
              >
                <span className="relative z-10">Learn More</span>
                <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3DA066] to-[#2d7a4d] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/sermons"
                className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm sm:text-base font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <Play size={16} className="group-hover:scale-110 transition-transform" />
                <span>Watch Sermons</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Sleek Design */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="hero-nav-btn absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 rounded-full flex items-center justify-center text-white transition-all duration-300 disabled:opacity-50 group"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="hero-nav-btn absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 rounded-full flex items-center justify-center text-white transition-all duration-300 disabled:opacity-50 group"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators - Modern Line Style */}
      <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="hero-indicator group relative h-1 overflow-hidden rounded-full transition-all duration-500"
            style={{ width: index === currentSlide ? "48px" : "24px" }}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className="absolute inset-0 bg-white/30 group-hover:bg-white/50 transition-colors" />
            {index === currentSlide && (
              <div 
                ref={index === currentSlide ? progressRef : null}
                className="absolute inset-0 bg-[#3DA066] origin-left"
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 lg:bottom-10 right-4 lg:right-8 z-40 flex items-center gap-2 text-white/60 text-sm font-medium">
        <span className="text-white text-lg font-bold">{String(currentSlide + 1).padStart(2, "0")}</span>
        <span className="text-white/40">/</span>
        <span>{String(HERO_SLIDES.length).padStart(2, "0")}</span>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden lg:block" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3DA066]/50 to-transparent" />
    </section>
  );
}
