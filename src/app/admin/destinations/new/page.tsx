export default async function NewDestinationPage() {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    const regions = await prisma.region.findMany({ orderBy: [{ order: "asc" }, { nameEn: "asc" }] });
    
    return (
      <div className="p-4 max-w-xl">
        <h1 className="text-xl font-semibold mb-4">Create Destination</h1>
        <form action="/api/admin/destinations" method="post" className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Region</label>
            <select name="regionId" className="w-full border rounded px-3 py-2" required>
              <option value="">-- Select Region --</option>
              {regions.map(r => (
                <option key={r.id} value={r.id}>{r.nameEn} ({r.nameVi})</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Chọn vùng miền cho destination này</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Name (VI)</label>
            <input name="nameVi" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Name (EN)</label>
            <input name="nameEn" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Image URL</label>
            <input name="image" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Alt</label>
            <input name="alt" className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" /> Featured</label>
            <div className="flex items-center gap-2">
              <label className="text-sm">Order</label>
              <input type="number" name="order" defaultValue={0} className="w-24 border rounded px-2 py-1" />
            </div>
          </div>
          <button className="px-4 py-2 border rounded bg-primary text-primary-foreground">Save</button>
        </form>
      </div>
    );
  } catch (error) {
    console.error("❌ Error in NewDestinationPage:", error);
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
        <pre className="text-sm text-gray-500 bg-gray-100 p-4 rounded overflow-auto">
          {String(error)}
        </pre>
      </div>
    );
  }
}


