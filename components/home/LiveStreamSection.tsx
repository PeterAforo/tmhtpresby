"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Play, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface VideoItem {
  id: string;
  videoId: string;
  title: string;
  date: string;
  thumbnail: string;
}

const featuredVideo: VideoItem = {
  id: "featured",
  videoId: "jhloSMM-y0c",
  title: "1ST SUNDAY OF ADVENT – 30TH NOVEMBER, 2025",
  date: "Nov 30, 2025",
  thumbnail: "https://img.youtube.com/vi/jhloSMM-y0c/maxresdefault.jpg",
};

const olderVideos: VideoItem[] = [
  {
    id: "1",
    videoId: "IeZlg_9R8Ls",
    title: "REVIVAL DAY 3 - 27TH NOVEMBER 2025",
    date: "27th Nov, 2025",
    thumbnail: "https://img.youtube.com/vi/IeZlg_9R8Ls/hqdefault.jpg",
  },
  {
    id: "2",
    videoId: "MeS4o3ULKqs",
    title: "REVIVAL DAY 2 - 27TH NOVEMBER 2025",
    date: "27th Nov, 2025",
    thumbnail: "https://img.youtube.com/vi/MeS4o3ULKqs/hqdefault.jpg",
  },
  {
    id: "3",
    videoId: "rG3pJryZPI8",
    title: "24TH SUNDAY AFTER PENTECOST SERVICE",
    date: "24th Nov, 2025",
    thumbnail: "https://img.youtube.com/vi/rG3pJryZPI8/hqdefault.jpg",
  },
  {
    id: "4",
    videoId: "TvbJVAJTkO8",
    title: "OPEN FORUM || 16TH NOVEMBER 2025",
    date: "16th Nov, 2025",
    thumbnail: "https://img.youtube.com/vi/TvbJVAJTkO8/hqdefault.jpg",
  },
];

export function LiveStreamSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const openVideo = (videoId: string) => {
    setActiveVideo(videoId);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".livestream-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
      gsap.fromTo(
        ".livestream-featured",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
      gsap.fromTo(
        ".livestream-video",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".livestream-grid",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeVideo}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                aria-label="Close video"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={32} />
              </motion.button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={sectionRef} className="relative py-20 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/img/pictures/2/030.jpg"
            alt="Church interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0F172A]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="livestream-header text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-[#E31B23] text-sm font-semibold mb-4">
              <Plus size={16} />
              <span>WATCH VIDEO</span>
              <Plus size={16} />
            </div>
          </div>

          {/* Featured Video */}
          <div className="livestream-featured bg-white rounded-lg overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Video thumbnail */}
              <div className="relative h-80 lg:h-96">
                {/* Left side - Event banner */}
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#00A3E0] p-4 lg:p-6 flex flex-col justify-center z-10">
                  <div className="text-white">
                    <p className="text-[10px] lg:text-xs mb-2 flex items-center gap-1 lg:gap-2">
                      <Image src="/logo.png" alt="PCG" width={16} height={20} className="lg:w-5 lg:h-6" />
                      <span className="leading-tight">THE MOST HOLY TRINITY CONGREGATION<br />PRESBYTERIAN CHURCH OF GHANA</span>
                    </p>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl lg:text-3xl italic mb-1">
                      Preparing
                    </h3>
                    <p className="text-sm lg:text-xl font-bold">FOR HIS</p>
                    <p className="text-2xl lg:text-4xl font-black">COMING</p>
                    <p className="text-[10px] lg:text-xs mt-2 opacity-80">JER. 33:14-16, 1 THES. 3:9-13</p>
                    <div className="flex items-center gap-1 lg:gap-2 mt-2 lg:mt-3">
                      <span className="bg-[#E31B23] px-1.5 lg:px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs font-bold">30TH NOV, 2025</span>
                      <span className="bg-white text-[#0F172A] px-1.5 lg:px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs font-bold">8AM</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Video preview */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <Image
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    fill
                    className="object-cover"
                  />
                  {/* Play button */}
                  <button
                    onClick={() => openVideo(featuredVideo.videoId)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 bg-[#E31B23] rounded-full flex items-center justify-center hover:bg-[#c91720] transition-colors shadow-lg"
                  >
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </button>
                </div>
              </div>

              {/* Video info */}
              <div className="p-6 lg:p-10 flex flex-col justify-center">
                <p className="text-[#E31B23] text-sm font-semibold mb-2">{featuredVideo.date}</p>
                <h2 className="font-[family-name:var(--font-heading)] text-xl lg:text-2xl font-bold text-[#0F172A] mb-4">
                  {featuredVideo.title}
                </h2>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  Join the TMHTPresby Church community for our live Sunday Worship 
                  Service. This event marks the beginning of the Advent season, a time of 
                  preparing for the coming of Christ. This is a scheduled live stream or 
                  premiere event. Click to watch live or set a reminder.
                </p>
              </div>
            </div>
          </div>

          {/* Older Videos Grid */}
          <div className="livestream-grid grid grid-cols-2 md:grid-cols-4 gap-4">
            {olderVideos.map((video) => (
              <motion.button
                key={video.id}
                onClick={() => openVideo(video.videoId)}
                className="livestream-video group relative aspect-square rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                
                {/* Play button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#E31B23] rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                  <Play size={20} className="text-white ml-0.5" fill="white" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
