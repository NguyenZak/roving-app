"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function LiveFully() {
  const t = useTranslations("live");
  const items = [
    {
      key: "north",
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop",
      alt: "Northern Vietnam scenery"
    },
    {
      key: "central",
      image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop",
      alt: "Central Vietnam ancient town"
    },
    {
      key: "south",
      image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop",
      alt: "Southern Vietnam palm beach"
    },
    {
      key: "packages",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
      alt: "Travel packages and experiences"
    }
  ] as const;
  return (
    <section id="live" className="py-16 bg-muted/40 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t("title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <motion.div key={it.key} whileHover={{ scale: 1.02 }}>
              <Link href={`/regions/${it.key}`} className="block group" aria-label={t(it.key)}>
                <Card className="relative overflow-hidden border rounded-lg shadow-sm h-48 md:h-64">
                  <Image
                    src={it.image}
                    alt={it.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


