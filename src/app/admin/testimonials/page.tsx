"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, ArrowUp, ArrowDown, Save, X, User } from "lucide-react";
import UnifiedImageUpload from "@/components/admin/UnifiedImageUpload";
import { Switch } from "@/components/ui/switch";

type Testimonial = {
  id: string;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  avatar?: string;
  tour?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 5,
    comment: "",
    avatar: "",
    tour: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchItems();
  }, [page, pageSize]);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/testimonials?page=${page}&pageSize=${pageSize}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.testimonials ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({ name: "", location: "", rating: 5, comment: "", avatar: "", tour: "", isActive: true, order: 0 });
  }

  function openCreate() {
    resetForm();
    setCreateOpen(true);
  }

  function openEdit(item: Testimonial) {
    setSelected(item);
    setFormData({
      name: item.name,
      location: item.location || "",
      rating: item.rating,
      comment: item.comment,
      avatar: item.avatar || "",
      tour: item.tour || "",
      isActive: item.isActive,
      order: item.order,
    });
    setEditOpen(true);
  }

  async function handleCreate() {
    try {
      setLoading(true);
      if (!formData.name.trim() || !formData.comment.trim()) {
        alert("Tên và nhận xét là bắt buộc");
        return;
      }
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setCreateOpen(false);
        resetForm();
        fetchItems();
      } else {
        const e = await res.json();
        alert(e.error || 'Không thể tạo testimonial');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!selected) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/testimonials/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditOpen(false);
        resetForm();
        fetchItems();
      } else {
        const e = await res.json();
        alert(e.error || 'Không thể cập nhật testimonial');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id));
        setTotal(prev => prev - 1);
      }
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
      setLoading(false);
    }
  }

  async function handleReorder(id: string, nextOrder: number) {
    if (nextOrder < 0) return;
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: nextOrder }),
    });
    fetchItems();
  }

  async function toggleStatus(id: string, next: boolean) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: next }),
    });
    fetchItems();
  }

  const columns = [
    {
      key: 'avatar',
      header: 'Avatar',
      render: (row: Testimonial) => (
        <div className="w-12 h-12 rounded-full overflow-hidden border">
          {row.avatar ? (
            <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
              <User className="h-5 w-5" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Khách hàng',
      render: (row: Testimonial) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.location}</div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Đánh giá',
      render: (row: Testimonial) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: row.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      ),
    },
    {
      key: 'tour',
      header: 'Tour',
      render: (row: Testimonial) => (
        <Badge variant="outline">{row.tour || '—'}</Badge>
      ),
    },
    {
      key: 'order',
      header: 'Thứ tự',
      render: (row: Testimonial) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">{row.order}</span>
          <div className="flex flex-col">
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleReorder(row.id, row.order - 1)} disabled={row.order <= 1}>
              <ArrowUp className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleReorder(row.id, row.order + 1)}>
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (row: Testimonial) => (
        <Badge variant={row.isActive ? 'default' : 'secondary'}>{row.isActive ? 'Hiển thị' : 'Ẩn'}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (row: Testimonial) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
            <Edit className="h-4 w-4 mr-1" /> Sửa
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleStatus(row.id, !row.isActive)}>
            {row.isActive ? 'Ẩn' : 'Hiện'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setDeleteId(row.id); setDeleteOpen(true); }}>
            <Trash2 className="h-4 w-4 mr-1" /> Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageWrapper>
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-2xl border mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Testimonials</h1>
            <p className="mt-2 text-gray-600">Thêm, sửa, xóa và sắp xếp phản hồi khách hàng</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm mới
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<Testimonial>
            rows={items}
            columns={columns}
            serverPaging
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-4x items-center p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm Testimonial</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            {/* Left: Form fields */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Tên khách hàng <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Tên sẽ hiển thị cùng avatar.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Vị trí</Label>
                  <Input
                    placeholder="Ví dụ: Hà Nội"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm">Tour</Label>
                  <Input
                    placeholder="Ví dụ: Hạ Long Bay 3N2Đ"
                    value={formData.tour}
                    onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Đánh giá</Label>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const n = i + 1;
                    const active = n <= formData.rating;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: n })}
                        className="p-1"
                        aria-label={`Đánh giá ${n} sao`}
                      >
                        <Star className={active ? "h-5 w-5 text-yellow-400 fill-yellow-400" : "h-5 w-5 text-gray-300"} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label className="text-sm">Nhận xét <span className="text-red-500">*</span></Label>
                <Textarea
                  rows={5}
                  placeholder="Cảm nhận về chuyến đi..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Tối ưu 1-3 câu ngắn gọn, chân thực.</p>
              </div>
              <div>
                <Label className="text-sm">Avatar</Label>
                <UnifiedImageUpload
                  label="Tải ảnh avatar"
                  targetInputName="avatar"
                  onImageUploaded={(url) => setFormData({ ...formData, avatar: url })}
                />
                <p className="text-xs text-gray-500 mt-1">Ảnh vuông 300x300 hoặc lớn hơn, khuôn mặt rõ nét.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <Label className="text-sm">Thứ tự hiển thị</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="text-sm">Hiển thị ngay</Label>
                </div>
              </div>
            </div>
            {/* Right: Live preview */}
            <div className="bg-gray-50 rounded-xl p-6 border">
              <div className="text-sm text-gray-600 mb-3">Xem trước</div>
              <div className="rounded-xl border bg-white/80 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: formData.rating || 0 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="h-8 w-8 text-blue-200 mb-3">
                    {/* simple quote icon substitute */}
                    ★
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {formData.comment || 'Nhận xét sẽ hiển thị ở đây...'}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      {formData.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={formData.avatar} alt={formData.name || 'avatar'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{formData.name || 'Tên khách hàng'}</div>
                      <div className="text-gray-500 text-xs">{formData.location || 'Vị trí'}</div>
                      <div className="text-blue-600 text-xs font-medium mt-1">{formData.tour || 'Tên tour'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}><X className="h-4 w-4 mr-1" /> Hủy</Button>
            <Button onClick={handleCreate}><Save className="h-4 w-4 mr-1" /> Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Testimonial</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tên *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label>Vị trí</Label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div>
              <Label>Tour</Label>
              <Input value={formData.tour} onChange={(e) => setFormData({ ...formData, tour: e.target.value })} />
            </div>
            <div>
              <Label>Đánh giá (1-5)</Label>
              <Input type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} />
            </div>
            <div className="col-span-2">
              <Label>Nhận xét *</Label>
              <Textarea rows={4} value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Avatar</Label>
              <UnifiedImageUpload label="Tải ảnh avatar" targetInputName="edit-avatar" onImageUploaded={(url) => setFormData({ ...formData, avatar: url })} />
            </div>
            <div>
              <Label>Thứ tự</Label>
              <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}><X className="h-4 w-4 mr-1" /> Hủy</Button>
            <Button onClick={handleUpdate}><Save className="h-4 w-4 mr-1" /> Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa Testimonial</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc muốn xóa phản hồi này? Hành động không thể hoàn tác.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}

