"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";

const upcomingEvents = [
  {
    title: "Sunday Worship Service",
    date: "Every Sunday",
    time: "9:00 AM - 12:00 PM",
    location: "Main Sanctuary",
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070",
  },
  {
    title: "Bible Study",
    date: "Wednesdays",
    time: "6:00 PM - 8:00 PM",
    location: "Fellowship Hall",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070",
  },
  {
    title: "Youth Fellowship",
    date: "Fridays",
    time: "5:00 PM - 7:00 PM",
    location: "Youth Center",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070",
  },
];

export function EventsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Featured Event - Left side */}
          <div className="bg-[#3D4DB7] rounded-lg p-8 text-white relative overflow-hidden">
            {/* Presbyterian Logo watermark */}
            <div className="absolute top-4 right-4 opacity-20">
              <Image
                src="/logo.png"
                alt=""
                width={120}
                height={140}
                className="opacity-50"
              />
            </div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-[#E31B23] text-sm font-semibold rounded mb-4">
                Featured Event
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-4">
                Harvest Thanksgiving Service
              </h3>
              <p className="text-white/80 mb-6">
                Join us for a special thanksgiving service as we celebrate God&apos;s 
                faithfulness and provision throughout the year.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar size={20} />
                  <span>Sunday, November 24, 2024</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} />
                  <span>9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} />
                  <span>Main Sanctuary</span>
                </div>
              </div>

              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 bg-white text-[#3D4DB7] font-semibold rounded hover:bg-gray-100 transition-colors"
              >
                View All Events
              </Link>
            </div>
          </div>

          {/* Upcoming Events - Right side */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-gray-900 mb-6">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-24 h-24 shrink-0 rounded overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {event.title}
                    </h4>
                    <p className="text-sm text-[#3D4DB7] font-medium mt-1">
                      {event.date}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.time} • {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
