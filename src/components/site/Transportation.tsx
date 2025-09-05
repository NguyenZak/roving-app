"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Tag as TagIcon, CalendarDays, MessageSquare, Share2, ChevronLeft, ChevronRight } from "lucide-react";

export default function Transportation() {
  const t = useTranslations("transportation");
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const items = [
    {
      key: "plane",
      title: "Flights",
      desc: "Domestic and international routes to major cities.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
      alt: "Airplane in the sky",
      tags: ["air", "fast"],
      date: "02.10.25",
      comments: 3,
    },
    {
      key: "train",
      title: "Railway",
      desc: "Reunification Express along the coast of Vietnam.",
      image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=1200&auto=format&fit=crop",
      alt: "Train passing through countryside",
      tags: ["rail", "scenic"],
      date: "01.28.25",
      comments: 1,
    },
    {
      key: "bus",
      title: "Buses",
      desc: "Comfortable sleeper buses across regions and provinces.",
      image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236?q=80&w=1200&auto=format&fit=crop",
      alt: "Bus on the road",
      tags: ["budget", "overnight"],
      date: "12.22.24",
      comments: 2,
    },
    {
      key: "boat",
      title: "Boats",
      desc: "Cruises and ferries for islands and bays.",
      image: "https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=1200&auto=format&fit=crop",
      alt: "Boat at sea",
      tags: ["islands", "ferry"],
      date: "11.05.24",
      comments: 0,
    },
  ] as const;

  return (
    <section id="transportation" className="py-16 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">{t("title")}</h2>
        <p className="text-muted-foreground text-center mb-8">{t("desc")}</p>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={16}
            pagination={{ clickable: true }}
            breakpoints={{ 0: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            onSwiper={(s) => setSwiper(s)}
          >
            {items.map((it) => (
              <SwiperSlide key={it.key}>
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={`/transportation/${it.key}`} className="block h-full">
                    <Card className="h-[420px] md:h-[440px] overflow-hidden">
                      <div className="relative h-64">
                        <Image src={it.image} alt={it.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 33vw" />
                      </div>
                      <CardHeader className="px-4 pb-2">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <TagIcon className="h-4 w-4" aria-hidden />
                          {it.tags.map((t) => (
                            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs">#{t}</span>
                          ))}
                        </div>
                        <CardTitle className="text-xl leading-tight mt-2">{it.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-muted-foreground px-4 pt-0 pb-4">
                        <p className="leading-relaxed line-clamp-3">{it.desc}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" aria-hidden />
                            <span>{it.date}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center gap-1"><MessageSquare className="h-4 w-4" aria-hidden />{it.comments}</span>
                            <span className="inline-flex items-center gap-1"><Share2 className="h-4 w-4" aria-hidden />Share</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="hidden md:block">
            <Button
              type="button"
              size="icon"
              aria-label="Previous"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white text-gray-900 hover:bg-white shadow hidden md:inline-flex"
              onClick={() => swiper?.slidePrev()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="hidden md:block">
            <Button
              type="button"
              size="icon"
              aria-label="Next"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white text-gray-900 hover:bg-white shadow hidden md:inline-flex"
              onClick={() => swiper?.slideNext()}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


