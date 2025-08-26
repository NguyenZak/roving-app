import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fresh-travel.example"),
  title: {
    default: "Fresh Travel — Discover Vietnam",
    template: "%s | Fresh Travel",
  },
  description: "Discover Vietnam – Live fully in every journey. Tours, guides, and stories.",
  openGraph: {
    title: "Fresh Travel — Discover Vietnam",
    description: "Live fully in Vietnam with curated tours across Culture, Nature, Adventure, Cuisine.",
    url: "https://www.fresh-travel.example",
    siteName: "Fresh Travel",
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: "Fresh Travel Vietnam" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh Travel — Discover Vietnam",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
