import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewAreaPage() {
  return (
    <AdminPageWrapper>
      <div className="mb-8 items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm khu vực</h1>
        <p className="text-gray-600">Tạo mới khu vực (key phải là north/central/south hoặc tuỳ chỉnh duy nhất)</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Thông tin khu vực</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/admin/areas" method="post" className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Key</label>
              <input name="key" required className="w-full border rounded px-3 py-2" placeholder="north | central | south" />
            </div>
            <div>
              <label className="block text-sm mb-1">Tên (VI)</label>
              <input name="nameVi" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Name (EN)</label>
              <input name="nameEn" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Mô tả (VI)</label>
              <textarea name="descriptionVi" rows={4} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Description (EN)</label>
              <textarea name="descriptionEn" rows={4} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Image URL</label>
              <input name="image" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Thứ tự</label>
              <input type="number" name="order" defaultValue={0} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <button className="px-4 py-2 border rounded bg-primary text-primary-foreground">Tạo</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}


