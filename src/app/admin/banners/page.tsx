"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, Video, Youtube, Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Save, X, Upload, Globe, Play, Music } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import UnifiedImageUpload from "@/components/admin/UnifiedImageUpload";

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
  type: string;
  videoUrl?: string;
  youtubeUrl?: string;
  poster?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    alt: "",
    type: "image",
    videoUrl: "",
    youtubeUrl: "",
    poster: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchBanners();
  }, [page, pageSize]);

  async function fetchBanners() {
    try {
      setLoading(true);
      const url = `/api/admin/banners?page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners ?? []);
        setTotal(data.total ?? 0);
      } else {
        alert("Không thể tải danh sách banner");
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert("Có lỗi xảy ra khi tải danh sách banner");
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!formData.title.trim()) {
        alert("Tiêu đề banner là bắt buộc");
        return;
      }
      
      if (!formData.image.trim()) {
        alert("URL hình ảnh là bắt buộc");
        return;
      }
      
      if (!formData.alt.trim()) {
        alert("Alt text là bắt buộc");
        return;
      }

      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setCreateOpen(false);
        resetForm();
        fetchBanners();
        alert("Banner đã được tạo thành công!");
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.error || 'Không thể tạo banner'}`);
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      alert("Có lỗi xảy ra khi tạo banner");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedBanner) return;

    try {
      setLoading(true);
      
      // Validation
      if (!formData.title.trim()) {
        alert("Tiêu đề banner là bắt buộc");
        return;
      }
      
      if (!formData.image.trim()) {
        alert("URL hình ảnh là bắt buộc");
        return;
      }
      
      if (!formData.alt.trim()) {
        alert("Alt text là bắt buộc");
        return;
      }

      const response = await fetch(`/api/admin/banners/${selectedBanner.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditOpen(false);
        resetForm();
        fetchBanners();
        alert("Banner đã được cập nhật thành công!");
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.error || 'Không thể cập nhật banner'}`);
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      alert("Có lỗi xảy ra khi cập nhật banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBanners(prev => prev.filter(banner => banner.id !== id));
        setTotal(prev => prev - 1);
        alert("Banner đã được xóa thành công!");
      } else {
        const errorData = await res.json();
        alert(`Lỗi: ${errorData.error || 'Không thể xóa banner'}`);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert("Có lỗi xảy ra khi xóa banner");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      alt: "",
      type: "image",
      videoUrl: "",
      youtubeUrl: "",
      poster: "",
      order: 0,
      isActive: true,
    });
  };

  const openEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: banner.image,
      alt: banner.alt,
      type: banner.type,
      videoUrl: banner.videoUrl || "",
      youtubeUrl: banner.youtubeUrl || "",
      poster: banner.poster || "",
      order: banner.order,
      isActive: banner.isActive,
    });
    setEditOpen(true);
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const handleReorder = async (id: string, newOrder: number) => {
    if (newOrder < 0) return;
    
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (response.ok) {
        fetchBanners();
        alert("Thứ tự banner đã được cập nhật!");
      }
    } catch (error) {
      console.error('Error reordering banner:', error);
      alert("Không thể cập nhật thứ tự banner");
    }
  };

  const toggleStatus = async (id: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (response.ok) {
        fetchBanners();
        alert(`Banner đã được ${newStatus ? 'hiển thị' : 'ẩn'}!`);
      }
    } catch (error) {
      console.error('Error toggling banner status:', error);
      alert("Không thể thay đổi trạng thái banner");
    }
  };

  const columns = [
    {
      key: "image",
      header: "Preview",
      render: (banner: Banner) => (
        <div className="w-24 h-20 relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 group">
          <img
            src={banner.image}
            alt={banner.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-md">
            {banner.type === "image" && <Image className="h-3.5 w-3.5 text-blue-600" />}
            {banner.type === "video" && <Video className="h-3.5 w-3.5 text-green-600" />}
            {banner.type === "youtube" && <Youtube className="h-3.5 w-3.5 text-red-600" />}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      render: (banner: Banner) => (
        <div>
          <div className="font-medium text-gray-900">{banner.title}</div>
          {banner.subtitle && (
            <div className="text-xs text-gray-500 mt-1">{banner.subtitle}</div>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (banner: Banner) => (
        <Badge variant="outline" className="capitalize">
          {banner.type === "image" && (
            <div className="flex items-center gap-1">
              <Image className="h-3 w-3" />
              Hình ảnh
            </div>
          )}
          {banner.type === "video" && (
            <div className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              Video
            </div>
          )}
          {banner.type === "youtube" && (
            <div className="flex items-center gap-1">
              <Youtube className="h-3 w-3" />
              YouTube
            </div>
          )}
        </Badge>
      ),
    },
    {
      key: "order",
      header: "Thứ tự",
      render: (banner: Banner) => (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">{banner.order}</span>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleReorder(banner.id, banner.order - 1)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              disabled={banner.order <= 1}
              title="Di chuyển lên"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleReorder(banner.id, banner.order + 1)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              title="Di chuyển xuống"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (banner: Banner) => (
        <Badge variant={banner.isActive ? "default" : "secondary"} className="capitalize">
          {banner.isActive ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Hoạt động
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              Ẩn
            </div>
          )}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Hành động",
      render: (banner: Banner) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEdit(banner)}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md transform hover:scale-105"
            disabled={loading}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleStatus(banner.id, !banner.isActive)}
            className={`transition-all duration-200 hover:shadow-md transform hover:scale-105 ${
              banner.isActive 
                ? "border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300" 
                : "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
            }`}
            disabled={loading}
          >
            {banner.isActive ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Eye className="h-3.5 w-3.5 mr-1" />}
            {banner.isActive ? "Ẩn" : "Hiện"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setDeleteId(banner.id); setDeleteOpen(true); }}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:shadow-md transform hover:scale-105"
            disabled={loading}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                <Image className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-inter-bold tracking-tight text-gray-900">Quản lý Banner</h1>
                <p className="mt-2 text-lg text-gray-600 font-inter-normal">Quản lý banner hiển thị trên trang chủ</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Tổng cộng: {total} banner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Đang hoạt động: {banners.filter(b => b.isActive).length}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={openCreate} 
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-6 py-3 text-lg" 
            disabled={loading}
          >
            <Plus className="h-5 w-5" />
            Thêm Banner Mới
          </Button>
        </div>
      </div>

      {/* Banners Table */}
      <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="pt-8 pb-6 px-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
            <div className="p-4 bg-white rounded-2xl shadow-lg border border-blue-100">
              <Image className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-inter-bold text-gray-900">Danh sách Banner</div>
              <div className="text-sm font-inter-normal text-gray-600 mt-1">Quản lý và sắp xếp banner</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 py-8">
          <DataTable<Banner>
            rows={banners}
            columns={columns}
            serverPaging
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
          />
        </CardContent>
      </Card>

      {/* Create Banner Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-auto items-center max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Thêm Banner Mới</DialogTitle>
            <p className="text-gray-600 mt-2">Tạo banner mới để hiển thị trên trang chủ</p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tiêu đề banner"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle" className="text-sm font-medium text-gray-700">Phụ đề</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Nhập phụ đề (tùy chọn)"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Banner Type & Settings */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="h-5 w-5 text-green-600" />
                Loại Banner & Cài đặt
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-sm font-medium text-gray-700">Loại Banner</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Hình ảnh
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Video
                        </div>
                      </SelectItem>
                      <SelectItem value="youtube">
                        <div className="flex items-center gap-2">
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order" className="text-sm font-medium text-gray-700">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                Tải lên Media
              </h3>
              
              {/* Main Image/Poster */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700">Hình ảnh chính / Poster *</Label>
                <div className="mt-2">
                  <UnifiedImageUpload
                    label="Tải lên hình ảnh"
                    targetInputName="image"
                    onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <Label htmlFor="alt" className="text-sm font-medium text-gray-700">Alt Text *</Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="Mô tả hình ảnh cho SEO"
                  required
                  className="mt-2"
                />
              </div>

              {/* Conditional Fields */}
              {formData.type === "video" && (
                <div className="mt-4">
                  <Label htmlFor="videoUrl" className="text-sm font-medium text-gray-700">URL Video</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="mt-2"
                  />
                </div>
              )}

              {formData.type === "youtube" && (
                <div className="mt-4">
                  <Label htmlFor="youtubeUrl" className="text-sm font-medium text-gray-700">URL YouTube</Label>
                  <Input
                    id="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-2"
                  />
                </div>
              )}
            </div>

            {/* Status */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Music className="h-5 w-5 text-orange-600" />
                Trạng thái
              </h3>
              <div className="flex items-center space-x-3">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Hiển thị banner ngay lập tức
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={loading} className="px-6">
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={loading}
              className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Tạo Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Banner Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Edit className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Chỉnh sửa Banner</DialogTitle>
            <p className="text-gray-600 mt-2">Cập nhật thông tin banner</p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">Tiêu đề *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tiêu đề banner"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-subtitle" className="text-sm font-medium text-gray-700">Phụ đề</Label>
                  <Input
                    id="edit-subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Nhập phụ đề (tùy chọn)"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Banner Type & Settings */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="h-5 w-5 text-green-600" />
                Loại Banner & Cài đặt
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type" className="text-sm font-medium text-gray-700">Loại Banner</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Hình ảnh
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Video
                        </div>
                      </SelectItem>
                      <SelectItem value="youtube">
                        <div className="flex items-center gap-2">
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-order" className="text-sm font-medium text-gray-700">Thứ tự hiển thị</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                Tải lên Media
              </h3>
              
              {/* Main Image/Poster */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700">Hình ảnh chính / Poster *</Label>
                <div className="mt-2">
                  <UnifiedImageUpload
                    label="Tải lên hình ảnh"
                    targetInputName="edit-image"
                    onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <Label htmlFor="edit-alt" className="text-sm font-medium text-gray-700">Alt Text *</Label>
                <Input
                  id="edit-alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="Mô tả hình ảnh cho SEO"
                  required
                  className="mt-2"
                />
              </div>

              {/* Conditional Fields */}
              {formData.type === "video" && (
                <div className="mt-4">
                  <Label htmlFor="edit-videoUrl" className="text-sm font-medium text-gray-700">URL Video</Label>
                  <Input
                    id="edit-videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="mt-2"
                  />
                </div>
              )}

              {formData.type === "youtube" && (
                <div className="mt-4">
                  <Label htmlFor="edit-youtubeUrl" className="text-sm font-medium text-gray-700">URL YouTube</Label>
                  <Input
                    id="edit-youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-2"
                  />
                </div>
              )}
            </div>

            {/* Status */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Music className="h-5 w-5 text-orange-600" />
                Trạng thái
              </h3>
              <div className="flex items-center space-x-3">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="edit-isActive" className="text-sm font-medium text-gray-700">
                  Hiển thị banner
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={loading} className="px-6">
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={loading}
              className="px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Trash2 className="h-10 w-10 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Xóa Banner</DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Bạn có chắc chắn muốn xóa banner này? <br />
              <span className="font-semibold text-red-600">Hành động này không thể hoàn tác.</span>
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3 px-6 pb-6">
            <Button 
              variant="outline" 
              onClick={() => setDeleteOpen(false)} 
              disabled={loading} 
              className="w-full sm:w-auto px-8 py-2"
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-8 py-2 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Xóa Vĩnh Viễn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}