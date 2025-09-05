"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UnifiedImageUpload from "@/components/admin/UnifiedImageUpload";

type RegionData = {
  key: string;
  nameVi: string;
  nameEn: string;
  descriptionVi?: string | null;
  descriptionEn?: string | null;
  image?: string | null;
  order: number;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  regionKey?: string;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

export default function RegionFormModal({ open, mode, regionKey, onOpenChange, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RegionData>({
    key: "",
    nameVi: "",
    nameEn: "",
    descriptionVi: "",
    descriptionEn: "",
    image: "",
    order: 0,
  });

  // Load region data for editing
  useEffect(() => {
    if (open && mode === "edit" && regionKey) {
      loadRegionData();
    } else if (open && mode === "create") {
      resetForm();
    }
  }, [open, mode, regionKey]);

  const loadRegionData = async () => {
    if (!regionKey) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/regions/${regionKey}`);
      if (res.ok) {
        const json = await res.json();
        const region = json.region;
        if (region) {
          setData({
            key: region.key || regionKey,
            nameVi: region.nameVi || "",
            nameEn: region.nameEn || "",
            descriptionVi: region.descriptionVi || "",
            descriptionEn: region.descriptionEn || "",
            image: region.image || "",
            order: typeof region.order === "number" ? region.order : 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load region:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setData({
      key: "",
      nameVi: "",
      nameEn: "",
      descriptionVi: "",
      descriptionEn: "",
      image: "",
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const url = mode === "create" ? "/api/admin/regions" : `/api/admin/regions/${data.key}`;
      const res = await fetch(url, { method: "POST", body: formData });
      
      if (res.ok) {
        onOpenChange(false);
        onSaved?.();
        resetForm();
      } else {
        const error = await res.json().catch(() => ({ error: "Unknown error" }));
        alert(error.error || "Lưu thất bại");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Có lỗi xảy ra khi lưu");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm Vùng Mới" : "Chỉnh Sửa Vùng"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Key field (only for create) */}
          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="key">Mã vùng *</Label>
              <Input
                id="key"
                name="key"
                value={data.key}
                onChange={(e) => setData(prev => ({ ...prev, key: e.target.value }))}
                placeholder="north, central, south"
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500">
                Mã duy nhất để định danh vùng (ví dụ: north, central, south)
              </p>
            </div>
          )}

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameVi">Tên tiếng Việt *</Label>
              <Input
                id="nameVi"
                name="nameVi"
                value={data.nameVi}
                onChange={(e) => setData(prev => ({ ...prev, nameVi: e.target.value }))}
                placeholder="Miền Bắc"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">Tên tiếng Anh *</Label>
              <Input
                id="nameEn"
                name="nameEn"
                value={data.nameEn}
                onChange={(e) => setData(prev => ({ ...prev, nameEn: e.target.value }))}
                placeholder="North"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descriptionVi">Mô tả tiếng Việt</Label>
              <Textarea
                id="descriptionVi"
                name="descriptionVi"
                value={data.descriptionVi || ""}
                onChange={(e) => setData(prev => ({ ...prev, descriptionVi: e.target.value }))}
                placeholder="Mô tả về vùng miền..."
                rows={4}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionEn">Mô tả tiếng Anh</Label>
              <Textarea
                id="descriptionEn"
                name="descriptionEn"
                value={data.descriptionEn || ""}
                onChange={(e) => setData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                placeholder="Description of the region..."
                rows={4}
                disabled={loading}
              />
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <UnifiedImageUpload
              label="Hình ảnh"
              value={data.image || ""}
              onChange={(url) => setData(prev => ({ ...prev, image: url }))}
              required
            />
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">Thứ tự hiển thị</Label>
            <Input
              id="order"
              name="order"
              type="number"
              value={data.order}
              onChange={(e) => setData(prev => ({ ...prev, order: Number(e.target.value) || 0 }))}
              min="0"
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              Số càng nhỏ càng hiển thị trước
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : mode === "create" ? "Tạo vùng" : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
