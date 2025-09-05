import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewRegionPage() {
  return (
    <AdminPageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm Vùng Mới</h1>
        <p className="text-gray-600">Tạo vùng miền mới để quản lý destinations</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Thông tin Vùng</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/admin/regions" method="post" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="key">Mã vùng *</Label>
              <Input
                id="key"
                name="key"
                required
                placeholder="north, central, south"
              />
              <p className="text-sm text-gray-500">
                Mã duy nhất để định danh vùng (ví dụ: north, central, south)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameVi">Tên tiếng Việt *</Label>
                <Input
                  id="nameVi"
                  name="nameVi"
                  required
                  placeholder="Miền Bắc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">Tên tiếng Anh *</Label>
                <Input
                  id="nameEn"
                  name="nameEn"
                  required
                  placeholder="North"
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Mô tả tiếng Anh</Label>
                <Textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  placeholder="Description of the region..."
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Hình ảnh</Label>
              <Input
                id="image"
                name="image"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Thứ tự hiển thị</Label>
              <Input
                id="order"
                name="order"
                type="number"
                defaultValue="0"
                min="0"
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
                Tạo Vùng
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}
