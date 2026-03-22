import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { CHURCH_INFO, FOOTER_LINKS } from "@/lib/constants";

const recentNews = [
  {
    title: "As we've all discovered by now, the world can change",
    date: "May 20, 2021",
    image: "/img/pictures/2/070.jpg",
    href: "/blog/1",
  },
  {
    title: "Testimony love offering so blessed",
    date: "May 20, 2021",
    image: "/img/pictures/2/072.jpg",
    href: "/blog/2",
  },
  {
    title: "As we've all discovered by now, the world can change",
    date: "May 20, 2021",
    image: "/img/pictures/2/074.jpg",
    href: "/blog/3",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* About Us column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Nulla quis lorem ut libero malesuada feugiat. Quisque velit nisi, pretium ut lacinia in
            </p>

            {/* Contact details */}
            <div className="space-y-2.5 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-[#E31B23]" />
                <span>{CHURCH_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-[#E31B23]" />
                <span>{CHURCH_INFO.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0 text-[#E31B23]" />
                <span>Community 20, Lashibi</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h3 className="font-semibold text-lg mb-4">
                {group.heading}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-[#E31B23] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Recent News column */}
          <div className="hidden lg:block">
            <h3 className="font-semibold text-lg mb-4">Recent News</h3>
            <div className="space-y-4">
              {recentNews.map((news, index) => (
                <Link
                  key={index}
                  href={news.href}
                  className="flex gap-3 group"
                >
                  <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{news.date}</p>
                    <h4 className="text-sm text-gray-300 group-hover:text-[#E31B23] transition-colors line-clamp-2">
                      {news.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Copyright © Congregation of TMHT Presby Church - {year}
          </p>
          
          {/* Logo */}
          <Link href="/" className="order-first md:order-none">
            <Image
              src="/logo.png"
              alt="Presbyterian Church of Ghana Logo"
              width={50}
              height={60}
            />
          </Link>

          {/* Social links */}
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 hover:bg-[#E31B23] flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 hover:bg-[#E31B23] flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 hover:bg-[#E31B23] flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://www.youtube.com/@TMHTPresby"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 hover:bg-[#E31B23] flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
