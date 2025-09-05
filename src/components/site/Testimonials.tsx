"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Testimonial = {
  id: string;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  avatar?: string;
  tour?: string;
};

export default function Testimonials() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/testimonials', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setItems(data.testimonials || []);
        }
      } catch (e) {
        console.error('Failed to load testimonials', e);
      }
    }
    load();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="mx-auto max-w-[1440px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những trải nghiệm tuyệt vời và đánh giá chân thực từ khách hàng đã sử dụng dịch vụ của Roving Vietnam Travel
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative">
          <Swiper
            onSwiper={setSwiper}
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            className="testimonials-swiper"
          >
            {items.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <Quote className="h-8 w-8 text-blue-200 mb-3" />
                      
                      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                        "{testimonial.comment}"
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-500 text-xs">
                            {testimonial.location}
                          </p>
                          <p className="text-blue-600 text-xs font-medium mt-1">
                            {testimonial.tour}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="hidden md:block">
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white text-gray-900 hover:bg-white shadow hover:scale-110 transition-transform duration-200 w-12 h-12 flex items-center justify-center"
              onClick={() => swiper?.slidePrev()}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="hidden md:block">
            <button
              type="button"
              aria-label="Next"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white text-gray-900 hover:bg-white shadow hover:scale-110 transition-transform duration-200 w-12 h-12 flex items-center justify-center"
              onClick={() => swiper?.slideNext()}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Custom Pagination Styles */}
        <style jsx global>{`
          .testimonials-swiper .swiper-pagination {
            position: relative;
            margin-top: 2rem;
          }
          
          .testimonials-swiper .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #d1d5db;
            opacity: 1;
            transition: all 0.3s ease;
          }
          
          .testimonials-swiper .swiper-pagination-bullet-active {
            background: #3b82f6;
            transform: scale(1.2);
          }
        `}</style>
      </div>
    </section>
  );
}
