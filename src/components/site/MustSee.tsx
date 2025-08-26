"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import * as React from "react";
import {
  getProvincesForRegion,
  getProvinceDisplayName,
  type LocaleOption,
  slugify,
} from "@/lib/regions";

export default function MustSee() {
  const t = useTranslations("mustSee");
  const locale = useLocale() as LocaleOption;
  // Try to load featured destinations from CMS, fall back to static regions data
  // Note: fetch on client for simplicity; can be moved to server if needed
  const [featured, setFeatured] = React.useState<
    { region: string; nameVi: string; nameEn: string; image: string; alt: string; slug: string }[]
  >([]);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/destinations/featured", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data?.items)) setFeatured(data.items);
        }
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const combined =
    featured.length > 0
      ? featured.slice(0, 9).map((d) => ({ regionKey: d.region as "north" | "central" | "south", province: {
          nameVi: d.nameVi, nameEn: d.nameEn, image: d.image, alt: d.alt
        }}))
      : ([
          ["north", getProvincesForRegion("north")],
          ["central", getProvincesForRegion("central")],
          ["south", getProvincesForRegion("south")],
        ] as const)
          .flatMap(([regionKey, provinces]) => provinces.map((p) => ({ regionKey, province: p })))
          .slice(0, 9);

  return (
    <section id="must-see" className="py-16 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">{t("title")}</h2>
        <p className="text-muted-foreground text-center mb-12">{t("desc")}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {combined.map(({ regionKey, province }) => {
            const provinceSlug = slugify(province.nameEn);
            const label = getProvinceDisplayName(locale, province);
            return (
              <motion.div key={`${regionKey}-${province.nameEn}`} whileHover={{ scale: 1.02 }}>
                <Link href={`/regions/${regionKey}/${provinceSlug}`} className="block group" aria-label={label}>
                  <Card className="relative overflow-hidden border rounded-lg shadow-sm h-48 md:h-64">
                    <Image
                      src={province.image}
                      alt={province.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* centered overlay for place name */}
                    <div className="absolute inset-0 bg-black/25" />
                    <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                      <span className="text-white drop-shadow-md text-3xl md:text-4xl font-fs-playlist">
                        {label}
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


