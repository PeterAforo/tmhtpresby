import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SplashScreen } from "@/components/animations/SplashScreen";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { PWAProvider } from "@/components/pwa/PWAProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Most Holy Trinity Presbyterian Church",
    template: "%s | Most Holy Trinity Presbyterian Church",
  },
  description:
    "Welcome to The Most Holy Trinity Presbyterian Church in Lashibi, Accra. Join us for worship, community, and spiritual growth. That They All May Be One.",
  keywords: [
    "church",
    "presbyterian",
    "Lashibi",
    "Accra",
    "Ghana",
    "worship",
    "community",
    "Christian",
    "PCG",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Most Holy Trinity Presbyterian Church",
    title: "The Most Holy Trinity Presbyterian Church",
    description:
      "Welcome to The Most Holy Trinity Presbyterian Church. Join us for worship, community, and spiritual growth.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Viewport with safe area support for notched devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3D4DB7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MHTPC" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
      </head>
      <body className="font-body min-h-screen" suppressHydrationWarning>
        <ThemeScript />
        <SessionProvider>
          <PWAProvider>
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <SplashScreen />
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </PWAProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
