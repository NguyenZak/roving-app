"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Heart, MapPin, Star, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Region {
  key: string;
  nameEn: string;
  nameVi: string;
  image: string;
}

interface Destination {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  image: string;
  alt: string;
  isFeatured: boolean;
  order: number;
  region: string;
  Region?: {
    key: string;
    nameEn: string;
    nameVi: string;
  };
}

export default function LiveFully() {
  const t = useTranslations("live");
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch regions
        const regionsRes = await fetch("/api/regions");
        if (regionsRes.ok) {
          const regionsData = await regionsRes.json();
          setRegions(regionsData.items || []);
        }


      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="live" className="py-20 bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-6 relative">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-12 rounded-lg mb-6 w-1/3 mx-auto"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 md:h-64 rounded-2xl mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Create live items from regions and add packages
  const liveItems = [
    ...regions.map(region => ({
      key: region.key,
      image: region.image,
      alt: region.nameVi,
      title: region.nameVi,
      subtitle: region.nameEn,
      type: 'region' as const
    })),
    {
      key: 'packages',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      alt: 'Travel Packages',
      title: 'Travel Packages',
      subtitle: 'Curated Tours',
      type: 'packages' as const
    }
  ];

  return (
    <section id="live" className="py-20 bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ec4899&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      
      <div className="mx-auto max-w-[1440px] px-6 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            Experience Vietnam
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Live Fully in Vietnam
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in the vibrant culture, breathtaking landscapes, and unforgettable experiences that Vietnam has to offer
          </p>
        </motion.div>

        {/* Live Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {liveItems.map((item, index) => (
            <motion.div 
              key={item.key} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link href={item.type === 'packages' ? '/regions/packages' : `/regions/${item.key}`} className="block" aria-label={item.title}>
                <Card className="relative overflow-hidden border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-48 md:h-64 bg-white/80 backdrop-blur-sm">
                  {/* Image */}
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      <MapPin className="h-3 w-3 text-rose-600" />
                      {item.type === 'region' ? `${item.subtitle} Vietnam` : 'Featured Destination'}
                    </div>
                  </div>
                  
                  {/* Experience Rating */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-rose-400/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 text-white fill-current" />
                      <span className="text-xs font-bold text-white">5★</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/90">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          {item.type === 'packages' ? 'Explore All' :
                           item.key === 'north' ? 'Hanoi, Sapa, Ha Long' :
                           item.key === 'central' ? 'Hue, Hoi An, Da Nang' : 'Ho Chi Minh, Mekong Delta'
                          }
                        </span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-white/90 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link 
            href="/regions/packages"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore All Packages
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


