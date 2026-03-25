"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Star, MessageSquareQuote } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TESTIMONIALS = [
  {
    quote: "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus.",
    name: "Bobby K. Parker",
    role: "Business Analyst",
    image: "/img/pictures/2/012.jpg",
    rating: 4,
  },
  {
    quote: "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus.",
    name: "Bobby K. Parker",
    role: "UI/UX Developer",
    image: "/img/pictures/2/014.jpg",
    rating: 4,
  },
  {
    quote: "This church has transformed my life. The warmth and genuine love I've experienced here is unlike anything I've known before.",
    name: "Akua Mensah",
    role: "Member since 2018",
    image: "/img/pictures/2/016.jpg",
    rating: 5,
  },
  {
    quote: "The youth ministry has been a blessing for my children. They've grown so much in their faith and found lifelong friends.",
    name: "Kofi Asante",
    role: "Member since 2015",
    image: "/img/pictures/2/018.jpg",
    rating: 5,
  },
];

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  image: string;
  rating: number;
}

interface TestimonialsSectionProps {
  label?: string;
  heading?: string;
  testimonials?: TestimonialItem[];
}

export function TestimonialsSection(props: TestimonialsSectionProps = {}) {
  const testimonials = props.testimonials && props.testimonials.length > 0 ? props.testimonials : DEFAULT_TESTIMONIALS;
  const sectionLabel = props.label || "TESTIMONIALS";
  const sectionHeading = props.heading || "What Our\nCongregation Say";
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const next = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prev = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background world map pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='%23000' d='M150 100c20-10 40 5 60 0s30-20 50-15 25 15 45 10 35-25 55-20 20 20 40 15 45-30 65-25 15 25 35 20 40-35 60-30 10 30 30 25 50-40 70-35 5 35 25 30 55-45 75-40-5 40 15 35 60-50 80-45-15 45 5 40 65-55 85-50-25 50-5 45 70-60 90-55-35 55-15 50 75-65 95-60-45 60-25 55 80-70 100-65'/%3E%3C/svg%3E")`,
          backgroundSize: "cover",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="testimonial-header text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[#E31B23] text-sm font-semibold mb-4">
            <Plus size={16} />
            <span>{sectionLabel}</span>
            <Plus size={16} />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[#0F172A]">
            {sectionHeading.split('\n').map((line, i) => (<span key={i}>{line}{i < sectionHeading.split('\n').length - 1 && <br />}</span>))}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {currentTestimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Image with quote icon */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Quote icon */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#E31B23] rounded-lg flex items-center justify-center">
                  <MessageSquareQuote size={18} className="text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Star rating */}
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= testimonial.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-gray-300"}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {testimonial.quote}
                </p>

                {/* Author */}
                <div>
                  <p className="font-bold text-[#0F172A] text-sm uppercase">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={prev}
            className="w-11 h-11 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="w-11 h-11 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Next testimonials"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
