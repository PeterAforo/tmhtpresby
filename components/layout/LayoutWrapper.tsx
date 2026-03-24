"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SplashScreen } from "@/components/animations/SplashScreen";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes - no navbar/footer, just render children
    return <>{children}</>;
  }

  // Public routes - with navbar/footer
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <SplashScreen />
      <Navbar />
      <main id="main-content" className="pt-16 lg:pt-20">{children}</main>
      <Footer />
    </>
  );
}
