"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Navbar from "@/components/site/Navbar";

type Slide =
  | { type: "image"; src: string; alt: string; title?: string; subtitle?: string }
  | { type: "video"; src: string; poster?: string; alt?: string; title?: string; subtitle?: string }
  | {
      type: "youtube";
      id?: string; // e.g., "dQw4w9WgXcQ"
      url?: string; // e.g., "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      start?: number;
      end?: number;
      poster?: string;
      title?: string;
      subtitle?: string;
    };

// Fallback slides nếu không có banner từ database
const fallbackSlides: Slide[] = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop",
    alt: "Ha Long Bay limestone karsts at sunset",
    title: "Discover Vietnam",
    subtitle: "Live fully in every journey"
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2000&auto=format&fit=crop",
    alt: "Hoi An lantern street at night",
    title: "Ancient Beauty",
    subtitle: "Experience the charm of Hoi An"
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000&auto=format&fit=crop",
    alt: "Sand beach and turquoise water in Vietnam",
    title: "Coastal Paradise",
    subtitle: "Beautiful beaches await you"
  },
];

export default function Hero() {
  const t = useTranslations("hero");
  const [isMounted, setIsMounted] = useState(false);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isYoutubeMuted, setIsYoutubeMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [loading, setLoading] = useState(true);
  const youtubeIframesRef = useRef<Record<number, HTMLIFrameElement | null>>({});

  useEffect(() => {
    setIsMounted(true);
    fetchBanners();
  }, []);

  // Fetch banners from database
  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (response.ok) {
        const banners = await response.json();
        if (banners && banners.length > 0) {
          const formattedSlides: Slide[] = banners.map((banner: any) => {
            if (banner.type === 'image') {
              return {
                type: 'image',
                src: banner.image,
                alt: banner.alt,
                title: banner.title,
                subtitle: banner.subtitle
              };
            } else if (banner.type === 'video') {
              return {
                type: 'video',
                src: banner.videoUrl || '',
                poster: banner.poster || banner.image,
                alt: banner.alt,
                title: banner.title,
                subtitle: banner.subtitle
              };
            } else if (banner.type === 'youtube') {
              return {
                type: 'youtube',
                url: banner.youtubeUrl || '',
                poster: banner.poster || banner.image,
                title: banner.title,
                subtitle: banner.subtitle
              };
            }
            return null;
          }).filter(Boolean);
          
          setSlides(formattedSlides);
        }
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure autoplay behavior matches the active slide type on mount/when swiper is ready
  useEffect(() => {
    if (!swiper) return;
    const index = swiper.realIndex ?? 0;
    setActiveIndex(index);
    const active = slides[index];
    if (active?.type === "youtube") {
      swiper.autoplay?.stop();
    } else {
      swiper.autoplay?.start();
    }
  }, [swiper, slides]);

  // Add pause/play functionality
  const togglePlayPause = () => {
    if (swiper) {
      if (isPlaying) {
        swiper.autoplay?.stop();
        setIsPlaying(false);
      } else {
        swiper.autoplay?.start();
        setIsPlaying(true);
      }
    }
  };

  function extractYouTubeId(url: string): string | null {
    try {
      // Supports youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
      const shortMatch = url.match(/youtu\.be\/([\w-]{11})/);
      if (shortMatch?.[1]) return shortMatch[1];
      const embedMatch = url.match(/youtube\.com\/(?:embed|shorts)\/([\w-]{11})/);
      if (embedMatch?.[1]) return embedMatch[1];
      const watchMatch = url.match(/[?&]v=([\w-]{11})/);
      if (watchMatch?.[1]) return watchMatch[1];
      return null;
    } catch {
      return null;
    }
  }

  function getYouTubeEmbedSrc(slide: Slide): string | null {
    if (slide.type !== "youtube") return null;
    const id = slide.id || (slide.url ? extractYouTubeId(slide.url) : null);
    if (!id) return null;
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: id,
      controls: "0",
      showinfo: "0",
      rel: "0",
      modestbranding: "1",
      iv_load_policy: "3",
      fs: "0",
      start: slide.start?.toString() || "0",
      end: slide.end?.toString() || "",
    });
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <Navbar transparent />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải banner...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-inter-bold mb-6"
          >
            {slides[activeIndex]?.title || t("title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl font-inter-normal mb-8 text-gray-200"
          >
            {slides[activeIndex]?.subtitle || t("subtitle")}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/tours">{t("exploreButton")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-gray-900">
              <Link href="/contact">{t("contactButton")}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {isMounted ? (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            loop={true}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              const active = slides[swiper.realIndex];
              if (active?.type === "youtube") {
                swiper.autoplay?.stop();
              } else {
                swiper.autoplay?.start();
              }
            }}
            className="h-full"
          >
            {slides.map((s, i) => (
              <SwiperSlide key={i}>
                <div className="absolute inset-0 overflow-hidden">
                  {s.type === "video" ? (
                    <video
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                      src={s.src}
                      poster={s.poster}
                      playsInline
                      autoPlay
                      muted
                      loop
                      preload="auto"
                    />
                  ) : s.type === "youtube" ? (
                    getYouTubeEmbedSrc(s) ? (
                      <iframe
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full transform-gpu scale-[1.3]"
                        src={getYouTubeEmbedSrc(s) as string}
                        title={s.id || s.url || "YouTube video"}
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        allowFullScreen
                        loading="eager"
                        referrerPolicy="no-referrer-when-downgrade"
                        ref={(el) => {
                          youtubeIframesRef.current[i] = el;
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black" />
                    )
                  ) : (
                    <Image src={s.src} alt={s.alt} fill priority className="object-cover" />
                  )}
                  {s.type !== "video" && s.type !== "youtube" && (
                    <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
            style={{
              backgroundImage: slides[0]?.type === 'image' ? `url(${slides[0].src})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlayPause}
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Arrows */}
      {isMounted && swiper && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => swiper.slidePrev()}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => swiper.slideNext()}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}


