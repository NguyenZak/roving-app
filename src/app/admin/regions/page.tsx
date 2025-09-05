import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import RegionsClient from "./RegionsClient";

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

        <RegionsClient regions={regions} destinations={destinations} />

        {/* Empty State */}
        {regions.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có vùng nào</h3>
            <p className="text-gray-500 mb-4">Tạo vùng đầu tiên để bắt đầu quản lý destinations</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Vùng Đầu Tiên
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
