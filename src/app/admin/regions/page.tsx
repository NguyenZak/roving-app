import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MapPin, Building2, Users } from "lucide-react";
import { PrismaClient } from "@prisma/client";

interface Region {
  id: string;
  key: string;
  nameVi: string;
  nameEn: string;
  descriptionVi?: string | null;
  descriptionEn?: string | null;
  image?: string | null;
  order: number;
  _count: {
    Destinations: number;
  };
}

interface Destination {
  id: string;
  nameVi: string;
  nameEn: string;
  image: string;
  slug: string;
  isFeatured: boolean;
  order: number;
}

export default async function RegionsPage() {
  try {
    // Create Prisma client directly
    const prisma = new PrismaClient();
    
    // Fetch data directly on server
    const [regions, destinations] = await Promise.all([
      prisma.region.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: {
          _count: {
            select: { Destinations: true }
          }
        }
      }),
      prisma.destination.findMany({
        select: {
          id: true,
          nameVi: true,
          nameEn: true,
          image: true,
          slug: true,
          isFeatured: true,
          order: true,
          region: true
        }
      })
    ]);

    // Close Prisma connection
    await prisma.$disconnect();

    const getDestinationsForRegion = (regionKey: string) => {
      return destinations.filter(dest => dest.region === regionKey);
    };

    return (
      <AdminPageWrapper>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Vùng</h1>
              <p className="text-gray-600">Quản lý các vùng miền Bắc, Trung, Nam và destinations thuộc mỗi vùng</p>
            </div>
            <Button asChild>
              <a href="/admin/regions/new">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Vùng
              </a>
            </Button>
          </div>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions.map((region) => {
            const regionDestinations = getDestinationsForRegion(region.key);
            const featuredDestinations = regionDestinations.filter(d => d.isFeatured).slice(0, 3);
            
            return (
              <Card key={region.key} className="overflow-hidden">
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {region.image ? (
                    <img
                      src={region.image}
                      alt={region.nameEn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      #{region.order}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {region.nameVi}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{region.nameEn}</p>
                    {region.descriptionVi && (
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {region.descriptionVi}
                      </p>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{regionDestinations.length} tỉnh</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{regionDestinations.filter(d => d.isFeatured).length} nổi bật</span>
                      </div>
                    </div>

                    {/* Featured Destinations */}
                    {featuredDestinations.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Destinations nổi bật:</p>
                        <div className="flex flex-wrap gap-1">
                          {featuredDestinations.map((dest) => (
                            <span
                              key={dest.id}
                              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {dest.nameVi}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <a href={`/admin/regions/${region.key}/edit`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Sửa
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {regions.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có vùng nào</h3>
            <p className="text-gray-500 mb-4">Tạo vùng đầu tiên để bắt đầu quản lý destinations</p>
            <Button asChild>
              <a href="/admin/regions/new">
                <Plus className="h-4 w-4 mr-2" />
                Tạo Vùng Đầu Tiên
              </a>
            </Button>
          </div>
        )}
      </AdminPageWrapper>
    );
  } catch (error) {
    console.error("❌ Error in RegionsPage:", error);
    
    return (
      <AdminPageWrapper>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi khi tải dữ liệu</h1>
          <p className="text-gray-600 mb-4">Có lỗi xảy ra khi tải dữ liệu regions</p>
          <pre className="text-sm text-gray-500 bg-gray-100 p-4 rounded overflow-auto">
            {String(error)}
          </pre>
        </div>
      </AdminPageWrapper>
    );
  }
}
