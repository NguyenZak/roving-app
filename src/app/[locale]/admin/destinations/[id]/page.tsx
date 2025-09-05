import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export default async function EditDestinationPage({ params }: Params) {
  const d = await prisma.destination.findUnique({ where: { id: params.id } });
  if (!d) return <div className="p-4">Not found</div>;
  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Edit Destination</h1>
      <form action={`/api/admin/destinations/${d.id}`} method="post">
        <input type="hidden" name="_method" value="PATCH" />
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Region</label>
            <select name="region" className="w-full border rounded px-3 py-2" defaultValue={d.region}>
              <option value="north">North</option>
              <option value="central">Central</option>
              <option value="south">South</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Name (VI)</label>
            <input name="nameVi" className="w-full border rounded px-3 py-2" defaultValue={d.nameVi} />
          </div>
          <div>
            <label className="block text-sm mb-1">Name (EN)</label>
            <input name="nameEn" className="w-full border rounded px-3 py-2" defaultValue={d.nameEn} />
          </div>
          <div>
            <label className="block text-sm mb-1">Image URL</label>
            <input name="image" className="w-full border rounded px-3 py-2" defaultValue={d.image} />
          </div>
          <div>
            <label className="block text-sm mb-1">Alt</label>
            <input name="alt" className="w-full border rounded px-3 py-2" defaultValue={d.alt} />
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" defaultChecked={d.isFeatured} /> Featured</label>
            <div className="flex items-center gap-2">
              <label className="text-sm">Order</label>
              <input type="number" name="order" defaultValue={d.order} className="w-24 border rounded px-2 py-1" />
            </div>
          </div>
          <button className="px-4 py-2 border rounded bg-primary text-primary-foreground">Save</button>
        </div>
      </form>
      <form action={`/api/admin/destinations/${d.id}`} method="post" className="mt-6" onSubmit={(e) => { if (!confirm('Delete destination?')) e.preventDefault(); }}>
        <input type="hidden" name="_method" value="DELETE" />
        <button className="px-4 py-2 border rounded text-destructive hover:bg-destructive/10">Delete</button>
      </form>
    </div>
  );
}



