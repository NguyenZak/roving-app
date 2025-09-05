"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Calendar, DollarSign, User } from "lucide-react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

interface Tour {
  id: string;
  title: string;
  price: number;
  location: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Booking {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  tourId: string;
  tourName: string;
  tourDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  notes?: string;
  userId?: string;
}

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    tourId: "",
    tourDate: "",
    numberOfPeople: 1,
    totalAmount: 0,
    status: "pending",
    notes: "",
    userId: "none"
  });

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
      fetchTours();
      fetchUsers();
    }
  }, [bookingId]);

  async function fetchBooking() {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
        setFormData({
          customerName: data.customerName || "",
          customerEmail: data.customerEmail || "",
          tourId: data.tourId || "",
          tourDate: data.tourDate ? new Date(data.tourDate).toISOString().split('T')[0] : "",
          numberOfPeople: data.numberOfPeople || 1,
          totalAmount: data.totalAmount || 0,
          status: data.status || "pending",
          notes: data.notes || "",
          userId: data.userId || "none"
        });
      } else {
        alert('Booking not found');
        router.push('/admin/bookings');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Error loading booking');
    }
  }

  async function fetchTours() {
    try {
      const res = await fetch('/api/admin/tours');
      if (res.ok) {
        const data = await res.json();
        setTours(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  function handleInputChange(key: string, value: string | number) {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));

    // Auto-calculate total amount when tour or number of people changes
    if (key === 'tourId' || key === 'numberOfPeople') {
      const selectedTour = tours.find(t => t.id === (key === 'tourId' ? value : formData.tourId));
      if (selectedTour) {
        const people = key === 'numberOfPeople' ? Number(value) : formData.numberOfPeople;
        setFormData(prev => ({
          ...prev,
          totalAmount: selectedTour.price * people
        }));
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = {
        ...formData,
        userId: formData.userId === "none" ? "" : formData.userId
      };

      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        router.push('/admin/bookings');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminPageWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-inter-medium">Loading booking...</div>
        </div>
      </AdminPageWrapper>
    );
  }

  if (!booking) {
    return (
      <AdminPageWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-inter-medium">Booking not found</div>
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <div className="space-y-4 pb-6 border-b">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
          className="font-inter-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Edit Booking</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">Update booking information for {booking.bookingId}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                <User className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-inter-bold text-gray-900">Customer Information</div>
                <div className="text-sm font-inter-normal text-gray-600 mt-1">Update customer details</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="customerName" className="text-sm font-inter-medium text-gray-700">
                  Customer Name *
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="customerEmail" className="text-sm font-inter-medium text-gray-700">
                  Email *
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="userId" className="text-sm font-inter-medium text-gray-700">
                  Existing User (Optional)
                </Label>
                <Select value={formData.userId} onValueChange={(value) => handleInputChange('userId', value)}>
                  <SelectTrigger className="h-11 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select existing user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No user selected</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tour Information */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-green-100">
                <Calendar className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-inter-bold text-gray-900">Tour Information</div>
                <div className="text-sm font-inter-normal text-gray-600 mt-1">Update tour and booking details</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="tourId" className="text-sm font-inter-medium text-gray-700">
                  Select Tour *
                </Label>
                <Select value={formData.tourId} onValueChange={(value) => handleInputChange('tourId', value)}>
                  <SelectTrigger className="h-11 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Choose a tour" />
                  </SelectTrigger>
                  <SelectContent>
                    {tours.map((tour) => (
                      <SelectItem key={tour.id} value={tour.id}>
                        {tour.title} - ${tour.price.toLocaleString()} - {tour.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="tourDate" className="text-sm font-inter-medium text-gray-700">
                  Tour Date *
                </Label>
                <Input
                  id="tourDate"
                  type="date"
                  value={formData.tourDate}
                  onChange={(e) => handleInputChange('tourDate', e.target.value)}
                  className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="numberOfPeople" className="text-sm font-inter-medium text-gray-700">
                  Number of People *
                </Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  value={formData.numberOfPeople}
                  onChange={(e) => handleInputChange('numberOfPeople', Number(e.target.value))}
                  className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-inter-medium text-gray-700">
                  Booking Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="h-11 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-purple-100">
                <DollarSign className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-inter-bold text-gray-900">Pricing</div>
                <div className="text-sm font-inter-normal text-gray-600 mt-1">Update booking cost and payment details</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="totalAmount" className="text-sm font-inter-medium text-gray-700">
                  Total Amount (VNĐ)
                </Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => handleInputChange('totalAmount', Number(e.target.value))}
                  className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 font-inter-normal">
                  Auto-calculated based on tour price and number of people
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-inter-medium text-gray-700">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="px-4 py-3 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            className="px-6 py-3 font-inter-medium"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="px-6 py-3 font-inter-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Updating...' : 'Update Booking'}
          </Button>
        </div>
      </form>
    </AdminPageWrapper>
  );
}
