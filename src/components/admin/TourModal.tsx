"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Save, X } from "lucide-react";
import UnifiedImageUpload from "./UnifiedImageUpload";
import { useSafeToast } from "@/hooks/useSafeToast";

interface Destination {
  id: string;
  nameEn: string;
  Region?: {
    nameEn: string;
  };
}

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TourModal({ isOpen, onClose, onSuccess }: TourModalProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { showToast } = useSafeToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
    destinationId: "none",
    duration: "",
    maxGroupSize: "",
    difficulty: "none",
    category: "none",
    status: "active",
    featured: false,
    
    // NEW FIELDS - Basic Info
    tourCode: "",
    shortDescription: "",
    departurePoint: "",
    returnPoint: "",
    minGroupSize: "",
    ageRestriction: "",
    
    // NEW FIELDS - Detailed Info
    itinerary: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
    transportation: "",
    accommodation: "",
    guide: "",
    
    // NEW FIELDS - Additional Info
    whatToBring: "",
    physicalReq: "",
    cancellationPolicy: "",
    weatherPolicy: "",
    
    // NEW FIELDS - SEO & Marketing
    metaDescription: "",
    keywords: "",
    tags: "",
    gallery: [] as string[]
  });

  useEffect(() => {
    if (isOpen) {
      loadDestinations();
    }
  }, [isOpen]);

  const loadDestinations = async () => {
    try {
      const res = await fetch('/api/admin/destinations', { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setDestinations(Array.isArray(data.items) ? data.items : []);
      }
    } catch {
      // Ignore error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'featured') {
          form.append(key, value.toString());
        } else if (key === 'gallery') {
          // Convert gallery URLs to gallery objects with proper structure
          const galleryData = (value as string[]).map((url, index) => ({
            imageUrl: url,
            alt: null,
            caption: null,
            order: index
          }));
          form.append(key, JSON.stringify(galleryData));
        } else if (typeof value === 'boolean') {
          form.append(key, value.toString());
        } else {
          form.append(key, value as string);
        }
      });

      const res = await fetch('/api/admin/tours', {
        method: 'POST',
        body: form
      });

      const result = await res.json();
      
      if (result.ok) {
        showToast({
          title: "Tạo tour thành công",
          description: "Tour mới đã được tạo thành công",
          variant: "success",
          duration: 3000
        });
        onSuccess();
        onClose();
        resetForm();
      } else {
        showToast({
          title: "Lỗi tạo tour",
          description: result.error || 'Không thể tạo tour mới',
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      showToast({
        title: "Lỗi mạng",
        description: 'Lỗi kết nối khi tạo tour',
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      image: "",
      destinationId: "none",
      duration: "",
      maxGroupSize: "",
      difficulty: "none",
      category: "none",
      status: "active",
      featured: false,
      
      // NEW FIELDS - Basic Info
      tourCode: "",
      shortDescription: "",
      departurePoint: "",
      returnPoint: "",
      minGroupSize: "",
      ageRestriction: "",
      
      // NEW FIELDS - Detailed Info
      itinerary: "",
      highlights: "",
      inclusions: "",
      exclusions: "",
      transportation: "",
      accommodation: "",
      guide: "",
      
      // NEW FIELDS - Additional Info
      whatToBring: "",
      physicalReq: "",
      cancellationPolicy: "",
      weatherPolicy: "",
      
      // NEW FIELDS - SEO & Marketing
      metaDescription: "",
      keywords: "",
      tags: "",
      gallery: [] as string[]
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto mx-4 my-8 p-0 bg-white shadow-2xl border-0 rounded-xl">
        <div className="p-8">
          <DialogHeader className="mb-8 pb-6 border-b border-gray-100">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Create New Tour</div>
                <div className="text-sm font-normal text-gray-600 mt-1">Add a new tour package to your collection</div>
              </div>
            </DialogTitle>
          </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-blue-500 to-transparent flex-1"></div>
              <h3 className="text-lg font-semibold text-gray-800 px-4">Basic Information</h3>
              <div className="h-px bg-gradient-to-l from-blue-500 to-transparent flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                Tour Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Hanoi Old Quarter Walking Tour"
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tourCode" className="text-sm font-semibold text-gray-700">
                Tour Code
              </Label>
              <Input
                id="tourCode"
                value={formData.tourCode}
                onChange={(e) => setFormData({...formData, tourCode: e.target.value})}
                placeholder="e.g., HAN-001"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                Price (VNĐ) *
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="e.g., 1500000"
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-sm font-semibold text-gray-700">
                Short Description
              </Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                placeholder="Brief description for listings"
                className="h-11"
              />
            </div>
          </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the tour experience, highlights, and what makes it special..."
              rows={4}
              required
              className="resize-none"
            />
          </div>

          {/* Location & Destination Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-green-500 to-transparent flex-1"></div>
              <h3 className="text-lg font-semibold text-gray-800 px-4">Location & Destination</h3>
              <div className="h-px bg-gradient-to-l from-green-500 to-transparent flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Hanoi, Vietnam"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationId" className="text-sm font-semibold text-gray-700">
                Link to Destination
              </Label>
              <Select value={formData.destinationId} onValueChange={(value) => setFormData({...formData, destinationId: value})}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a destination (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No destination linked</SelectItem>
                  {destinations.map((destination) => (
                    <SelectItem key={destination.id} value={destination.id}>
                      {destination.nameEn} ({destination.Region?.nameEn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          </div>

          {/* Tour Details Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-purple-500 to-transparent flex-1"></div>
              <h3 className="text-lg font-semibold text-gray-800 px-4">Tour Details</h3>
              <div className="h-px bg-gradient-to-l from-purple-500 to-transparent flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-semibold text-gray-700">
                Duration
              </Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g., 3 days, Half day"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGroupSize" className="text-sm font-semibold text-gray-700">
                Max Group Size
              </Label>
              <Input
                id="maxGroupSize"
                type="number"
                value={formData.maxGroupSize}
                onChange={(e) => setFormData({...formData, maxGroupSize: e.target.value})}
                placeholder="e.g., 12"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-sm font-semibold text-gray-700">
                Difficulty
              </Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          </div>

          {/* Category & Status Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-orange-500 to-transparent flex-1"></div>
              <h3 className="text-lg font-semibold text-gray-800 px-4">Category & Status</h3>
              <div className="h-px bg-gradient-to-l from-orange-500 to-transparent flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="food">Food & Culinary</SelectItem>
                  <SelectItem value="history">History & Heritage</SelectItem>
                  <SelectItem value="relaxation">Relaxation</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          </div>

          {/* Detailed Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-green-500 to-transparent flex-1"></div>
              <h3 className="text-lg font-semibold text-gray-800 px-4">Detailed Information</h3>
              <div className="h-px bg-gradient-to-l from-green-500 to-transparent flex-1"></div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departurePoint" className="text-sm font-semibold text-gray-700">
                    Departure Point
                  </Label>
                  <Input
                    id="departurePoint"
                    value={formData.departurePoint}
                    onChange={(e) => setFormData({...formData, departurePoint: e.target.value})}
                    placeholder="e.g., Hanoi Opera House"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="returnPoint" className="text-sm font-semibold text-gray-700">
                    Return Point
                  </Label>
                  <Input
                    id="returnPoint"
                    value={formData.returnPoint}
                    onChange={(e) => setFormData({...formData, returnPoint: e.target.value})}
                    placeholder="e.g., Same as departure"
                    className="h-11"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itinerary" className="text-sm font-semibold text-gray-700">
                  Itinerary
                </Label>
                <Textarea
                  id="itinerary"
                  value={formData.itinerary}
                  onChange={(e) => setFormData({...formData, itinerary: e.target.value})}
                  placeholder="Day 1: Arrival and city tour&#10;Day 2: Temple visits and local markets&#10;Day 3: Departure"
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="highlights" className="text-sm font-semibold text-gray-700">
                  Highlights (one per line)
                </Label>
                <Textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                  placeholder="Visit Hoan Kiem Lake&#10;Explore Old Quarter&#10;Try local street food"
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inclusions" className="text-sm font-semibold text-gray-700">
                    Inclusions (one per line)
                  </Label>
                  <Textarea
                    id="inclusions"
                    value={formData.inclusions}
                    onChange={(e) => setFormData({...formData, inclusions: e.target.value})}
                    placeholder="Professional guide&#10;Transportation&#10;Entrance fees"
                    rows={3}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exclusions" className="text-sm font-semibold text-gray-700">
                    Exclusions (one per line)
                  </Label>
                  <Textarea
                    id="exclusions"
                    value={formData.exclusions}
                    onChange={(e) => setFormData({...formData, exclusions: e.target.value})}
                    placeholder="Personal expenses&#10;Tips&#10;Optional activities"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="transportation" className="text-sm font-semibold text-gray-700">
                    Transportation
                  </Label>
                  <Input
                    id="transportation"
                    value={formData.transportation}
                    onChange={(e) => setFormData({...formData, transportation: e.target.value})}
                    placeholder="e.g., Air-conditioned bus"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accommodation" className="text-sm font-semibold text-gray-700">
                    Accommodation
                  </Label>
                  <Input
                    id="accommodation"
                    value={formData.accommodation}
                    onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
                    placeholder="e.g., 3-star hotel"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guide" className="text-sm font-semibold text-gray-700">
                    Guide
                  </Label>
                  <Input
                    id="guide"
                    value={formData.guide}
                    onChange={(e) => setFormData({...formData, guide: e.target.value})}
                    placeholder="e.g., English speaking guide"
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-purple-500 to-transparent flex-1"></div>
              <h3 className="text-lg font-semibold text-gray-800 px-4">Additional Information</h3>
              <div className="h-px bg-gradient-to-l from-purple-500 to-transparent flex-1"></div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minGroupSize" className="text-sm font-semibold text-gray-700">
                    Minimum Group Size
                  </Label>
                  <Input
                    id="minGroupSize"
                    type="number"
                    value={formData.minGroupSize}
                    onChange={(e) => setFormData({...formData, minGroupSize: e.target.value})}
                    placeholder="e.g., 2"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ageRestriction" className="text-sm font-semibold text-gray-700">
                    Age Restriction
                  </Label>
                  <Input
                    id="ageRestriction"
                    value={formData.ageRestriction}
                    onChange={(e) => setFormData({...formData, ageRestriction: e.target.value})}
                    placeholder="e.g., 12+ years"
                    className="h-11"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatToBring" className="text-sm font-semibold text-gray-700">
                  What to Bring (one per line)
                </Label>
                <Textarea
                  id="whatToBring"
                  value={formData.whatToBring}
                  onChange={(e) => setFormData({...formData, whatToBring: e.target.value})}
                  placeholder="Comfortable walking shoes&#10;Camera&#10;Sun hat"
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="physicalReq" className="text-sm font-semibold text-gray-700">
                  Physical Requirements
                </Label>
                <Input
                  id="physicalReq"
                  value={formData.physicalReq}
                  onChange={(e) => setFormData({...formData, physicalReq: e.target.value})}
                  placeholder="e.g., Moderate walking required"
                  className="h-11"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy" className="text-sm font-semibold text-gray-700">
                    Cancellation Policy
                  </Label>
                  <Textarea
                    id="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={(e) => setFormData({...formData, cancellationPolicy: e.target.value})}
                    placeholder="Free cancellation up to 24 hours before tour"
                    rows={2}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weatherPolicy" className="text-sm font-semibold text-gray-700">
                    Weather Policy
                  </Label>
                  <Textarea
                    id="weatherPolicy"
                    value={formData.weatherPolicy}
                    onChange={(e) => setFormData({...formData, weatherPolicy: e.target.value})}
                    placeholder="Tour operates in all weather conditions"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO & Marketing Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-orange-500 to-transparent flex-1"></div>
              <h3 className="text-lg font-semibold text-gray-800 px-4">SEO & Marketing</h3>
              <div className="h-px bg-gradient-to-l from-orange-500 to-transparent flex-1"></div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-sm font-semibold text-gray-700">
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                  placeholder="SEO description for search engines (max 160 characters)"
                  rows={2}
                  className="resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-sm font-semibold text-gray-700">
                    Keywords (comma separated)
                  </Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    placeholder="hanoi tour, old quarter, vietnam travel"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">
                    Tags (comma separated)
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="cultural, walking, historical"
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Featured & Image Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-pink-500 to-transparent flex-1"></div>
              <h3 className="text-lg font-semibold text-gray-800 px-4">Featured & Media</h3>
              <div className="h-px bg-gradient-to-l from-pink-500 to-transparent flex-1"></div>
            </div>
            <div className="space-y-6">
            <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                Featured Tour
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              Featured tours will be highlighted on the homepage and in search results
            </p>
          </div>

          <UnifiedImageUpload
            label="Tour Image"
            value={formData.image}
            onChange={(url) => setFormData({...formData, image: url})}
            required
          />

          <UnifiedImageUpload
            label="Gallery Images"
            images={formData.gallery}
            onImagesChange={(gallery) => setFormData({...formData, gallery})}
            multiple={true}
            maxFiles={10}
          />
          </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose} className="px-6 py-2">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Creating..." : "Create Tour"}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
