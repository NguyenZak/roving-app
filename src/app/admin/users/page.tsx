"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users as UsersIcon, Eye, Edit, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Link from "next/link";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  async function fetchUsers() {
    const url = `/api/admin/users?page=${page}&pageSize=${pageSize}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setRows(data.users ?? []);
      setTotal(data.total ?? 0);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) setRows((prev) => prev.filter((u) => u.id !== id));
    setConfirmOpen(false);
    setDeleteId(null);
  }

  const columns: { key: keyof UserRow | string; header: string; className?: string; sortable?: boolean; render?: (row: UserRow) => React.ReactNode }[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">{String(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{user.name || "—"}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.status === 'active' ? 'bg-green-100 text-green-800' :
          user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {user.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => window.open(`/admin/users/${user.id}`, "_blank")}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.open(`/admin/users/${user.id}/edit`, "_blank")}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setDeleteId(user.id); setConfirmOpen(true); }}>
            <Trash2 className="h-4 w-4" />
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
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Administrators</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">Manage system administrators and staff accounts.</p>
        </div>
        <Link href="/admin/users/new">
          <Button className="px-6 py-3 font-inter-medium">
            <Plus className="h-4 w-4 mr-2" />
            Add Administrator
          </Button>
        </Link>
      </div>

      {/* Users Table Card */}
      <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-green-100">
              <UsersIcon className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-inter-bold text-gray-900">All Administrators</div>
              <div className="text-sm font-inter-normal text-gray-600 mt-1">System administrators and staff members</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <DataTable<UserRow>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-sm text-muted-foreground">
            Are you sure you want to delete this user? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}
