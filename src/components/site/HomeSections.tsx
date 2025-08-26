"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutSection() {
  const t = useTranslations("about");
  return (
    <section id="about" className="py-16 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Image src="/next.svg" alt="About Roving Vietnam Travel" width={640} height={400} className="rounded-lg border" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h2 className="text-2xl md:text-3xl font-bold">{t("title")}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("desc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// MustSee moved to components/site/MustSee.tsx

export function InstagramSection() {
  const t = useTranslations("share");
  type InstagramItem = {
    id: string;
    caption?: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;
    media_url: string;
    permalink: string;
    thumbnail_url?: string;
  };
  const [items, setItems] = useState<InstagramItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/instagram", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data?.items)) {
          setItems(data.items);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchMedia();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <section className="py-16 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t("title")}</h2>
          <Button asChild size="lg">
            <Link
              href="https://www.instagram.com/rovingvietnam.travel?igsh=OXNydWxubWNnb2Rk&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("cta")}
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {
            (
              (isLoading && items.length === 0)
                ? Array.from({ length: 8 }, () => null)
                : (items.slice(0, 8) as (InstagramItem | null)[])
            ).map((item, idx) => {
              if (item === null) {
                return <div key={idx} className="aspect-square bg-white/70 border rounded-lg animate-pulse" />;
              }
              const imageSrc = item.media_type === "VIDEO" ? item.thumbnail_url || item.media_url : item.media_url;
              const alt = item.caption || "Instagram post";
              return (
                <motion.a
                  key={item.id}
                  href={item.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="relative block aspect-square overflow-hidden rounded-lg border bg-white"
                  aria-label={alt}
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={alt}
                      fill
                      unoptimized
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </motion.a>
              );
            })
          }
        </div>
      </div>
    </section>
  );
}


