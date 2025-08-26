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
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt?: string }
  | {
      type: "youtube";
      id?: string; // e.g., "dQw4w9WgXcQ"
      url?: string; // e.g., "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      start?: number;
      end?: number;
      poster?: string;
    };

const slides: Slide[] = [
  {
    type: "youtube",
    url: "https://www.youtube.com/watch?v=Au6LqK1UH8g",
    poster: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2000&auto=format&fit=crop",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop",
    alt: "Ha Long Bay limestone karsts at sunset",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2000&auto=format&fit=crop",
    alt: "Hoi An lantern street at night",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000&auto=format&fit=crop",
    alt: "Sand beach and turquoise water in Vietnam",
  },
];

export default function Hero() {
  const t = useTranslations("hero");
  const [isMounted, setIsMounted] = useState(false);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isYoutubeMuted, setIsYoutubeMuted] = useState(true);
  const youtubeIframesRef = useRef<Record<number, HTMLIFrameElement | null>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  }, [swiper]);

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

  function getYouTubeEmbedSrc(s: Extract<Slide, { type: "youtube" }>): string | null {
    const videoId = s.id ?? (s.url ? extractYouTubeId(s.url) : null);
    if (!videoId) return null;
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      showinfo: "0",
      loop: "1",
      playlist: videoId,
      enablejsapi: "1",
    });
    if (s.start !== undefined) params.set("start", String(s.start));
    if (s.end !== undefined) params.set("end", String(s.end));
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  function toggleYouTubeMute() {
    const frame = youtubeIframesRef.current[activeIndex];
    if (!frame || !frame.contentWindow) return;
    const action = isYoutubeMuted ? "unMute" : "mute";
    frame.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: action, args: [] }),
      "https://www.youtube.com"
    );
    setIsYoutubeMuted(!isYoutubeMuted);
  }

  // When switching to a YouTube slide, ensure autoplay (muted) and reflect UI
  useEffect(() => {
    const active = slides[activeIndex];
    if (active?.type === "youtube") {
      setIsYoutubeMuted(true);
      const frame = youtubeIframesRef.current[activeIndex];
      if (frame?.contentWindow) {
        // Mute first to allow autoplay, then play
        frame.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "mute", args: [] }),
          "https://www.youtube.com"
        );
        frame.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: [] }),
          "https://www.youtube.com"
        );
      }
    }
  }, [activeIndex]);

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Navbar transparent />
      <div className="absolute inset-0 -z-10">
        {isMounted ? (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            autoplay={{ delay: 15000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            effect="fade"
            loop
            className="h-full w-full"
            onSwiper={(s) => {
              setSwiper(s);
              setActiveIndex(s.realIndex ?? 0);
            }}
            onSlideChange={(instance) => {
              const s = instance as SwiperType;
              const index = s.realIndex ?? 0;
              setActiveIndex(index);
              const active = slides[index];
              if (active?.type === "youtube") {
                s.autoplay?.stop();
                const frame = youtubeIframesRef.current[index];
                if (frame?.contentWindow) {
                  frame.contentWindow.postMessage(
                    JSON.stringify({ event: "command", func: "mute", args: [] }),
                    "https://www.youtube.com"
                  );
                  frame.contentWindow.postMessage(
                    JSON.stringify({ event: "command", func: "playVideo", args: [] }),
                    "https://www.youtube.com"
                  );
                }
              } else {
                s.autoplay?.start();
              }
            }}
          >
            {slides.map((s, i) => (
              <SwiperSlide key={i}>
                <div className="absolute inset-0">
                  {s.type === "video" ? (
                    <video
                      className="h-full w-full object-cover"
                      src={s.src}
                      poster={s.poster}
                      playsInline
                      autoPlay
                      muted
                      loop
                    />
                  ) : s.type === "youtube" ? (
                    getYouTubeEmbedSrc(s) ? (
                      <iframe
                        className="h-full w-full object-cover"
                        src={getYouTubeEmbedSrc(s) as string}
                        title={s.id || s.url || "YouTube video"}
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        ref={(el) => {
                          youtubeIframesRef.current[i] = el;
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-black" />
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
          <div className="absolute inset-0">
            {slides[0]?.type === "video" ? (
              <video
                className="h-full w-full object-cover"
                src={slides[0].src}
                poster={slides[0].poster}
                playsInline
                autoPlay
                muted
                loop
              />
            ) : slides[0]?.type === "youtube" ? (
              getYouTubeEmbedSrc(slides[0]) ? (
                <iframe
                  className="h-full w-full object-cover"
                  src={getYouTubeEmbedSrc(slides[0]) as string}
                  title={slides[0].id || slides[0].url || "YouTube video"}
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  ref={(el) => {
                    youtubeIframesRef.current[0] = el;
                  }}
                />
              ) : (
                <div className="h-full w-full bg-black" />
              )
            ) : (
              <Image src={(slides[0] as Extract<Slide, { type: "image" }>).src} alt={(slides[0] as Extract<Slide, { type: "image" }>).alt} fill priority className="object-cover" />
            )}
            {slides[0]?.type !== "video" && slides[0]?.type !== "youtube" && (
              <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
            )}
          </div>
        )}
      </div>
      {/* Prev / Next controls */}
      <Button
        type="button"
        size="icon"
        aria-label="Previous slide"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 text-gray-900 hover:bg-white shadow"
        onClick={() => swiper?.slidePrev()}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      {slides[activeIndex]?.type === "youtube" && (
        <Button
          type="button"
          size="icon"
          aria-label={isYoutubeMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          className="absolute left-3 bottom-3 z-10 rounded-full bg-white/80 text-gray-900 hover:bg-white shadow"
          onClick={toggleYouTubeMute}
        >
          {isYoutubeMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      )}
      <Button
        type="button"
        size="icon"
        aria-label="Next slide"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 text-gray-900 hover:bg-white shadow"
        onClick={() => swiper?.slideNext()}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      {slides[activeIndex]?.type !== "youtube" && (
        <div className="mx-auto max-w-5xl px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-6xl font-extrabold tracking-tight"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-4 text-base md:text-xl text-white/90"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8"
          >
            <Button asChild size="lg" className="shadow hover:shadow-lg">
              <Link href="/tours">{t("cta")}</Link>
            </Button>
          </motion.div>
        </div>
      )}
    </section>
  );
}


