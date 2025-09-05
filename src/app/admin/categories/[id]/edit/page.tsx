"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Tag } from "lucide-react";
import Link from "next/link";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  createdAt: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    order: 0,
  });

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`);
      if (res.ok) {
        const category: Category = await res.json();
        setFormData({
          name: category.name,
          order: category.order,
        });
      } else {
        console.error("Failed to fetch category");
        router.push("/admin/categories");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      router.push("/admin/categories");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.set("_method", "PATCH");
      form.set("name", formData.name);
      form.set("order", formData.order.toString());

      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        router.push("/admin/categories");
      } else {
        console.error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loadingData) {
    return (
      <AdminPageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <div className="flex items-center gap-4 pb-6 border-b">
        <Link href="/admin/categories">
          <Button variant="outline" size="sm" className="font-inter-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Edit Category</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">Update the category information.</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-2 border-gray-100 shadow-sm">
        <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-teal-100">
              <Tag className="h-7 w-7 text-teal-600" />
            </div>
            <div>
              <div className="text-2xl font-inter-bold text-gray-900">Category Information</div>
              <div className="text-sm font-inter-normal text-gray-600 mt-1">Update the details for this category</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-inter-medium text-gray-700">
                  Category Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Northern Vietnam, Central Vietnam"
                  className="font-inter-normal"
                  required
                />
                <p className="text-xs text-gray-500 font-inter-normal">
                  The display name for this category
                </p>
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order" className="text-sm font-inter-medium text-gray-700">
                  Display Order
                </Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="font-inter-normal"
                  min="0"
                />
                <p className="text-xs text-gray-500 font-inter-normal">
                  Lower numbers appear first in lists
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              <Link href="/admin/categories">
                <Button type="button" variant="outline" className="font-inter-medium">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={loading || !formData.name.trim()}
                className="px-6 py-2 font-inter-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Category
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}
