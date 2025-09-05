import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import { Link } from "@/i18n/routing";
import { getRegionLabel, getProvincesForRegion, getProvinceDisplayName, slugify, type RegionKey, type LocaleOption } from "@/lib/regions";
// Removed framer-motion to keep this server component pure
import { MapPin, Star, Compass, Mountain, Waves, Palmtree } from "lucide-react";
import { prisma } from "@/lib/prisma";

type Params = { params: { locale: string; region: "north" | "central" | "south" | "packages" } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, region } = await params;
  const titleMap = {
    north: getRegionLabel(locale as LocaleOption, "north"),
    central: getRegionLabel(locale as LocaleOption, "central"),
    south: getRegionLabel(locale as LocaleOption, "south"),
    packages: getRegionLabel(locale as LocaleOption, "packages"),
  } as Record<string, string>;
  return {
    title: `${titleMap[region] ?? (locale === "vi" ? "Khu vực" : "Region")} - Roving Vietnam Travel`,
    description: `Explore amazing destinations in ${titleMap[region] ?? "Vietnam"}. Discover culture, nature, and adventure.`,
  };
}

const getRegionIcon = (region: string) => {
  switch (region) {
    case 'north': return <Mountain className="h-6 w-6" />;
            case 'central': return <Waves className="h-6 w-6" />;
            case 'south': return <Palmtree className="h-6 w-6" />;
    default: return <Compass className="h-6 w-6" />;
  }
};

const getRegionColor = (region: string) => {
  switch (region) {
    case 'north': return 'from-blue-600 to-indigo-600';
    case 'central': return 'from-emerald-600 to-teal-600';
    case 'south': return 'from-orange-600 to-red-600';
    default: return 'from-purple-600 to-pink-600';
  }
};

const getRegionGradient = (region: string) => {
  switch (region) {
    case 'north': return 'from-blue-50 via-white to-indigo-50';
    case 'central': return 'from-emerald-50 via-white to-teal-50';
    case 'south': return 'from-orange-50 via-white to-red-50';
    default: return 'from-purple-50 via-white to-pink-50';
  }
};

// Fetch destinations from database
async function getDestinationsForRegion(regionKey: string) {
  try {
    const destinations = await prisma.destination.findMany({
      where: {
        Region: {
          key: regionKey
        }
      },
      include: {
        Region: true
      },
      orderBy: {
        order: 'asc'
      }
    });
    return destinations;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export default async function RegionPage({ params }: Params) {
  const { locale, region } = await params;
  const regionKey = region as RegionKey;
  
  // Get real destinations from database
  const destinations = await getDestinationsForRegion(regionKey);
  
  // Fallback to hardcoded data if no database destinations
  const fallbackList = getProvincesForRegion(regionKey);
  const list = destinations.length > 0 ? destinations : fallbackList;
  
  const heading = getRegionLabel(locale as LocaleOption, regionKey);
  
  return (
    <>
      <Navbar />
      <main className={`py-20 bg-gradient-to-br ${getRegionGradient(regionKey)} relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%2306b6d4&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
        
        <div className="mx-auto max-w-[1440px] px-6 relative">
          {/* Header Section */}
          <div
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getRegionColor(regionKey)} text-white px-6 py-3 rounded-full text-lg font-medium mb-6 shadow-lg`}>
              {getRegionIcon(regionKey)}
              {regionKey === 'packages' ? 'Travel Packages' : 
               regionKey === 'north' ? 'Northern Vietnam' :
               regionKey === 'central' ? 'Central Vietnam' : 'Southern Vietnam'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {heading}
            </h1>
            {regionKey === 'packages' ? (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
                {params.locale === 'vi' 
                  ? 'Chọn gói du lịch theo 3 khu vực: Miền Bắc, Miền Trung, Miền Nam. Mỗi khu vực có những đặc trưng riêng biệt và hấp dẫn.'
                  : 'Choose travel packages by North, Central, and South regions. Each region has its own unique characteristics and attractions.'
                }
              </p>
            ) : (
                          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === 'vi'
                ? `Khám phá những điểm đến tuyệt vời tại ${heading}. Từ văn hóa truyền thống đến cảnh quan thiên nhiên hùng vĩ.`
                : `Explore amazing destinations in ${heading}. From traditional culture to magnificent natural landscapes.`
              }
            </p>
            )}
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {list.map((item, index) => {
              // Handle both database destinations and fallback provinces
              const display = destinations.length > 0 
                ? (locale === "vi" ? item.nameVi : item.nameEn)
                : getProvinceDisplayName(locale as LocaleOption, item);
              
              const slug = destinations.length > 0 ? item.slug : slugify(display);
              const image = destinations.length > 0 ? item.image : item.image;
              const alt = destinations.length > 0 ? item.alt : item.alt;
              
              return (
                <div
                  key={destinations.length > 0 ? item.id : display}
                  className="group"
                >
                  <Link href={`/regions/${region}/${slug}`} className="block">
                    <div className="relative h-48 md:h-56 overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                      <Image 
                        src={image} 
                        alt={alt} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        sizes="(max-width:768px) 50vw, 25vw" 
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Region Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                          <MapPin className="h-3 w-3 text-blue-600" />
                          {regionKey === 'north' ? 'Miền Bắc' : 
                           regionKey === 'central' ? 'Miền Trung' : 'Miền Nam'}
                        </div>
                      </div>
                      
                      {/* Star Rating */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 bg-yellow-400/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 text-yellow-600 fill-current" />
                          <span className="text-xs font-bold text-yellow-800">5.0</span>
                        </div>
                      </div>
                      
                      {/* Destination/Province Name */}
                      <div className="absolute inset-0 flex items-end p-4">
                        <div className="text-center w-full">
                          <span className="text-white drop-shadow-2xl text-2xl md:text-3xl font-fs-playlist font-bold leading-tight block">
                            {display}
                          </span>
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/30">
                              Click to explore →
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover Effect Border */}
                      <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300`} />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div
            className="text-center mt-20"
          >
            <div className={`bg-gradient-to-r ${getRegionColor(regionKey)} rounded-2xl p-8 text-white`}>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {params.locale === 'vi' ? 'Sẵn sàng khám phá?' : 'Ready to Explore?'}
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                {locale === 'vi'
                  ? 'Liên hệ với chúng tôi để được tư vấn và lên kế hoạch chuyến đi hoàn hảo'
                  : 'Contact us for personalized travel advice and to plan your perfect trip'
                }
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                <Compass className="h-5 w-5" />
                {params.locale === 'vi' ? 'Liên hệ ngay' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


