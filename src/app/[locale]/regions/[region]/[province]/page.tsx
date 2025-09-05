import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import { Link } from "@/i18n/routing";
import { slugify } from "@/lib/regions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar, DollarSign, ArrowRight, Compass, Clock, Users } from "lucide-react";

type Params = { params: { locale: string; region: string; province: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { province, region } = await params;
  const pretty = province.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return {
    title: `${pretty} - ${region.charAt(0).toUpperCase() + region.slice(1)} Vietnam - Roving Vietnam Travel`,
    description: `Discover amazing tours and attractions in ${pretty}, ${region} Vietnam. Book your perfect adventure today.`,
  };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

const getDifficultyColor = (difficulty: string | null) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColor = (category: string | null) => {
  switch (category) {
    case 'cultural': return 'bg-blue-100 text-blue-800';
    case 'adventure': return 'bg-orange-100 text-orange-800';
    case 'nature': return 'bg-green-100 text-green-800';
    case 'historical': return 'bg-purple-100 text-purple-800';
    case 'food': return 'bg-pink-100 text-pink-800';
    case 'photography': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default async function ProvincePage({ params }: Params) {
  const { province, region, locale } = await params;
  const pretty = province.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const provinceSlug = province;
  const normalizeSlug = (s: string) =>
    s
      .replace(/-(province|city)$/i, "")
      .replace(/^thanh-pho-/i, "")
      .replace(/^tinh-/i, "");
  const normalizedProvinceSlug = normalizeSlug(provinceSlug);

  // dynamic import prisma to avoid undefined in some envs
  const { prisma } = await import("@/lib/prisma");

  // First try to find destination by slug
  let destination = null;
  try {
    destination = await prisma.destination.findFirst({
      where: {
        slug: provinceSlug,
        Region: {
          key: region
        }
      },
      include: {
        Region: true
      }
    });
  } catch (error) {
    console.error('Error fetching destination:', error);
  }

  // If no destination found, try to find by name matching
  if (!destination) {
    try {
      const allDestinations = await prisma.destination.findMany({
        where: {
          Region: {
            key: region
          }
        },
        include: {
          Region: true
        }
      });
      
      destination = allDestinations.find(d => {
        const nameViSlug = slugify(d.nameVi);
        const nameEnSlug = slugify(d.nameEn);
        return nameViSlug === provinceSlug || nameEnSlug === provinceSlug;
      });
    } catch (error) {
      console.error('Error searching destinations:', error);
    }
  }

  // Find tours for this destination/location
  let provinceTours: Array<{
    id: string;
    slug: string;
    title: string;
    image: string;
    price: number;
    location: string;
    description: string;
    shortDescription?: string | null;
    duration?: string | null;
    maxGroupSize?: number | null;
    difficulty?: string | null;
    category?: string | null;
    featured: boolean;
    highlights?: string[];
    tags?: string[];
  }> = [];
  
  try {
    if (destination) {
      // Find tours by destination ID
      const tours = await prisma.tour.findMany({
        where: {
          destinationId: destination.id
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      
      provinceTours = tours.map(tour => ({
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        image: tour.image,
        price: tour.price,
        location: tour.location,
        description: tour.description,
        shortDescription: (tour as any).shortDescription || null,
        duration: (tour as any).duration || null,
        maxGroupSize: (tour as any).maxGroupSize || null,
        difficulty: (tour as any).difficulty || null,
        category: (tour as any).category || null,
        featured: (tour as any).featured || false,
        highlights: (tour as any).highlights || [],
        tags: (tour as any).tags || []
      }));
      
      console.log(`Found ${provinceTours.length} tours for destination ${destination.nameEn}`);
      console.log('Destination ID:', destination.id);
      console.log('Tours found:', provinceTours.map(t => ({ title: t.title, location: t.location })));
    } else {
      // Fallback: search by location matching province name
      const allTours = await prisma.tour.findMany({ 
        orderBy: {
          createdAt: "desc"
        }
      });
      
      const filteredTours = allTours.filter((t) => {
        const loc = (t.location || "").toLowerCase();
        const provinceName = pretty.toLowerCase();
        const normalizedProvince = normalizedProvinceSlug.toLowerCase();
        
        // Check if location contains province name or normalized slug
        return loc.includes(provinceName) || 
               loc.includes(normalizedProvince) ||
               slugify(loc).includes(normalizedProvince);
      });
      
      provinceTours = filteredTours.map(tour => ({
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        image: tour.image,
        price: tour.price,
        location: tour.location,
        description: tour.description,
        shortDescription: (tour as any).shortDescription || null,
        duration: (tour as any).duration || null,
        maxGroupSize: (tour as any).maxGroupSize || null,
        difficulty: (tour as any).difficulty || null,
        category: (tour as any).category || null,
        featured: (tour as any).featured || false,
        highlights: (tour as any).highlights || [],
        tags: (tour as any).tags || []
      }));
      
      console.log(`Found ${provinceTours.length} tours for province ${pretty} using location matching`);
      console.log('Province name:', pretty);
      console.log('Normalized province slug:', normalizedProvinceSlug);
      console.log('Tours found:', provinceTours.map(t => ({ title: t.title, location: t.location })));
    }
  } catch (error) {
    console.error('Error fetching tours:', error);
  }

  // Get display name
  const displayName = destination 
    ? (locale === 'vi' ? destination.nameVi : destination.nameEn)
    : pretty;

  // Debug logging
  console.log('=== PROVINCE PAGE DEBUG ===');
  console.log('Province slug:', province);
  console.log('Region:', region);
  console.log('Pretty name:', pretty);
  console.log('Destination found:', destination ? { id: destination.id, nameEn: destination.nameEn, nameVi: destination.nameVi } : 'None');
  console.log('Total tours found:', provinceTours.length);
  console.log('========================');

  return (
    <>
      <Navbar />
      <main className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%2306b6d4&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
        
        <div className="mx-auto max-w-[1440px] px-6 relative">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPin className="h-4 w-4" />
              {region.charAt(0).toUpperCase() + region.slice(1)} Vietnam
            </div>
            <h1 className="text-4xl md:text-5xl font-fs-playlist mb-6 text-gray-900">
              {displayName}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {locale === 'vi' 
                ? `Khám phá những điểm đến tuyệt vời và trải nghiệm văn hóa độc đáo tại ${displayName}`
                : `Discover amazing destinations and unique cultural experiences in ${displayName}`
              }
            </p>
          </div>

          {/* Destination Info Section */}
          {destination && (
            <section className="mb-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-64 md:h-80 overflow-hidden rounded-xl">
                    <Image 
                      src={destination.image} 
                      alt={destination.alt} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {locale === 'vi' ? 'Thông tin điểm đến' : 'Destination Information'}
                    </h2>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>{locale === 'vi' ? 'Tên:' : 'Name:'}</strong> {displayName}</p>
                      <p><strong>{locale === 'vi' ? 'Khu vực:' : 'Region:'}</strong> {locale === 'vi' ? destination.Region?.nameVi : destination.Region?.nameEn}</p>
                      {(locale === 'vi' ? (destination as any).descriptionVi : (destination as any).descriptionEn) && (
                        <p className="text-gray-700">
                          {(locale === 'vi' ? (destination as any).descriptionVi : (destination as any).descriptionEn) as string}
                        </p>
                      )}
                      {destination.isFeatured && (
                        <p className="text-blue-600 font-semibold">⭐ {locale === 'vi' ? 'Điểm đến nổi bật' : 'Featured Destination'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tours Section */}
          {provinceTours.length > 0 ? (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {locale === 'vi' ? 'Các Tour Tại' : 'Tours in'} {displayName}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                  {locale === 'vi'
                    ? `Tìm thấy ${provinceTours.length} tour tuyệt vời để khám phá ${displayName}`
                    : `Found ${provinceTours.length} amazing tours to explore ${displayName}`
                  }
                </p>
                <Link href={`/regions/${region}/${province}/tours`}>
                  <Button variant="outline" className="flex items-center gap-2 mx-auto">
                    {locale === 'vi' ? 'Xem tất cả tours' : 'View All Tours'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {provinceTours.map((tour) => (
                  <Card key={tour.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                    <div className="relative">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {tour.featured && (
                        <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <div className="absolute top-4 right-4">
                        {tour.difficulty && (
                          <Badge className={`${getDifficultyColor(tour.difficulty)} text-xs`}>
                            {tour.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-3">
                        {tour.category && (
                          <Badge className={`${getCategoryColor(tour.category)} text-xs mr-2`}>
                            {tour.category}
                          </Badge>
                        )}
                        {tour.tags?.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {tour.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {tour.shortDescription || tour.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{tour.location}</span>
                        </div>
                        {tour.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{tour.duration}</span>
                          </div>
                        )}
                        {tour.maxGroupSize && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Max {tour.maxGroupSize}</span>
                          </div>
                        )}
                      </div>
                      
                      {tour.highlights && tour.highlights.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Highlights:</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {tour.highlights.slice(0, 2).map((highlight, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                            {tour.highlights.length > 2 && (
                              <li className="text-blue-600 text-xs">
                                +{tour.highlights.length - 2} more highlights
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatPrice(tour.price)} ₫
                          </div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                        <Link href={`/tours/${tour.slug}`}>
                          <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-700 text-white transition-all duration-300">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : (
            <section className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
                <Compass className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === 'vi' ? 'Chưa có tour nào' : 'No Tours Available'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  {locale === 'vi'
                    ? `Hiện tại chưa có tour nào tại ${displayName}. Hãy liên hệ với chúng tôi để được tư vấn về các lựa chọn du lịch khác.`
                    : `Currently no tours available in ${displayName}. Contact us for advice on other travel options.`
                  }
                </p>
                <Link href="/contact">
                  <Button>
                    {locale === 'vi' ? 'Liên hệ tư vấn' : 'Contact for Advice'}
                  </Button>
                </Link>
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="text-center mt-20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {locale === 'vi' ? 'Sẵn sàng khám phá?' : 'Ready to Explore?'}
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                {locale === 'vi'
                  ? 'Liên hệ với chúng tôi để được tư vấn và lên kế hoạch chuyến đi hoàn hảo'
                  : 'Contact us for personalized travel advice and to plan your perfect trip'
                }
              </p>
              <Link href="/contact">
                <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-50">
                  <Compass className="mr-2 h-5 w-5" />
                  {locale === 'vi' ? 'Liên hệ ngay' : 'Contact Us'}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}


