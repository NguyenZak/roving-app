"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function Transportation() {
  const t = useTranslations("transportation");
  const items = [
    {
      key: "plane",
      title: "Flights",
      desc: "Domestic and international routes to major cities.",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
      alt: "Airplane in the sky",
    },
    {
      key: "train",
      title: "Railway",
      desc: "Reunification Express along the coast of Vietnam.",
      image:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=1200&auto=format&fit=crop",
      alt: "Train passing through countryside",
    },
    {
      key: "bus",
      title: "Buses",
      desc: "Comfortable sleeper buses across regions and provinces.",
      image:
        "https://images.unsplash.com/photo-1502657877623-f66bf489d236?q=80&w=1200&auto=format&fit=crop",
      alt: "Bus on the road",
    },
    {
      key: "boat",
      title: "Boats",
      desc: "Cruises and ferries for islands and bays.",
      image:
        "https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=1200&auto=format&fit=crop",
      alt: "Boat at sea",
    },
  ] as const;

  return (
    <section id="transportation" className="py-16 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">{t("title")}</h2>
        <p className="text-muted-foreground text-center mb-8">{t("desc")}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <motion.div key={it.key} whileHover={{ scale: 1.02 }}>
              <Card className="relative overflow-hidden border rounded-lg shadow-sm h-48 md:h-64">
                <Image
                  src={it.image}
                  alt={it.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 flex items-end p-3">
                  <div className="text-white drop-shadow">
                    <div className="font-semibold">{it.title}</div>
                    <div className="text-xs opacity-90">{it.desc}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


