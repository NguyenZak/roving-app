"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MapPin, Star, ArrowRight } from "lucide-react";

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

interface DestinationsGridProps {
  regionKey?: string;
  limit?: number;
  showRegion?: boolean;
}

export default function DestinationsGrid({ regionKey, limit, showRegion = true }: DestinationsGridProps) {
  const t = useTranslations("Destinations");
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/destinations");
        if (res.ok) {
          const data = await res.json();
          let filteredDestinations = data.items || [];
          
          // Filter by region if specified
          if (regionKey) {
            filteredDestinations = filteredDestinations.filter(
              (d: Destination) => d.Region?.key === regionKey
            );
          }
          
          // Sort by featured and order
          filteredDestinations.sort((a: Destination, b: Destination) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return a.order - b.order;
          });
          
          // Apply limit if specified
          if (limit) {
            filteredDestinations = filteredDestinations.slice(0, limit);
          }
          
          setDestinations(filteredDestinations);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [regionKey, limit]);

  const handleDestinationClick = (regionKey: string, destinationSlug: string) => {
    router.push(`/regions/${regionKey}/${destinationSlug}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-6 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noDestinations")}
        </h3>
        <p className="text-gray-500">
          {t("noDestinationsDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <Card
          key={destination.id}
          className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
          onClick={() => handleDestinationClick(destination.Region?.key || "north", destination.slug)}
        >
          <CardHeader className="p-0">
            <div className="relative overflow-hidden">
              <img
                src={destination.image}
                alt={destination.alt || destination.nameVi}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                {destination.isFeatured && (
                  <Badge className="bg-yellow-500 text-white border-0 text-xs px-2 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    {t("featured")}
                  </Badge>
                )}
              </div>
              {showRegion && destination.Region && (
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="bg-blue-600 text-white border-0 text-xs px-2 py-1">
                    {destination.Region.nameEn}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              {destination.nameVi}
            </CardTitle>
            <p className="text-gray-600 mb-4 text-sm">
              {destination.nameEn}
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-700 transition-all duration-300"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleDestinationClick(destination.Region?.key || "north", destination.slug);
              }}
            >
              {t("exploreButton")}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
