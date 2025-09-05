import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

interface Params {
  params: { key: string };
}

export default async function EditRegionPage({ params }: Params) {
  try {
    const prisma = new PrismaClient();
    
    const region = await prisma.region.findUnique({
      where: { key: params.key }
    });

    // Close Prisma connection
    await prisma.$disconnect();

    if (!region) {
      notFound();
    }

    return (
      <AdminPageWrapper>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh Sửa Vùng</h1>
          <p className="text-gray-600">Cập nhật thông tin vùng miền</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Thông tin Vùng</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={`/api/admin/regions/${region.key}`} method="post">
              <input type="hidden" name="_method" value="PATCH" />
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="key">Mã vùng</Label>
                  <Input
                    id="key"
                    value={region.key}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500">
                    Mã vùng không thể thay đổi
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameVi">Tên tiếng Việt *</Label>
                    <Input
                      id="nameVi"
                      name="nameVi"
                      required
                      defaultValue={region.nameVi}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameEn">Tên tiếng Anh *</Label>
                    <Input
                      id="nameEn"
                      name="nameEn"
                      required
                      defaultValue={region.nameEn}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="descriptionVi">Mô tả tiếng Việt</Label>
                    <Textarea
                      id="descriptionVi"
                      name="descriptionVi"
                      placeholder="Mô tả về vùng miền..."
                      rows={4}
                      defaultValue={region.descriptionVi || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">Mô tả tiếng Anh</Label>
                    <Textarea
                      id="descriptionEn"
                      name="descriptionEn"
                      placeholder="Description of the region..."
                      rows={4}
                      defaultValue={region.descriptionEn || ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Hình ảnh</Label>
                  <Input
                    id="image"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    defaultValue={region.image || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    min="0"
                    defaultValue={region.order}
                  />
                  <p className="text-sm text-gray-500">
                    Số càng nhỏ càng hiển thị trước
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" asChild>
                    <a href="/admin/regions">Hủy</a>
                  </Button>
                  <Button type="submit">
                    Lưu Thay Đổi
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </AdminPageWrapper>
    );
  } catch (error) {
    console.error("❌ Error in EditRegionPage:", error);
    
    return (
      <AdminPageWrapper>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi khi tải dữ liệu</h1>
          <p className="text-gray-600 mb-4">Có lỗi xảy ra khi tải dữ liệu region</p>
          <pre className="text-sm text-gray-500 bg-gray-100 p-4 rounded overflow-auto">
            {String(error)}
          </pre>
        </div>
      </AdminPageWrapper>
    );
  }
}
