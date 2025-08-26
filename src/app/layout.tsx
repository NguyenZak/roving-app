import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fsPlaylist = localFont({
  src: [
    {
      path: "../../public/fonts/FS Playlist Script.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-fs-playlist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fresh-travel.example"),
  title: {
    default: "Roving Vietnam Travel — Discover Vietnam",
    template: "%s | Roving Vietnam Travel",
  },
  description: "Discover Vietnam – Live fully in every journey. Tours, guides, and stories.",
  openGraph: {
    title: "Roving Vietnam Travel — Discover Vietnam",
    description: "Live fully in Vietnam with curated tours across Culture, Nature, Adventure, Cuisine.",
    url: "https://www.fresh-travel.example",
    siteName: "Roving Vietnam Travel",
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: "Roving Vietnam Travel Vietnam" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roving Vietnam Travel — Discover Vietnam",
    description: "Live fully in Vietnam.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fsPlaylist.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
