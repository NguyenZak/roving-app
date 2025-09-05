"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, User, Mail, Phone, Calendar, CalendarDays } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Link from "next/link";

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country: string;
  registrationDate: string;
  status: string;
  totalBookings: number;
  totalSpent: number;
  [key: string]: unknown;
}

export default function CustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerRow | null>(null);

  useEffect(() => {
    load(page, pageSize);
  }, [page, pageSize]);

  async function load(page: number, pageSize: number) {
    try {
      const res = await fetch(`/api/admin/customers?page=${page}&pageSize=${pageSize}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.customers || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  async function handleDelete(customerId: string) {
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Reload the current page
        load(page, pageSize);
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  }

  function openDeleteDialog(customer: CustomerRow) {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  }

  const columns = [
    { key: "name", header: "Customer Name", sortable: true },
    { 
      key: "email", 
      header: "Email", 
      sortable: true,
      render: (customer: CustomerRow) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="font-inter-medium text-blue-600">
            {customer.email}
          </span>
        </div>
      )
    },
    { 
      key: "phone", 
      header: "Phone", 
      sortable: true,
      render: (customer: CustomerRow) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="font-inter-medium">
            {customer.phone || "N/A"}
          </span>
        </div>
      )
    },
    { 
      key: "city", 
      header: "Location", 
      sortable: true,
      render: (customer: CustomerRow) => (
        <span className="font-inter-medium text-gray-700">
          {customer.city || "N/A"}
        </span>
      )
    },
    { 
      key: "registrationDate", 
      header: "Registered", 
      sortable: true,
      render: (customer: CustomerRow) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-inter-medium">
            {new Date(customer.registrationDate).toLocaleDateString()}
          </span>
        </div>
      )
    },
    { 
      key: "totalBookings", 
      header: "Bookings", 
      sortable: true,
      render: (customer: CustomerRow) => (
        <span className="font-inter-medium text-blue-600">
          {customer.totalBookings}
        </span>
      )
    },
    { 
      key: "totalSpent", 
      header: "Total Spent", 
      sortable: true,
      render: (customer: CustomerRow) => (
        <span className="font-inter-medium text-green-600">
          {customer.totalSpent.toLocaleString()} ₫
        </span>
      )
    },
    { 
      key: "status", 
      header: "Status", 
      sortable: true,
      render: (customer: CustomerRow) => (
        <span className={`px-2 py-1 rounded-full text-xs font-inter-medium ${
          customer.status === 'active' ? 'bg-green-100 text-green-800' :
          customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
          customer.status === 'suspended' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (customer: CustomerRow) => (
        <div className="inline-flex gap-2">
          <Link href={`/admin/customers/${customer.id}`}>
            <Button variant="outline" size="sm" className="font-inter-medium">
              <Eye className="h-3.5 w-3.5 mr-1" /> View
            </Button>
          </Link>
          <Link href={`/admin/customers/${customer.id}/edit`}>
            <Button variant="outline" size="sm" className="font-inter-medium">
              <Edit className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => openDeleteDialog(customer)}
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
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Customers</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">Manage customer accounts and information.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-inter-medium">
            <Plus className="h-4 w-4 mr-2" />
            Import Customers
          </Button>
          <Link href="/admin/customers/new">
            <Button className="px-6 py-3 font-inter-medium">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Customers Table Card */}
      <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-green-100">
              <User className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-inter-bold text-gray-900">All Customers</div>
              <div className="text-sm font-inter-normal text-gray-600 mt-1">Customer data from external registration forms</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <DataTable<CustomerRow>
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md mx-auto my-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-inter-bold text-gray-900">Delete Customer</DialogTitle>
          </DialogHeader>
          <div className="py-6 px-2">
            <p className="text-gray-700 font-inter-normal text-base leading-relaxed">
              Are you sure you want to delete customer <strong className="text-gray-900">{customerToDelete?.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              This action cannot be undone. All customer information and booking history will be permanently removed.
            </p>
          </div>
          <DialogFooter className="gap-3 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="font-inter-medium px-6 py-2"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => customerToDelete && handleDelete(customerToDelete.id)}
              className="font-inter-medium px-6 py-2"
            >
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}
