"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, Calendar, DollarSign, CalendarDays, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import PageHeader from "@/components/admin/PageHeader";
import Link from "next/link";

interface BookingRow {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  tourName: string;
  tourDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

export default function BookingsPage() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  async function fetchBookings() {
    const url = `/api/admin/bookings?page=${page}&pageSize=${pageSize}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setRows(data.bookings ?? []);
      setTotal(data.total ?? 0);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (res.ok) setRows((prev) => prev.filter((b) => b.id !== id));
    setConfirmOpen(false);
    setDeleteId(null);
  }

  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'confirmed':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3" /> };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-3 w-3" /> };
      case 'completed':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle className="h-3 w-3" /> };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: <Clock className="h-3 w-3" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <Clock className="h-3 w-3" /> };
    }
  };

  const columns: { key: keyof BookingRow | string; header: string; className?: string; sortable?: boolean; render?: (row: BookingRow) => React.ReactNode }[] = [
    {
      key: "bookingId",
      header: "Booking ID",
      sortable: true,
      render: (booking) => (
        <div className="font-mono text-sm font-semibold bg-gray-50 px-2 py-1 rounded text-gray-700">
          {booking.bookingId}
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      sortable: true,
      render: (booking) => (
        <div>
          <div className="font-medium text-gray-900">{booking.customerName}</div>
          <div className="text-xs text-gray-500">{booking.customerEmail}</div>
        </div>
      ),
    },
    {
      key: "tourName",
      header: "Tour",
      sortable: true,
      render: (booking) => (
        <div className="font-medium text-gray-900">{booking.tourName}</div>
      ),
    },
    {
      key: "tourDate",
      header: "Tour Date",
      sortable: true,
      render: (booking) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">
            {new Date(booking.tourDate).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: "numberOfPeople",
      header: "People",
      sortable: true,
      render: (booking) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{booking.numberOfPeople} pax</span>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      sortable: true,
      render: (booking: BookingRow) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="font-semibold text-green-600">
            {booking.totalAmount.toLocaleString()} ₫
          </span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (booking) => {
        const statusInfo = getStatusInfo(booking.status);
        return (
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
            {statusInfo.icon}
            {booking.status}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      header: "Booked On",
      sortable: true,
      render: (booking) => (
        <div className="text-sm text-gray-600">
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (booking) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(`/admin/bookings/${booking.id}`, "_blank")}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(`/admin/bookings/${booking.id}/edit`, "_blank")}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { setDeleteId(booking.id); setConfirmOpen(true); }}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  const confirmedBookings = rows.filter(b => b.status.toLowerCase() === 'confirmed').length;
  const pendingBookings = rows.filter(b => b.status.toLowerCase() === 'pending').length;
  const totalRevenue = rows.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <PageHeader
        title="Bookings Management"
        description="Manage tour bookings, reservations, and customer information."
        action={{
          label: "Add Booking",
          href: "/admin/bookings/new",
          icon: <Plus className="h-4 w-4" />
        }}
        stats={[
          {
            label: "Total Bookings",
            value: total,
            change: "+12%",
            changeType: "positive",
            icon: <CalendarDays className="h-6 w-6 text-white" />,
            color: "bg-blue-500"
          },
          {
            label: "Confirmed",
            value: confirmedBookings,
            change: "+8%",
            changeType: "positive",
            icon: <CheckCircle className="h-6 w-6 text-white" />,
            color: "bg-green-500"
          },
          {
            label: "Pending",
            value: pendingBookings,
            change: "-3%",
            changeType: "negative",
            icon: <Clock className="h-6 w-6 text-white" />,
            color: "bg-yellow-500"
          },
          {
            label: "Total Revenue",
            value: `${(totalRevenue / 1000000).toFixed(1)}M ₫`,
            change: "+23%",
            changeType: "positive",
            icon: <TrendingUp className="h-6 w-6 text-white" />,
            color: "bg-purple-500"
          }
        ]}
      />

      {/* Bookings Table Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-8 pb-6 px-8 bg-gradient-to-r from-blue-50 to-indigo-50/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
              <CalendarDays className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">All Bookings</div>
              <div className="text-sm font-normal text-gray-600 mt-1">Manage and track all tour reservations</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <DataTable<BookingRow>
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
            <DialogTitle>Delete Booking</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-sm text-gray-600">
            Are you sure you want to delete this booking? This action cannot be undone.
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
