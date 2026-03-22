"use client";

import { Phone, MapPin } from "lucide-react";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/dir//The+Most+Holy+Trinity+Congregation+(Presbyterian+Church+of+Ghana),+MW2F%2B87R,+Lashibi/@5.7405129,0.046657,15z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0xfdf83fe76852171:0xaff80fd556554012!2m2!1d-0.0768664!2d5.650859?entry=ttu";

export function ContactBar() {
  return (
    <section className="bg-[#3D4DB7] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Phone */}
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-sm text-white/70">Call Us Today</p>
              <a href="tel:+233302661788" className="text-xl font-bold hover:underline">
                +233-302-661-788
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm text-white/70">Visit Us</p>
              <p className="font-semibold">Lashibi, Accra, Ghana</p>
            </div>
          </div>

          {/* CTA */}
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#E31B23] text-white font-semibold rounded hover:bg-[#c91720] transition-colors"
          >
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
