import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Calendar,
  Shield,
  Heart
} from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import TourGallery from "@/components/site/TourGallery";

interface TourDetail {
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
  tourCode?: string | null;
  departurePoint?: string | null;
  returnPoint?: string | null;
  ageRestriction?: string | null;
  itinerary?: string | null;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  transportation?: string | null;
  accommodation?: string | null;
  guide?: string | null;
  whatToBring?: string[];
  physicalReq?: string | null;
  cancellationPolicy?: string | null;
  weatherPolicy?: string | null;
  metaDescription?: string | null;
  keywords?: string[];
  tags?: string[];
  gallery?: string[];
  galleries?: {
    id: string;
    imageUrl: string;
    alt?: string | null;
    caption?: string | null;
    order: number;
  }[];
  Destination?: {
    nameEn: string;
    Region?: {
      nameEn: string;
    };
  } | null;
}

async function getTourBySlug(slug: string): Promise<TourDetail | null> {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        slug: slug,
        status: "active"
      },
      include: {
        Destination: {
          include: {
            Region: true
          }
        },
        galleries: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    return tour;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

async function getRelatedTours(currentTourId: string, category?: string | null, limit: number = 3): Promise<TourDetail[]> {
  try {
    const tours = await prisma.tour.findMany({
      where: {
        id: { not: currentTourId },
        status: "active",
        ...(category && { category })
      },
      include: {
        Destination: {
          include: {
            Region: true
          }
        }
      },
      take: limit,
      orderBy: { featured: "desc" }
    });
    
    return tours;
  } catch (error) {
    console.error('Error fetching related tours:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  
  if (!tour) {
    return {
      title: 'Tour Not Found - Roving Vietnam Travel',
      description: 'The tour you are looking for does not exist.'
    };
  }

  return {
    title: `${tour.title} - Roving Vietnam Travel`,
    description: tour.metaDescription || tour.shortDescription || tour.description,
    keywords: tour.keywords?.join(', '),
  };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  
  if (!tour) {
    notFound();
  }

  const relatedTours = await getRelatedTours(tour.id, tour.category);

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
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/tours" className="inline-flex items-center text-violet-600 hover:text-violet-800 transition-colors duration-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tours
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover"
                />
                {tour.featured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  {tour.difficulty && (
                    <Badge className={`${getDifficultyColor(tour.difficulty)}`}>
                      {tour.difficulty}
                    </Badge>
                  )}
                  {tour.category && (
                    <Badge className={`${getCategoryColor(tour.category)}`}>
                      {tour.category}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  {tour.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {tour.title}
                </h1>
                
                <p className="text-lg text-gray-600 mb-6">
                  {tour.shortDescription || tour.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-gray-600">{tour.location}</div>
                    </div>
                  </div>
                  
                  {tour.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">Duration</div>
                        <div className="text-gray-600">{tour.duration}</div>
                      </div>
                    </div>
                  )}
                  
                  {tour.maxGroupSize && (
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">Group Size</div>
                        <div className="text-gray-600">
                          {tour.minGroupSize && `${tour.minGroupSize}-`}{tour.maxGroupSize} people
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {tour.ageRestriction && (
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">Age Restriction</div>
                        <div className="text-gray-600">{tour.ageRestriction}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tour Gallery */}
            {tour.galleries && tour.galleries.length > 0 && (
              <TourGallery 
                images={tour.galleries} 
                title={`${tour.title} Gallery`}
              />
            )}

            {/* Detailed Information */}
            <div className="mt-8 space-y-8">
              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                    <ul className="space-y-3">
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Itinerary */}
              {tour.itinerary && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary</h2>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                        {tour.itinerary}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tour.inclusions && tour.inclusions.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {tour.inclusions.map((inclusion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{inclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {tour.exclusions && tour.exclusions.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {tour.exclusions.map((exclusion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{exclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tour.transportation && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Transportation</h3>
                      <p className="text-gray-700">{tour.transportation}</p>
                    </CardContent>
                  </Card>
                )}

                {tour.accommodation && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Accommodation</h3>
                      <p className="text-gray-700">{tour.accommodation}</p>
                    </CardContent>
                  </Card>
                )}

                {tour.guide && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Guide</h3>
                      <p className="text-gray-700">{tour.guide}</p>
                    </CardContent>
                  </Card>
                )}

                {tour.physicalReq && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Physical Requirements</h3>
                      <p className="text-gray-700">{tour.physicalReq}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* What to Bring */}
              {tour.whatToBring && tour.whatToBring.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Bring</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tour.whatToBring.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Policies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tour.cancellationPolicy && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Cancellation Policy</h3>
                      <p className="text-gray-700 text-sm">{tour.cancellationPolicy}</p>
                    </CardContent>
                  </Card>
                )}

                {tour.weatherPolicy && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Weather Policy</h3>
                      <p className="text-gray-700 text-sm">{tour.weatherPolicy}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Booking Card */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {formatPrice(tour.price)} ₫
                    </div>
                    <div className="text-gray-600">per person</div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4" size="lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>
                  
                  <Button variant="outline" className="w-full mb-4">
                    <Heart className="h-5 w-5 mr-2" />
                    Add to Wishlist
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500">
                    <div className="mb-2">Need help?</div>
                    <Button variant="link" className="text-blue-600 p-0 h-auto">
                      Contact Us
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tour Code */}
              {tour.tourCode && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">Tour Code</h3>
                    <div className="text-lg font-mono bg-gray-100 p-2 rounded text-center">
                      {tour.tourCode}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Departure Info */}
              {(tour.departurePoint || tour.returnPoint) && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Departure Information</h3>
                    {tour.departurePoint && (
                      <div className="mb-3">
                        <div className="text-sm font-semibold text-gray-700">Departure Point</div>
                        <div className="text-gray-600">{tour.departurePoint}</div>
                      </div>
                    )}
                    {tour.returnPoint && (
          <div>
                        <div className="text-sm font-semibold text-gray-700">Return Point</div>
                        <div className="text-gray-600">{tour.returnPoint}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTours.map((relatedTour) => (
                <Card key={relatedTour.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <Image
                      src={relatedTour.image}
                      alt={relatedTour.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relatedTour.featured && (
                      <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedTour.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedTour.shortDescription || relatedTour.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(relatedTour.price)} ₫
                      </div>
                      <Link href={`/tours/${relatedTour.slug}`}>
                        <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white transition-all duration-300">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}