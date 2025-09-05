import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Compass
} from "lucide-react";

type Params = { params: { locale: string; region: string; province: string } };

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  location: string;
  image: string;
  duration?: string | null;
  maxGroupSize?: number | null;
  minGroupSize?: number | null;
  difficulty?: string | null;
  category?: string | null;
  featured: boolean;
  highlights?: string[];
  tags?: string[];
  tourCode?: string | null;
  Destination?: {
    nameEn: string;
    Region?: {
      nameEn: string;
    };
  } | null;
}

interface Destination {
  id: string;
  nameEn: string;
  nameVi: string;
  slug: string;
  image: string;
  alt: string;
  description?: string | null;
  Region?: {
    key: string;
    nameEn: string;
    nameVi: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { province, region } = await params;
  const pretty = province.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return {
    title: `Tours in ${pretty} - ${region.charAt(0).toUpperCase() + region.slice(1)} Vietnam - Roving Vietnam Travel`,
    description: `Discover amazing tours and experiences in ${pretty}, ${region} Vietnam. Book your perfect adventure today.`,
  };
}

async function getDestination(region: string, province: string): Promise<Destination | null> {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    const destination = await prisma.destination.findFirst({
      where: {
        slug: province,
        Region: {
          key: region
        }
      },
      include: {
        Region: true
      }
    });
    
    return destination;
  } catch (error) {
    console.error('Error fetching destination:', error);
    return null;
  }
}

async function getToursByDestination(destinationId: string): Promise<Tour[]> {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    const tours = await prisma.tour.findMany({
      where: {
        destinationId: destinationId,
        status: "active"
      },
      include: {
        Destination: {
          include: {
            Region: true
          }
        }
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" }
      ]
    });
    
    return tours;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function DestinationToursPage({ params }: Params) {
  const { province, region, locale } = await params;
  const pretty = province.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  
  const destination = await getDestination(region, province);
  
  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-8">The destination you're looking for doesn't exist.</p>
          <Link href="/regions">
            <Button>Back to Regions</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const tours = await getToursByDestination(destination.id);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/regions" className="text-blue-600 hover:text-blue-800">
              Regions
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href={`/regions/${region}`} 
              className="text-blue-600 hover:text-blue-800"
            >
              {destination.Region?.nameEn}
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href={`/regions/${region}/${province}`} 
              className="text-blue-600 hover:text-blue-800"
            >
              {destination.nameEn}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Tours</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <Link 
                href={`/regions/${region}/${province}`}
                className="inline-flex items-center text-blue-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to {destination.nameEn}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Tours in {destination.nameEn}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
              Discover amazing experiences and adventures in {destination.nameEn}, {destination.Region?.nameEn} Vietnam
            </p>
            <div className="flex items-center gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-yellow-400" />
                <span>{tours.length} Tours Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Expert Guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Section */}
      <div className="container mx-auto px-4 py-12">
        {tours.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              No tours available for {destination.nameEn} at the moment.
            </div>
            <p className="text-gray-400 mb-8">
              Check back later or explore other destinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours">
                <Button variant="outline">View All Tours</Button>
              </Link>
              <Link href="/regions">
                <Button>Explore Regions</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Tours in {destination.nameEn}
              </h2>
              <p className="text-gray-600">
                Choose from {tours.length} carefully curated tour experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => (
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
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
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
                        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white transition-all duration-300">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Can't Find What You're Looking For?
                </h3>
                <p className="text-gray-600 mb-6">
                  We can create a custom tour experience just for you in {destination.nameEn}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Request Custom Tour
                  </Button>
                  <Link href="/tours">
                    <Button size="lg" variant="outline">
                      View All Tours
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
