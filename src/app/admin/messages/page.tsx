"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Users, MessageSquare, Eye, Archive, CheckCircle, Settings, Trash2, Loader2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_OPTIONS, STAFF_MEMBERS } from "@/lib/constants";
import EmailTest from "@/components/admin/EmailTest";
import EmailStatus from "@/components/admin/EmailStatus";
import { useToast } from "@/components/ui/toast-provider";

interface ContactRow {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string | null;
  quantity: number;
  date: string;
  message: string | null;
  status: string;
  createdAt: string;
  responsiblePerson: string | null;
  [key: string]: unknown;
}

export default function MessagesPage() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedContact, setSelectedContact] = useState<ContactRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showEmailTest, setShowEmailTest] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  async function fetchContacts() {
    try {
      const url = `/api/admin/contacts?page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRows(data.contacts ?? []);
        setTotal(data.total ?? 0);
      } else {
        const errorData = await res.json();
        showToast({
          title: "Lỗi tải dữ liệu",
          description: errorData.error || "Không thể tải danh sách tin nhắn",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showToast({
        title: "Lỗi mạng",
        description: "Không thể kết nối đến server",
        variant: "destructive",
        duration: 5000
      });
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // If status is changed to 'booked', move to customer table
        if (newStatus === 'booked') {
          console.log('Converting contact to customer...', { contactId: id });
          
          // Create customer record
          const customerResponse = await fetch('/api/admin/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contactId: id,
              status: 'active',
              source: 'contact_form'
            }),
          });

          if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            console.log('Contact moved to customer table successfully:', customerData);
            showToast({
              title: "Thành công!",
              description: "Trạng thái đã được cập nhật và contact đã được chuyển sang customer!",
              variant: "success",
              duration: 4000
            });
          } else {
            const errorData = await customerResponse.json();
            console.error('Failed to move contact to customer table:', errorData);
            showToast({
              title: "Cảnh báo",
              description: `Cập nhật trạng thái thành công nhưng không thể chuyển sang customer: ${errorData.error || 'Unknown error'}`,
              variant: "warning",
              duration: 5000
            });
          }
        } else {
          showToast({
            title: "Thành công!",
            description: "Trạng thái đã được cập nhật thành công!",
            variant: "success",
            duration: 3000
          });
        }

        // Refresh the contacts list
        fetchContacts();
      } else {
        const errorData = await response.json();
        console.error('Error updating status:', errorData);
        showToast({
          title: "Lỗi",
          description: `Có lỗi xảy ra khi cập nhật trạng thái: ${errorData.error || 'Unknown error'}`,
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật trạng thái",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  async function updateResponsiblePerson(id: string, person: string) {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responsiblePerson: person })
      });

      if (res.ok) {
        setRows(prev => prev.map(contact => 
          contact.id === id ? { ...contact, responsiblePerson: person } : contact
        ));
        showToast({
          title: "Cập nhật thành công",
          description: "Người phụ trách đã được cập nhật",
          variant: "success",
          duration: 3000
        });
      } else {
        const errorData = await res.json();
        showToast({
          title: "Lỗi",
          description: `Không thể cập nhật người phụ trách: ${errorData.error || 'Unknown error'}`,
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error updating responsible person:', error);
      showToast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật người phụ trách",
        variant: "destructive",
        duration: 5000
      });
    }
  }

  async function handleDelete(id: string) {
    if (isDeleting) return; // Prevent multiple clicks
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRows(prev => prev.filter(contact => contact.id !== id));
        setTotal(prev => prev - 1);
        showToast({
          title: "Xóa thành công",
          description: "Tin nhắn đã được xóa thành công!",
          variant: "success",
          duration: 3000
        });
      } else {
        const errorData = await res.json();
        showToast({
          title: "Lỗi",
          description: `Không thể xóa tin nhắn: ${errorData.error || 'Unknown error'}`,
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa tin nhắn",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
      setDeleteId(null);
    }
  }

  const columns: { key: keyof ContactRow | string; header: string; className?: string; sortable?: boolean; render?: (row: ContactRow) => React.ReactNode }[] = [
    {
      key: "fullName",
      header: "Customer",
      sortable: true,
      render: (contact) => (
        <div>
          <div className="font-medium">{contact.fullName}</div>
          <div className="text-xs text-muted-foreground">{contact.email}</div>
        </div>
      ),
    },
    {
      key: "whatsapp",
      header: "WhatsApp",
      render: (contact) => (
        contact.whatsapp ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{contact.whatsapp}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      ),
    },
    {
      key: "quantity",
      header: "People",
      sortable: true,
      render: (contact) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{contact.quantity} pax</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Preferred Date",
      sortable: true,
      render: (contact) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{new Date(contact.date).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: "responsiblePerson",
      header: "Người phụ trách",
      sortable: true,
      render: (contact) => (
        <Select
          value={contact.responsiblePerson || "none"}
          onValueChange={(value) => updateResponsiblePerson(contact.id, value === "none" ? "" : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Chọn người phụ trách" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Không có</SelectItem>
            {STAFF_MEMBERS.map((staff) => (
              <SelectItem key={staff} value={staff}>
                {staff}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (contact) => (
        <Badge variant={
          contact.status === 'new' ? 'default' :
          contact.status === 'contacted' ? 'secondary' :
          contact.status === 'fake' ? 'destructive' :
          contact.status === 'booked' ? 'default' :
          contact.status === 'archived' ? 'outline' :
          'outline'
        }>
          {STATUS_OPTIONS.find(opt => opt.value === contact.status)?.label || contact.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Submitted",
      sortable: true,
      render: (contact) => (
        <span className="text-xs text-muted-foreground">
          {new Date(contact.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (contact) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { setSelectedContact(contact); setDetailOpen(true); }}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
          </Button>
          {contact.status === 'new' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateStatus(contact.id, 'contacted')}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
            </Button>
          )}
          {contact.status !== 'archived' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateStatus(contact.id, 'archived')}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Archive className="h-3.5 w-3.5 mr-1" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { setDeleteId(contact.id); setDeleteOpen(true); }}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
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
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Contact Messages</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">Manage contact form submissions from customers.</p>
        </div>
        <Button
          onClick={() => setShowEmailTest(!showEmailTest)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {showEmailTest ? 'Ẩn' : 'Hiện'} Test Email
        </Button>
      </div>

      {/* Email Test Section */}
      {showEmailTest && (
        <div className="mb-6 space-y-6">
          {/* Email Status */}
          <EmailStatus />
          
          {/* Email Test */}
          <Card className="border-2 border-blue-100 shadow-sm">
            <CardHeader className="pt-6 pb-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-xl font-inter-bold text-blue-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                Test Hệ Thống Email
              </CardTitle>
              <p className="text-sm text-blue-700">
                Kiểm tra cấu hình email và template trước khi sử dụng
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <EmailTest />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Messages Table Card */}
      <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
              <MessageSquare className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-inter-bold text-gray-900">Contact Form Submissions</div>
              <div className="text-sm font-inter-normal text-gray-600 mt-1">View and manage customer inquiries</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <DataTable<ContactRow>
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

      {/* Contact Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="mx-auto overflow-y-auto mx-auto my-auto">
          {/* Simple Header */}
          <DialogHeader className="text-center pb-6 border-b border-gray-200">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Chi Tiết Liên Hệ</DialogTitle>
            <p className="text-gray-600">Thông tin chi tiết về khách hàng</p>
          </DialogHeader>
          
          {selectedContact && (
            <div className="p-6">
              {/* Basic Information Row */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và Tên</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{selectedContact.fullName}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{selectedContact.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{selectedContact.whatsapp || 'Không có'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số Người Tham Gia</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{selectedContact.quantity} người</p>
                  </div>
                </div>
              </div>

              {/* Tour Details Row */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày Mong Muốn</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedContact.date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng Thái</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <Badge variant={
                      selectedContact.status === 'new' ? 'default' :
                      selectedContact.status === 'contacted' ? 'secondary' :
                      selectedContact.status === 'fake' ? 'destructive' :
                      selectedContact.status === 'booked' ? 'default' :
                      selectedContact.status === 'archived' ? 'outline' :
                      'outline'
                    } className="text-sm">
                      {STATUS_OPTIONS.find(opt => opt.value === selectedContact.status)?.label || selectedContact.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Management Row */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Người Phụ Trách</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{selectedContact.responsiblePerson || 'Chưa phân công'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thời Gian Gửi</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedContact.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              {selectedContact.message && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tin Nhắn Từ Khách Hàng</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 italic">"{selectedContact.message}"</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành Động Nhanh</h3>
                <div className="flex gap-3">
                  {selectedContact.status === 'new' && (
                    <Button 
                      onClick={() => {
                        updateStatus(selectedContact.id, 'contacted');
                        setDetailOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Đánh dấu đã liên hệ
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => {
                      updateStatus(selectedContact.id, 'fake');
                      setDetailOpen(false);
                    }}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Đánh dấu khách ảo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      updateStatus(selectedContact.id, 'booked');
                      setDetailOpen(false);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Đánh dấu đã book
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="px-6 py-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setDetailOpen(false)}
              className="px-6 py-2"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Xóa Tin Nhắn
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả thông tin liên quan.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa Vĩnh Viễn
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}


