import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

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
  difficulty?: string | null;
  category?: string | null;
  featured: boolean;
  highlights?: string[];
  tags?: string[];
  Destination?: {
    nameEn: string;
    Region?: {
      nameEn: string;
    };
  } | null;
}

async function getTours(): Promise<Tour[]> {
  try {
    const tours = await prisma.tour.findMany({
      where: {
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

export default async function ToursPage() {
  const tours = await getTours();

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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Amazing Tours
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Explore Vietnam's most beautiful destinations with our expert guides
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Expert Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-400" />
                <span>Small Groups</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span>Best Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Tours
          </h2>
          <p className="text-gray-600 text-lg">
            Handpicked experiences for unforgettable memories
          </p>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No tours available at the moment.
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact us to book your perfect tour or get a custom quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Contact Us
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Custom Tour
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}