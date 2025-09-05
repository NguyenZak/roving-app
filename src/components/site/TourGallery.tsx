'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Maximize2, 
  X,
  Play,
  Pause,
  Grid3X3,
  List,
  Download,
  Share2
} from 'lucide-react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay, EffectFade, Zoom, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';
import 'swiper/css/zoom';
import 'swiper/css/free-mode';

interface GalleryImage {
  id: string;
  imageUrl: string;
  alt?: string | null;
  caption?: string | null;
  order: number;
}

interface TourGalleryProps {
  images: GalleryImage[];
  title?: string;
}

const TourGallery: React.FC<TourGalleryProps> = ({ images, title = "Tour Gallery" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const fullscreenSwiperRef = useRef<SwiperType | null>(null);

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.activeIndex);
  };

  const goToSlide = (index: number) => {
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(index);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            fullscreenSwiperRef.current?.slidePrev();
            break;
          case 'ArrowRight':
            fullscreenSwiperRef.current?.slideNext();
            break;
          case 'Escape':
            toggleFullscreen();
            break;
          case ' ':
            e.preventDefault();
            togglePlay();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mt-8 overflow-hidden shadow-xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-white/80">
                      {images.length} {images.length === 1 ? 'photo' : 'photos'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {currentSlide + 1} of {images.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'carousel' : 'grid')}
                  className="flex items-center gap-2 bg-white/80 hover:bg-white"
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                  {viewMode === 'grid' ? 'List' : 'Grid'}
                </Button>
              </div>
            </div>
          </div>

          {viewMode === 'carousel' ? (
            /* Swiper Carousel View */
            <div className="relative">
              {/* Main Swiper */}
              <Swiper
                ref={mainSwiperRef}
                modules={[Navigation, Pagination, Thumbs, Autoplay, EffectFade, Zoom]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={true}
                pagination={{ 
                  clickable: true,
                  dynamicBullets: true,
                  renderBullet: (index, className) => {
                    return `<span class="${className} bg-blue-500"></span>`;
                  }
                }}
                autoplay={isPlaying ? {
                  delay: 3000,
                  disableOnInteraction: false,
                } : false}
                effect="fade"
                fadeEffect={{
                  crossFade: true
                }}
                zoom={{
                  maxRatio: 3,
                  minRatio: 1,
                }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                onSlideChange={handleSlideChange}
                className="main-swiper"
              >
                {sortedImages.map((image, index) => (
                  <SwiperSlide key={image.id} className="relative">
                    <div className="relative h-64 md:h-80 lg:h-96 bg-gray-100">
                      <div className="swiper-zoom-container">
                        <Image
                          src={image.imageUrl}
                          alt={image.alt || image.caption || 'Gallery image'}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                      
                      {/* Image Caption */}
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <p className="text-white text-sm font-medium">{image.caption}</p>
                        </div>
                      )}

                      {/* Overlay Controls */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={togglePlay}
                          className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleFullscreen}
                          className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Thumbnail Swiper */}
              <div className="p-4 bg-gray-50">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[FreeMode, Thumbs]}
                  spaceBetween={8}
                  slidesPerView="auto"
                  freeMode={true}
                  watchSlidesProgress={true}
                  className="thumbs-swiper"
                >
                  {sortedImages.map((image, index) => (
                    <SwiperSlide key={image.id} className="!w-16 !h-16">
                      <div 
                        className={`relative w-full h-full rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                          index === currentSlide
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => goToSlide(index)}
                      >
                        <Image
                          src={image.imageUrl}
                          alt={image.alt || ''}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      goToSlide(index);
                      setViewMode('carousel');
                    }}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={image.alt || image.caption || 'Gallery image'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Caption */}
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs truncate">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Modal with Swiper */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black gallery-fullscreen">
          <div className="relative w-full h-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Fullscreen Swiper */}
            <Swiper
              ref={fullscreenSwiperRef}
              modules={[Navigation, Pagination, Autoplay, Zoom]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={true}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                renderBullet: (index, className) => {
                  return `<span class="${className} bg-white"></span>`;
                }
              }}
              autoplay={isPlaying ? {
                delay: 3000,
                disableOnInteraction: false,
              } : false}
              zoom={{
                maxRatio: 5,
                minRatio: 1,
              }}
              initialSlide={currentSlide}
              className="fullscreen-swiper h-full"
            >
              {sortedImages.map((image, index) => (
                <SwiperSlide key={image.id} className="flex items-center justify-center">
                  <div className="relative max-w-7xl max-h-full mx-4">
                    <div className="swiper-zoom-container">
                      <Image
                        src={image.imageUrl}
                        alt={image.alt || image.caption || 'Gallery image'}
                        width={1200}
                        height={800}
                        className="max-w-full max-h-full object-contain"
                        priority={index === currentSlide}
                      />
                    </div>
                    
                    {/* Caption */}
                    {image.caption && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                        <p className="text-lg font-medium">{image.caption}</p>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Play/Pause Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 hover:bg-white/30 text-white"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TourGallery;
