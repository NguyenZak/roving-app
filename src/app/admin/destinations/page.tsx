"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, MapPin, Globe, Star, Hash, Save, Loader2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import PageHeader from "@/components/admin/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UnifiedImageUpload from "@/components/admin/UnifiedImageUpload";

interface DestinationRow {
  id: string;
  nameEn: string;
  nameVi: string;
  region: string;
  isFeatured: boolean;
  order: number;
  [key: string]: unknown;
}

const destinationSchema = z.object({
  region: z.enum(["north", "central", "south"]),
  nameVi: z.string().min(1, "Tên tiếng Việt là bắt buộc"),
  nameEn: z.string().min(1, "Tên tiếng Anh là bắt buộc"),
  image: z.string().min(1, "Ảnh là bắt buộc"),
  alt: z.string().min(1, "Alt text là bắt buộc"),
  isFeatured: z.boolean(),
  order: z.number().min(0, "Thứ tự phải >= 0"),
});

type DestinationFormData = z.infer<typeof destinationSchema>;

export default function AdminDestinationsPage() {
  const [items, setItems] = useState<DestinationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      region: "north",
      isFeatured: false,
      order: 0,
    },
  });

  const watchedImage = watch("image");

  // Update preview when image changes
  useEffect(() => {
    if (watchedImage) {
      setPreviewImage(watchedImage);
    }
  }, [watchedImage]);

  const load = useCallback(async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/destinations?page=${p}&pageSize=${ps}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setItems(Array.isArray(data.items) ? data.items : []);
        setTotal(Number(data.total || 0));
      } else {
        alert(data?.error || "Failed to load destinations");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete destination?")) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== id));
    try {
      const fd = new FormData();
      fd.append("_method", "DELETE");
      const res = await fetch(`/api/admin/destinations/${id}`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Delete failed");
      load(page, pageSize);
    } catch {
      alert("Delete failed");
      setItems(prev);
    }
  }

  const handleCreateDestination = async (data: DestinationFormData) => {
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        fd.append(key, String(value));
      });

      const res = await fetch("/api/admin/destinations", { 
        method: "POST", 
        body: fd 
      });

      if (res.ok) {
        // Close modal and refresh data
        setCreateModalOpen(false);
        reset();
        setPreviewImage("");
        load(page, pageSize);
        alert("Tạo điểm đến thành công!");
      } else {
        const errorData = await res.json();
        alert(`Tạo thất bại: ${errorData.error || "Lỗi không xác định"}`);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo destination");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setValue("image", imageUrl);
  };

  const openEditModal = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load destination");
      reset({
        region: data.region,
        nameVi: data.nameVi,
        nameEn: data.nameEn,
        image: data.image,
        alt: data.alt,
        isFeatured: data.isFeatured,
        order: data.order,
      });
      setPreviewImage(data.image || "");
      setEditingId(id);
      setEditModalOpen(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      alert(message || "Failed to open edit modal");
    }
  };

  const handleUpdateDestination = async (data: DestinationFormData) => {
    if (!editingId) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/admin/destinations/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Update failed");
      setEditModalOpen(false);
      setEditingId(null);
      reset();
      setPreviewImage("");
      load(page, pageSize);
      alert("Cập nhật điểm đến thành công!");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      alert(message || "Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
    reset();
    setPreviewImage("");
  };

  if (loading) return (
    <AdminPageWrapper>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500 font-medium">Loading destinations...</div>
        </div>
      </div>
    </AdminPageWrapper>
  );

  const featuredCount = items.filter(d => d.isFeatured).length;
  const regions = [...new Set(items.map(d => d.region))];

  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <PageHeader
        title="Destinations Management"
        description="Create, edit, and manage your travel destinations and locations."
        action={{
          label: "New Destination",
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />
        }}
        stats={[
          {
            label: "Total Destinations",
            value: total,
            change: "+5%",
            changeType: "positive",
            icon: <MapPin className="h-6 w-6 text-white" />,
            color: "bg-blue-500"
          },
          {
            label: "Featured Destinations",
            value: featuredCount,
            change: "+2%",
            changeType: "positive",
            icon: <Star className="h-6 w-6 text-white" />,
            color: "bg-yellow-500"
          },
          {
            label: "Regions",
            value: regions.length,
            change: "3",
            changeType: "neutral",
            icon: <Globe className="h-6 w-6 text-white" />,
            color: "bg-green-500"
          }
        ]}
      />

      {/* Destinations Table */}
      <Card>
        <CardHeader className="pb-6 pt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle>All Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={items}
                          columns={[
                {
                  key: "image",
                  header: "Image",
                  render: (item) => (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image as string}
                      alt={(item.alt as string) || (item.nameEn as string) || "Destination"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ),
              },
                {
                  key: "nameEn",
                  header: "Name",
                  render: (item) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.nameEn}</div>
                      <div className="text-sm text-gray-500">{item.nameVi}</div>
                    </div>
                  </div>
                ),
              },
                              {
                  key: "region",
                  header: "Region",
                  render: (item) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.region === 'north' ? 'bg-blue-100 text-blue-800' :
                    item.region === 'central' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {item.region === 'north' ? 'Miền Bắc' :
                     item.region === 'central' ? 'Miền Trung' : 'Miền Nam'}
                  </span>
                ),
              },
                              {
                  key: "isFeatured",
                  header: "Featured",
                  render: (item) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.isFeatured ? 'Nổi bật' : 'Thường'}
                  </span>
                ),
              },
                              {
                  key: "order",
                  header: "Order",
                  render: (item) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.order}
                  </span>
                ),
              },
                              {
                  key: "actions",
                  header: "Actions",
                  render: (item) => (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(item.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            pageSize={pageSize}
            total={total}
            serverPaging={true}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>

      {/* Create Destination Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-auto items-center max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <div>Tạo Điểm Đến Mới</div>
                <div className="text-sm font-normal text-gray-600 mt-1">
                  Thêm điểm đến mới vào hệ thống du lịch
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit(handleCreateDestination)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Thông Tin Cơ Bản</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vietnamese Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-red-500 text-lg">🇻🇳</span>
                      Tên tiếng Việt
                    </label>
                    <input 
                      {...register("nameVi")}
                      type="text"
                      placeholder="Ví dụ: Hà Nội, Hồ Chí Minh, Đà Nẵng..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    />
                    {errors.nameVi && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.nameVi.message}
                      </p>
                    )}
                  </div>

                  {/* English Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-blue-500 text-lg">🇺🇸</span>
                      Tên tiếng Anh
                    </label>
                    <input 
                      {...register("nameEn")}
                      type="text"
                      placeholder="Example: Hanoi, Ho Chi Minh, Da Nang..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    />
                    {errors.nameEn && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.nameEn.message}
                      </p>
                    )}
                  </div>

                  {/* Region Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Globe className="w-4 h-4 text-gray-600" />
                      Khu vực
                    </label>
                    <select 
                      {...register("region")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white"
                    >
                      <option value="north">🏔️ Miền Bắc</option>
                      <option value="central">🏖️ Miền Trung</option>
                      <option value="south">🌴 Miền Nam</option>
                    </select>
                    {errors.region && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.region.message}
                      </p>
                    )}
                  </div>

                  {/* Alt Text */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Hash className="w-4 h-4 text-gray-600" />
                      Alt Text (SEO)
                    </label>
                    <input 
                      {...register("alt")}
                      type="text"
                      placeholder="Mô tả ảnh cho SEO và accessibility"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    />
                    {errors.alt && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.alt.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Ảnh Đại Diện</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        Upload Ảnh
                      </label>
                      
                      {/* Image Uploader */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-200 bg-gray-50/50">
                        <UnifiedImageUpload 
                          label="Chọn ảnh từ máy tính"
                          targetInputName="image" 
                          onImageUploaded={handleImageUpload}
                          className="w-full"
                        />
                        <div className="mt-3 text-xs text-gray-500 space-y-1">
                          <div>Hỗ trợ: JPG, PNG, WebP</div>
                          <div>Kích thước tối đa: 10MB</div>
                          <div>Khuyến nghị: 1200x800px</div>
                        </div>
                      </div>

                      {/* Image URL Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Hoặc nhập URL ảnh
                        </label>
                        <input 
                          {...register("image")}
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </div>
                      
                      {errors.image && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {errors.image.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Xem Trước</label>
                    {previewImage ? (
                      <div className="relative group">
                        <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                          <img 
                            src={previewImage} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setValue("image", "");
                              setPreviewImage("");
                            }}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
                            title="Xóa ảnh"
                          >
                            <Hash className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          Ảnh đã được chọn
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <div className="text-sm">Chưa có ảnh</div>
                          <div className="text-xs">Upload ảnh hoặc nhập URL</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Cài Đặt Hiển Thị</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Featured Toggle */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Điểm đến nổi bật
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        {...register("isFeatured")}
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        Hiển thị ưu tiên trên trang chủ và danh sách
                      </span>
                    </div>
                  </div>

                  {/* Display Order */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Hash className="w-4 h-4 text-gray-600" />
                      Thứ tự hiển thị
                    </label>
                    <div className="space-y-2">
                      <input 
                        {...register("order", { valueAsNumber: true })}
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      />
                      <div className="text-xs text-gray-500">
                        Số càng nhỏ, hiển thị càng trước
                      </div>
                    </div>
                    {errors.order && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.order.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500">
                Điểm đến sẽ được tạo với slug tự động từ tên tiếng Anh
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-6 py-2"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  onClick={handleSubmit(handleCreateDestination)}
                  className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Tạo điểm đến
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Destination Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-auto items-center max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <MapPin className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <div>Chỉnh Sửa Điểm Đến</div>
                <div className="text-sm font-normal text-gray-600 mt-1">
                  Cập nhật thông tin điểm đến
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit(handleUpdateDestination)} className="space-y-8">
              {/* Reuse the same form fields as create modal */}
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Thông Tin Cơ Bản</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-red-500 text-lg">🇻🇳</span>
                      Tên tiếng Việt
                    </label>
                    <input {...register("nameVi")} type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base" />
                    {errors.nameVi && (<p className="text-sm text-red-600">{errors.nameVi.message}</p>)}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-blue-500 text-lg">🇺🇸</span>
                      Tên tiếng Anh
                    </label>
                    <input {...register("nameEn")} type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base" />
                    {errors.nameEn && (<p className="text-sm text-red-600">{errors.nameEn.message}</p>)}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Globe className="w-4 h-4 text-gray-600" />
                      Khu vực
                    </label>
                    <select {...register("region")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base bg-white">
                      <option value="north">🏔️ Miền Bắc</option>
                      <option value="central">🏖️ Miền Trung</option>
                      <option value="south">🌴 Miền Nam</option>
                    </select>
                    {errors.region && (<p className="text-sm text-red-600">{errors.region.message}</p>)}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Hash className="w-4 h-4 text-gray-600" />
                      Alt Text (SEO)
                    </label>
                    <input {...register("alt")} type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base" />
                    {errors.alt && (<p className="text-sm text-red-600">{errors.alt.message}</p>)}
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Ảnh Đại Diện</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      Upload Ảnh
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-all duration-200 bg-gray-50/50">
                      <UnifiedImageUpload label="Chọn ảnh từ máy tính" targetInputName="image" onImageUploaded={handleImageUpload} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Hoặc nhập URL ảnh</label>
                      <input {...register("image")} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Xem Trước</label>
                    {previewImage ? (
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <div className="text-sm">Chưa có ảnh</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Cài Đặt Hiển Thị</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Điểm đến nổi bật
                    </label>
                    <div className="flex items-center gap-3">
                      <input {...register("isFeatured")} type="checkbox" className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                      <span className="text-sm text-gray-600">Hiển thị ưu tiên trên trang chủ và danh sách</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Hash className="w-4 h-4 text-gray-600" />
                      Thứ tự hiển thị
                    </label>
                    <input {...register("order", { valueAsNumber: true })} type="number" min="0" className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center" />
                    {errors.order && (<p className="text-sm text-red-600">{errors.order.message}</p>)}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500">Slug sẽ tự động cập nhật từ tên tiếng Anh</div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)} className="px-6 py-2">Hủy</Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(handleUpdateDestination)} className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                  {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang lưu...</>) : (<><Save className="w-4 h-4 mr-2" />Lưu thay đổi</>)}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}



