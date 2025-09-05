"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CategoryFormModal from "@/components/admin/CategoryFormModal";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  order: number;
  createdAt: string;
  [key: string]: unknown;
}

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(null);

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  async function fetchRows() {
    const res = await fetch(`/api/admin/categories?page=${page}&pageSize=${pageSize}`);
    if (res.ok) {
      const data = await res.json();
      setRows(data.items ?? []);
      setTotal(data.total ?? 0);
    }
  }

  async function remove(id: string) {
    const form = new FormData();
    form.set("_method", "DELETE");
    const res = await fetch(`/api/admin/categories/${id}`, { method: "POST", body: form });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
    setConfirmOpen(false);
    setDeleteId(null);
  }

  const handleModalOpen = (mode: "create" | "edit", category?: CategoryRow) => {
    setModalMode(mode);
    setSelectedCategory(category || null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleModalSuccess = () => {
    fetchRows(); // Refresh the data
  };

  const columns: { key: keyof CategoryRow | string; header: string; className?: string; sortable?: boolean; render?: (row: CategoryRow) => React.ReactNode }[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "slug", header: "Slug", sortable: true },
    { 
      key: "order", 
      header: "Order", 
      sortable: true,
      render: (row) => (
        <span className="font-inter-medium text-blue-600">
          {row.order}
        </span>
      )
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleModalOpen("edit", row)}
            className="font-inter-medium"
          >
            <Pencil className="h-3.5 w-3.5 mr-1" /> Quick Edit
          </Button>
          <Link href={`/admin/categories/${row.id}/edit`}>
            <Button variant="outline" size="sm" className="font-inter-medium">
              <Pencil className="h-3.5 w-3.5 mr-1" /> Full Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { setDeleteId(row.id); setConfirmOpen(true); }}
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
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Blog Categories</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">Manage blog post categories and classifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => handleModalOpen("create")}
            className="px-6 py-3 font-inter-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Quick Create
          </Button>
          <Link href="/admin/categories/new">
            <Button variant="outline" className="px-6 py-3 font-inter-medium">
              <Plus className="h-4 w-4 mr-2" />
              Full Create
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Table Card */}
      <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-teal-100">
              <Tag className="h-7 w-7 text-teal-600" />
            </div>
            <div>
              <div className="text-2xl font-inter-bold text-gray-900">All Blog Categories</div>
              <div className="text-sm font-inter-normal text-gray-600 mt-1">Manage blog post categories and classifications</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <DataTable<CategoryRow>
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

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        category={selectedCategory}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-sm text-muted-foreground">
            Are you sure you want to delete this category?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && remove(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}
