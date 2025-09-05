"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function EmailTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    type: 'success' | 'error' | null;
  } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    email: "test@example.com",
    whatsapp: "+84 123 456 789",
    quantity: 2,
    date: new Date().toISOString().split('T')[0],
    message: "Tôi muốn tìm hiểu về tour du lịch Đà Nẵng - Hội An 3 ngày 2 đêm."
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Email test đã được gửi thành công! Kiểm tra hộp thư của bạn.',
          type: 'success'
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Có lỗi xảy ra khi gửi email test',
          type: 'error'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Lỗi kết nối mạng hoặc server',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          Test Gửi Email
        </CardTitle>
        <p className="text-sm text-gray-600">
          Kiểm tra cấu hình email và template trước khi sử dụng trong production
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="+84 123 456 789"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Số người</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                placeholder="Số người tham gia"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date">Ngày mong muốn</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Tin nhắn</Label>
            <Textarea
              id="message"
              rows={3}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Nhập tin nhắn test..."
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi email test...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Gửi Email Test
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Result Display */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${
            result.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {result.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">{result.message}</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📋 Hướng dẫn sử dụng:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Điền thông tin test vào form bên trên</li>
            <li>• Nhấn "Gửi Email Test" để kiểm tra cấu hình</li>
            <li>• Kiểm tra hộp thư của email đã nhập</li>
            <li>• Đảm bảo đã cấu hình EMAIL_USER và EMAIL_PASS trong .env.local</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
