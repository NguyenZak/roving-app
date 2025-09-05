"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  createdAt: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
  mode: "create" | "edit";
}

export default function CategoryFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  category, 
  mode 
}: CategoryFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    order: 0,
  });

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name,
        order: category.order,
      });
    } else {
      setFormData({
        name: "",
        order: 0,
      });
    }
  }, [mode, category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.set("name", formData.name);
      form.set("order", formData.order.toString());

      let url = "/api/admin/categories";
      let method = "POST";

      if (mode === "edit" && category) {
        url = `/api/admin/categories/${category.id}`;
        method = "POST";
        form.set("_method", "PATCH");
      }

      const res = await fetch(url, {
        method,
        body: form,
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        console.error(`Failed to ${mode} category`);
      }
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} category:`, error);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-inter-bold text-gray-900">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Tag className="h-5 w-5 text-teal-600" />
            </div>
            {mode === "create" ? "Create New Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="font-inter-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim()}
              className="px-6 py-2 font-inter-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === "create" ? "Create Category" : "Update Category"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
