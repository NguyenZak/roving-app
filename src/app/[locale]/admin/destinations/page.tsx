import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const items = await prisma.destination.findMany({ orderBy: [{ createdAt: "desc" }] });
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Destinations</h1>
        <Link href="/admin/destinations/new" className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-muted">New</Link>
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2">Name (EN)</th>
              <th className="text-left p-2">Region</th>
              <th className="text-left p-2">Featured</th>
              <th className="text-left p-2">Order</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.nameEn}</td>
                <td className="p-2 capitalize">{d.region}</td>
                <td className="p-2">{d.isFeatured ? "Yes" : "No"}</td>
                <td className="p-2">{d.order}</td>
                <td className="p-2 text-right">
                  <div className="inline-flex gap-2">
                    <Link href={`/admin/destinations/${d.id}`} className="px-2 py-1 border rounded hover:bg-muted">Edit</Link>
                    <form action={`/admin/destinations/${d.id}/delete`} method="post" onSubmit={(e) => {
                      if (!confirm("Delete destination?")) e.preventDefault();
                    }}>
                      <button className="px-2 py-1 border rounded hover:bg-destructive/10 text-destructive" type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


