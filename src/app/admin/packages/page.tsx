"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

interface PackageRow {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  priceFrom: number;
  durationDays: number;
  image: string;
  featured: boolean;
  createdAt: string;
  [key: string]: unknown;
}

export default function AdminPackagesPage() {
  const [rows, setRows] = useState<PackageRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  async function fetchRows() {
    const res = await fetch(`/api/admin/packages?page=${page}&pageSize=${pageSize}`);
    if (res.ok) {
      const data = await res.json();
      setRows(data.items ?? []);
      setTotal(data.total ?? 0);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this package?")) return;
    const form = new FormData();
    form.set("_method", "DELETE");
    const res = await fetch(`/api/admin/packages/${id}`, { method: "POST", body: form });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const columns: { key: keyof PackageRow | string; header: string; className?: string; sortable?: boolean; render?: (row: PackageRow) => React.ReactNode }[] = [
    { key: "title", header: "Title", sortable: true },
    { key: "slug", header: "Slug", sortable: true },
    {
      key: "priceFrom",
      header: "Price From",
      sortable: true,
      render: (row) => (
        <span className="font-inter-medium text-green-600">
          ${Number(row.priceFrom).toLocaleString()}
        </span>
      ),
    },
    {
      key: "durationDays",
      header: "Duration",
      sortable: true,
      render: (row) => (
        <span className="font-inter-medium text-blue-600">
          {row.durationDays} days
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-inter-medium ${
          row.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {row.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-500 font-inter-normal">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/packages/${row.id}/edit`}>
            <Button variant="outline" size="sm" className="font-inter-medium">
              <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => remove(row.id)}
            className="font-inter-medium text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div>
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Tour Packages</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">Manage tour packages and itineraries.</p>
        </div>
        <Link href="/admin/packages/new">
          <Button className="px-6 py-3 font-inter-medium">
            <Plus className="h-4 w-4 mr-2" />
            New Package
          </Button>
        </Link>
      </div>

      {/* Packages Table Card */}
      <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100">
              <Package className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-inter-bold text-gray-900">All Packages</div>
              <div className="text-sm font-inter-normal text-gray-600 mt-1">Manage tour packages and itineraries</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <DataTable<PackageRow>
            rows={rows}
            columns={columns}
            serverPaging
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
          />
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}
