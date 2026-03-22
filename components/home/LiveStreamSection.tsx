"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X, Calendar, Clock, ChevronRight, Youtube, Radio } from "lucide-react";
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
  duration?: string;
}

const featuredVideo: VideoItem = {
  id: "featured",
  videoId: "jhloSMM-y0c",
  title: "1ST SUNDAY OF ADVENT – 30TH NOVEMBER, 2025",
  date: "Nov 30, 2025",
  thumbnail: "https://img.youtube.com/vi/jhloSMM-y0c/maxresdefault.jpg",
  duration: "1:45:32",
};

const recentVideos: VideoItem[] = [
  {
    id: "1",
    videoId: "IeZlg_9R8Ls",
    title: "Revival Night Day 3",
    date: "Nov 27, 2025",
    thumbnail: "https://img.youtube.com/vi/IeZlg_9R8Ls/hqdefault.jpg",
    duration: "2:15:00",
  },
  {
    id: "2",
    videoId: "MeS4o3ULKqs",
    title: "Revival Night Day 2",
    date: "Nov 26, 2025",
    thumbnail: "https://img.youtube.com/vi/MeS4o3ULKqs/hqdefault.jpg",
    duration: "1:58:45",
  },
  {
    id: "3",
    videoId: "rG3pJryZPI8",
    title: "24th Sunday After Pentecost",
    date: "Nov 24, 2025",
    thumbnail: "https://img.youtube.com/vi/rG3pJryZPI8/hqdefault.jpg",
    duration: "1:32:18",
  },
  {
    id: "4",
    videoId: "TvbJVAJTkO8",
    title: "Open Forum Discussion",
    date: "Nov 16, 2025",
    thumbnail: "https://img.youtube.com/vi/TvbJVAJTkO8/hqdefault.jpg",
    duration: "1:12:30",
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeVideo}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm"
                aria-label="Close video"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Close</span>
                <X size={24} />
              </motion.button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={sectionRef} className="py-20 lg:py-28 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="livestream-header text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-semibold mb-4">
              <Radio size={16} className="animate-pulse" />
              <span>LIVE & ON-DEMAND</span>
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] mb-4">
              Watch Our Services
            </h2>
            <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
              Join us live every Sunday or catch up on past services, sermons, and special events.
            </p>
          </div>

          {/* Featured Video - Large Card */}
          <div className="livestream-featured mb-12">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Video thumbnail - takes 3 columns */}
                <div className="lg:col-span-3 relative">
                  <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[300px] lg:min-h-[400px]">
                    <Image
                      src={featuredVideo.thumbnail}
                      alt={featuredVideo.title}
                      fill
                      className="object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/80 hidden lg:block" />
                    
                    {/* Play button */}
                    <motion.button
                      onClick={() => openVideo(featuredVideo.videoId)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                        <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                          <Play size={32} className="text-slate-900 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </motion.button>

                    {/* Duration badge */}
                    {featuredVideo.duration && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/70 text-white text-sm font-medium backdrop-blur-sm">
                        {featuredVideo.duration}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video info - takes 2 columns */}
                <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider">
                      Latest
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-sm">
                      <Calendar size={14} />
                      {featuredVideo.date}
                    </span>
                  </div>
                  
                  <h3 className="font-[family-name:var(--font-heading)] text-xl lg:text-2xl font-bold text-white mb-4 leading-tight">
                    {featuredVideo.title}
                  </h3>
                  
                  <p className="text-slate-300 text-sm lg:text-base leading-relaxed mb-6">
                    Join the TMHT Presby Church community for our live Sunday Worship Service. 
                    This event marks the beginning of the Advent season, a time of preparing for the coming of Christ.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => openVideo(featuredVideo.videoId)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play size={18} fill="currentColor" />
                      Watch Now
                    </motion.button>
                    <Link
                      href="https://www.youtube.com/@tmhtpresby"
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20"
                    >
                      <Youtube size={18} />
                      Subscribe
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Videos Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[family-name:var(--font-heading)] text-xl lg:text-2xl font-bold text-[var(--text)]">
                Recent Services
              </h3>
              <Link 
                href="/sermons"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="livestream-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentVideos.map((video) => (
                <motion.button
                  key={video.id}
                  onClick={() => openVideo(video.videoId)}
                  className="livestream-video group text-left"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-200 dark:bg-slate-800">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play size={22} className="text-slate-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h4 className="font-semibold text-[var(--text)] text-sm mb-1 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <Calendar size={12} />
                    {video.date}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-8 lg:p-10">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="font-[family-name:var(--font-heading)] text-xl lg:text-2xl font-bold text-white mb-2">
                  Never Miss a Service
                </h3>
                <p className="text-white/80 text-sm lg:text-base">
                  Subscribe to our YouTube channel for live streams and notifications.
                </p>
              </div>
              <Link
                href="https://www.youtube.com/@tmhtpresby?sub_confirmation=1"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[var(--primary)] font-semibold hover:bg-white/90 transition-colors shrink-0"
              >
                <Youtube size={20} />
                Subscribe on YouTube
              </Link>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>
    </>
  );
}
