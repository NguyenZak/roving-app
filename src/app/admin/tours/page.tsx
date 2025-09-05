"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, Waypoints, Search, Filter, Download, X } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import TourModal from "@/components/admin/TourModal";
import EditTourModal from "@/components/admin/EditTourModal";
import { useSafeToast } from "@/hooks/useSafeToast";

interface TourRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  image: string;
  destinationId: string | null;
  featured: boolean;
  status: string;
  duration?: string | null;
  maxGroupSize?: number | null;
  difficulty?: string | null;
  category?: string | null;
  
  // NEW FIELDS
  tourCode?: string | null;
  shortDescription?: string | null;
  departurePoint?: string | null;
  returnPoint?: string | null;
  minGroupSize?: number | null;
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
  
  Destination?: {
    id: string;
    nameEn: string;
    nameVi: string;
    Region?: {
      nameEn: string;
    };
  } | null;
  [key: string]: unknown;
}

export default function AdminToursPage() {
  const [items, setItems] = useState<TourRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [destinations, setDestinations] = useState<Array<{id: string, nameEn: string, Region?: {nameEn: string}}>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourRow | null>(null);

  const { showToast } = useSafeToast();

  const load = useCallback(async (p = page, ps = pageSize, search = searchTerm, destination = destinationFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: p.toString(),
        pageSize: ps.toString(),
        ...(search && { search }),
        ...(destination && { destination })
      });
      
      const res = await fetch(`/api/admin/tours?${params}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setItems(Array.isArray(data.items) ? data.items : []);
        setTotal(Number(data.total || 0));
      } else {
        showToast({
          title: "Lỗi tải dữ liệu",
          description: data?.error || "Không thể tải danh sách tour",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch {
      showToast({
        title: "Lỗi mạng",
        description: "Lỗi kết nối khi tải dữ liệu",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm, destinationFilter]);

  const loadDestinations = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/destinations', { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setDestinations(Array.isArray(data.items) ? data.items : []);
      }
    } catch {
      // Ignore error for destinations
    }
  }, []);

  useEffect(() => {
    load();
    loadDestinations();
  }, [load, loadDestinations]);

  const handleSearch = () => {
    setPage(1);
    load(1, pageSize, searchTerm, destinationFilter);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDestinationFilter("all");
    setPage(1);
    load(1, pageSize, "", "all");
  };

  async function handleDelete(id: string) {
    if (!confirm("Delete tour?")) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== id));
    try {
      const fd = new FormData();
      fd.append("_method", "DELETE");
      const res = await fetch(`/api/admin/tours/${id}`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Delete failed");
      showToast({
        title: "Xóa thành công",
        description: "Tour đã được xóa thành công",
        variant: "success",
        duration: 3000
      });
      load(page, pageSize);
    } catch {
      showToast({
        title: "Lỗi xóa",
        description: "Không thể xóa tour",
        variant: "destructive",
        duration: 5000
      });
      setItems(prev);
    }
  }

  const handleEditTour = (tour: TourRow) => {
    setSelectedTour(tour);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedTour(null);
  };

  const handleEditSuccess = () => {
    load(page, pageSize);
  };

  if (loading) return (
    <AdminPageWrapper>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500 font-medium">Loading tours...</div>
        </div>
      </div>
    </AdminPageWrapper>
  );

  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tours Management</h1>
            <p className="text-gray-600">Create, edit, and manage your tour packages and itineraries.</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Tour
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Tours</p>
                <p className="text-2xl font-bold text-blue-900">{total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                <Waypoints className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Active Tours</p>
                <p className="text-2xl font-bold text-green-900">{Math.floor(total * 0.8)}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                <Waypoints className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Featured</p>
                <p className="text-2xl font-bold text-purple-900">12</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                <Waypoints className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Draft</p>
                <p className="text-2xl font-bold text-orange-900">3</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                <Waypoints className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Tours</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Destination</label>
              <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All destinations</SelectItem>
                  {destinations.map((destination) => (
                    <SelectItem key={destination.id} value={destination.id}>
                      {destination.nameEn} ({destination.Region?.nameEn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="h-11 px-6">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="h-11 px-6"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tours Table Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-8 pb-6 px-8 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <Waypoints className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">All Tours</div>
              <div className="text-sm font-normal text-gray-600 mt-1">Manage tour packages and itineraries</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <DataTable<TourRow>
            rows={items}
            initialSortKey="title"
            serverPaging
            total={total}
            onPageChange={(p)=>{ setPage(p); load(p, pageSize); }}
            onPageSizeChange={(ps)=>{ setPageSize(ps); setPage(1); load(1, ps); }}
            columns={[
              { 
                key: "image", 
                header: "Image", 
                sortable: false,
                className: "w-20",
                render: (tour) => (
                  <div className="flex items-center justify-center">
                    {tour.image ? (
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                )
              },
              { 
                key: "title", 
                header: "Tour Title", 
                sortable: true,
                render: (tour) => (
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {tour.title}
                      {tour.featured && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {tour.duration && <span>{tour.duration}</span>}
                      {tour.duration && tour.difficulty && <span> • </span>}
                      {tour.difficulty && <span className="capitalize">{tour.difficulty}</span>}
                    </div>
                  </div>
                )
              },
              { 
                key: "slug", 
                header: "Slug", 
                sortable: true,
                render: (tour) => (
                  <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                    {tour.slug}
                  </div>
                )
              },
              { 
                key: "price", 
                header: "Price", 
                sortable: true,
                render: (tour) => (
                  <div className="font-semibold text-green-600">
                    {new Intl.NumberFormat('vi-VN').format(Number(tour.price ?? 0))} ₫
                  </div>
                )
              },
              { 
                key: "location", 
                header: "Location", 
                sortable: true,
                render: (tour) => (
                  <div className="text-gray-700">{tour.location}</div>
                )
              },
              { 
                key: "destination", 
                header: "Destination", 
                sortable: false,
                render: (tour) => (
                  <div className="text-sm">
                    {tour.Destination ? (
                      <div>
                        <div className="font-medium text-gray-900">{tour.Destination.nameEn}</div>
                        <div className="text-gray-500">{tour.Destination.Region?.nameEn}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Not linked</span>
                    )}
                  </div>
                )
              },
              { 
                key: "status", 
                header: "Status", 
                sortable: true,
                render: (tour) => (
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tour.status === 'active' ? 'bg-green-100 text-green-800' :
                      tour.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tour.status}
                    </span>
                    {tour.category && (
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {tour.category}
                      </div>
                    )}
                  </div>
                )
              },
              {
                key: "actions",
                header: "Actions",
                className: "text-right",
                render: (t) => (
                  <div className="inline-flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-medium border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleEditTour(t)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(String(t.id))}
                      className="font-medium text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Tour Modal */}
      <TourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          load(page, pageSize, searchTerm, destinationFilter);
        }}
      />

      {/* Edit Tour Modal */}
      <EditTourModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditSuccess}
        tour={selectedTour}
      />
    </AdminPageWrapper>
  );
}


