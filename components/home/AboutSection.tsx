"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Heart, Users, BookOpen, Church } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: Heart,
    title: "Compassionate Community",
    description: "A welcoming family where everyone belongs and is loved unconditionally.",
  },
  {
    icon: Users,
    title: "Strong Fellowship",
    description: "Building lasting relationships through shared faith and service together.",
  },
  {
    icon: BookOpen,
    title: "Biblical Teaching",
    description: "Grounded in Scripture, equipping believers for life and ministry.",
  },
  {
    icon: Church,
    title: "Vibrant Worship",
    description: "Encountering God's presence through Spirit-filled praise and prayer.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on the decorative elements
      gsap.to(".about-deco-circle", {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Image reveal animation
      gsap.fromTo(
        ".about-image-wrapper",
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(100% at 50% 50%)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );

      // Stats badge bounce in
      gsap.fromTo(
        ".about-badge",
        { scale: 0, opacity: 0, rotation: -10 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        }
      );

      // Secondary badge animation
      gsap.fromTo(
        ".about-badge-secondary",
        { scale: 0, opacity: 0, rotation: 10 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        }
      );

      // Feature cards stagger
      gsap.fromTo(
        ".feature-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-cream to-white relative overflow-hidden py-16 sm:py-20 lg:py-28">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="about-deco-circle absolute -left-20 top-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="about-deco-circle absolute -right-20 bottom-40 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-0 top-0 w-1 sm:w-2 h-32 sm:h-48 lg:h-64 bg-gradient-to-b from-primary to-primary/0" />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
          {/* Left side - Image composition */}
          <div ref={imageRef} className="relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative ring */}
              <div className="about-deco-circle absolute -left-4 sm:-left-6 lg:-left-8 -top-4 sm:-top-6 lg:-top-8 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px] rounded-full border-[12px] sm:border-[16px] border-primary/10 z-0" />
              
              {/* Main circular image */}
              <div className="about-image-wrapper relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] lg:w-[360px] lg:h-[360px] rounded-full overflow-hidden z-10 mx-auto lg:mx-0 shadow-2xl">
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src="/img/pictures/2/020.jpg"
                    alt="Our Church Community"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
              </div>

              {/* Stats badge - Members count */}
              <motion.div
                className="about-badge absolute -bottom-2 sm:bottom-2 lg:bottom-6 -left-2 sm:left-0 lg:-left-6 bg-navy text-white rounded-2xl sm:rounded-3xl w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex flex-col items-center justify-center z-20 shadow-xl"
                whileHover={{ scale: 1.08, rotate: -2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">1500</span>
                  <span className="text-crimson text-xl sm:text-2xl lg:text-3xl font-bold">+</span>
                </div>
                <span className="text-xs sm:text-sm text-white/80 text-center mt-1 px-2">Church Members</span>
              </motion.div>

              {/* Secondary badge - Years */}
              <motion.div
                className="about-badge-secondary absolute -top-2 sm:top-4 lg:top-8 -right-2 sm:right-4 lg:right-0 bg-primary text-white rounded-xl sm:rounded-2xl px-4 sm:px-5 lg:px-6 py-3 sm:py-4 z-20 shadow-lg"
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading">25+</span>
                <span className="block text-xs sm:text-sm text-white/90">Years of Faith</span>
              </motion.div>
            </div>
          </div>

          {/* Right side - Content */}
          <motion.div
            className="order-1 lg:order-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Label */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="w-8 sm:w-12 h-[2px] bg-crimson" />
              <span className="text-crimson text-xs sm:text-sm font-semibold tracking-wider uppercase">
                About Our Church
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-navy mb-4 sm:mb-6 leading-[1.1]"
            >
              A Community Built on{" "}
              <span className="text-primary">Faith, Love</span> & Purpose
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-charcoal/70 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl"
            >
              At Most Holy Trinity Presbyterian Church, we believe in the transformative power of 
              God&apos;s love. For over 25 years, we&apos;ve been nurturing faith, building community, 
              and serving Lashibi and beyond with compassion and purpose.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12">
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold text-sm tracking-wide rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              >
                Learn Our Story
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-navy text-navy font-semibold text-sm tracking-wide rounded-lg hover:bg-navy hover:text-white transition-all duration-300"
              >
                Visit Us Sunday
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-20 lg:mt-24">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary/20"
              whileHover={{ y: -8 }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-heading font-semibold text-navy text-lg sm:text-xl mb-2">
                {feature.title}
              </h4>
              <p className="text-charcoal/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom contact bar */}
      <div className="relative z-10 mt-16 sm:mt-20 lg:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row">
              {/* Phone section */}
              <div className="py-6 sm:py-8 px-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:w-1/2 border-b md:border-b-0 md:border-r border-white/10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-white">
                  <p className="text-sm text-white/60 mb-1">Speak with our Pastor</p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-wide font-heading">+233 24 683 9756</p>
                </div>
              </div>

              {/* Email signup section */}
              <div className="py-6 sm:py-8 px-6 sm:px-8 lg:px-10 flex-1">
                <p className="text-white text-sm font-semibold mb-3">Receive Daily Devotions</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 bg-white/10 text-white placeholder-white/50 text-sm rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10"
                  />
                  <button className="px-6 py-3 bg-crimson text-white font-semibold text-sm rounded-lg sm:rounded-l-none hover:bg-crimson/90 transition-colors flex items-center justify-center gap-2">
                    <span className="sm:hidden lg:inline">Subscribe</span>
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
