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
import { MapPin, Star, Compass } from "lucide-react";

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
    <section id="must-see" className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%2306b6d4&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      
      <div className="mx-auto max-w-[1440px] px-6 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Compass className="h-4 w-4" />
            Must Visit Destinations
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Must See in Vietnam
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the most breathtaking and culturally rich destinations that make Vietnam truly unforgettable
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {combined.map(({ regionKey, province }, index) => {
            const provinceSlug = slugify(province.nameEn);
            const label = getProvinceDisplayName(locale, province);
            
            return (
              <motion.div 
                key={`${regionKey}-${province.nameEn}`} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link href={`/regions/${regionKey}/${provinceSlug}`} className="block" aria-label={label}>
                  <Card className="relative overflow-hidden border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-48 md:h-64 bg-white/80 backdrop-blur-sm">
                    {/* Image */}
                    <Image
                      src={province.image}
                      alt={province.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Region Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        <MapPin className="h-3 w-3 text-blue-600" />
                        {regionKey === 'north' ? 'Miền Bắc' : regionKey === 'central' ? 'Miền Trung' : 'Miền Nam'}
                      </div>
                    </div>
                    
                    {/* Star Rating */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-yellow-400/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-yellow-600 fill-current" />
                        <span className="text-xs font-bold text-yellow-800">5.0</span>
                      </div>
                    </div>
                    
                    {/* Place Name */}
                    <div className="absolute inset-0 flex items-end p-6">
                      <div className="text-center w-full">
                        <span className="text-white drop-shadow-2xl text-2xl md:text-3xl font-fs-playlist font-bold leading-tight block">
                          {label}
                        </span>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/30">
                            Click to explore →
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300" />
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Compass className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Explore All Destinations
            <span className="text-sm opacity-80">→</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


