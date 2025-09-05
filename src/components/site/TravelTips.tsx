"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag as TagIcon, MessageSquare, CalendarDays, ChevronLeft, ChevronRight, BookOpen, Star, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const tips = [
  {
    id: 1,
    title: "Best Time to Visit Vietnam",
    content: "North: Oct–Apr (cool, dry), Central: Feb–Aug (beach season), South: Nov–Apr (dry season). Plan your trip around these optimal weather windows.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1200&auto=format&fit=crop",
    tags: ["planning", "seasons", "weather"],
    date: "2024-04-23",
    comments: 12,
    readTime: "3 min read",
    difficulty: "Beginner",
    category: "Planning"
  },
  {
    id: 2,
    title: "Currency & Payment Guide",
    content: "VND is the official currency. Cards accepted in cities, but carry cash for rural areas. ATMs widely available. Best rates at banks.",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop",
    tags: ["money", "payments", "finance"],
    date: "2024-05-16",
    comments: 8,
    readTime: "2 min read",
    difficulty: "Beginner",
    category: "Finance"
  },
  {
    id: 3,
    title: "Internet & Connectivity",
    content: "Buy local eSIM/SIM for reliable 4G. Viettel, Vinaphone, Mobifone are major providers. Free WiFi in cafes and hotels.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    tags: ["internet", "sim", "connectivity"],
    date: "2024-07-01",
    comments: 15,
    readTime: "4 min read",
    difficulty: "Intermediate",
    category: "Technology"
  },
  {
    id: 4,
    title: "Health & Safety Tips",
    content: "Use sunscreen, stay hydrated, beware of traffic. Get travel insurance. Vaccinations recommended. Street food is generally safe.",
    image: "https://images.unsplash.com/photo-1551829142-5d4ca02c0f9b?q=80&w=1200&auto=format&fit=crop",
    tags: ["health", "safety", "wellness"],
    date: "2024-08-12",
    comments: 23,
    readTime: "5 min read",
    difficulty: "Beginner",
    category: "Health"
  },
  {
    id: 5,
    title: "Cultural Etiquette",
    content: "Dress modestly at temples, remove shoes when required. Respect local customs. Learn basic Vietnamese phrases. Be patient and polite.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    tags: ["culture", "etiquette", "respect"],
    date: "2024-09-03",
    comments: 18,
    readTime: "4 min read",
    difficulty: "Intermediate",
    category: "Culture"
  },
  {
    id: 6,
    title: "Transportation Apps",
    content: "Grab for rides and food delivery. Be for motorbike taxis. Google Maps works well. Download offline maps for rural areas.",
    image: "https://images.unsplash.com/photo-1511397051536-5a93f14f56b5?q=80&w=1200&auto=format&fit=crop",
    tags: ["transport", "apps", "technology"],
    date: "2024-10-19",
    comments: 31,
    readTime: "3 min read",
    difficulty: "Beginner",
    category: "Transport"
  }
] as const;

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner": return "bg-green-100 text-green-800";
    case "Intermediate": return "bg-yellow-100 text-yellow-800";
    case "Advanced": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Planning": return <CalendarDays className="h-4 w-4" />;
    case "Finance": return <TrendingUp className="h-4 w-4" />;
    case "Technology": return <BookOpen className="h-4 w-4" />;
    case "Health": return <Star className="h-4 w-4" />;
    case "Culture": return <BookOpen className="h-4 w-4" />;
    case "Transport": return <TrendingUp className="h-4 w-4" />;
    default: return <BookOpen className="h-4 w-4" />;
  }
};

export default function TravelTips() {
  const t = useTranslations("tips");
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const filteredTips = selectedCategory === "all" 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const categories = ["all", ...Array.from(new Set(tips.map(tip => tip.category)))];

  return (
    <section id="travel-tips" className="py-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%2306b6d4&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
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
            <BookOpen className="h-4 w-4" />
            Travel Knowledge Base
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Essential Travel Tips for Vietnam
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover insider knowledge, cultural insights, and practical advice to make your Vietnam adventure unforgettable
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category === "all" ? "All Tips" : category}
            </button>
          ))}
        </motion.div>

        {/* Tips Carousel */}
        <div className="relative overflow-hidden max-w-full">
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true, el: '.swiper-pagination' }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            onSwiper={setSwiper}
            onSlideChange={handleSlideChange}
            className="overflow-hidden"
          >
            {filteredTips.map((tip, index) => (
              <SwiperSlide key={tip.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Link href={`/tips/${tip.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="block h-full">
                    <Card className="h-full overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                      {/* Image Section */}
                      <div className="relative h-64 overflow-hidden">
                        <Image 
                          src={tip.image} 
                          alt={tip.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                          {getCategoryIcon(tip.category)}
                          {tip.category}
                        </div>
                        
                        {/* Difficulty Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                          {tip.difficulty}
                        </div>
                      </div>

                      {/* Content Section */}
                      <CardHeader className="px-6 pb-3">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {tip.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                          {tip.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-6 pt-0 pb-6">
                        <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                          {tip.content}
                        </p>
                        
                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{tip.readTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{tip.comments}</span>
                            </div>
                          </div>
                          <div className="text-xs">
                            {new Date(tip.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="hidden lg:block">
            <Button
              type="button"
              size="icon"
              aria-label="Previous tip"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              onClick={() => swiper?.slidePrev()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              aria-label="Next tip"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              onClick={() => swiper?.slideNext()}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Custom Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {filteredTips.map((_, index) => (
              <button
                key={index}
                onClick={() => swiper?.slideTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-blue-600 scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Go to tip ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/tips">
              View All Travel Tips
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}


