"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, AlertCircle, Clock, Settings } from "lucide-react";

interface EmailStatus {
  isConfigured: boolean;
  lastTest?: {
    success: boolean;
    timestamp: string;
    message: string;
  };
  configStatus: {
    emailUser: boolean;
    emailPass: boolean;
    adminEmail: boolean;
  };
}

export default function EmailStatus() {
  const [status, setStatus] = useState<EmailStatus>({
    isConfigured: false,
    configStatus: {
      emailUser: false,
      emailPass: false,
      adminEmail: false
    }
  });

  useEffect(() => {
    checkEmailStatus();
  }, []);

  const checkEmailStatus = async () => {
    try {
      const response = await fetch('/api/admin/email-status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error checking email status:', error);
    }
  };

  const getConfigStatusColor = (isConfigured: boolean) => {
    return isConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getConfigStatusIcon = (isConfigured: boolean) => {
    return isConfigured ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
          Trạng Thái Hệ Thống Email
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Configuration Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Cấu Hình Email</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getConfigStatusIcon(status.configStatus.emailUser)}
                <span className="text-sm font-medium">Email User</span>
              </div>
              <Badge 
                variant="outline" 
                className={getConfigStatusColor(status.configStatus.emailUser)}
              >
                {status.configStatus.emailUser ? 'Đã cấu hình' : 'Chưa cấu hình'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getConfigStatusIcon(status.configStatus.emailPass)}
                <span className="text-sm font-medium">Email Password</span>
              </div>
              <Badge 
                variant="outline" 
                className={getConfigStatusColor(status.configStatus.emailPass)}
              >
                {status.configStatus.emailPass ? 'Đã cấu hình' : 'Chưa cấu hình'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getConfigStatusIcon(status.configStatus.adminEmail)}
                <span className="text-sm font-medium">Admin Email</span>
              </div>
              <Badge 
                variant="outline" 
                className={getConfigStatusColor(status.configStatus.adminEmail)}
              >
                {status.configStatus.adminEmail ? 'Đã cấu hình' : 'Chưa cấu hình'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Trạng thái tổng thể:</span>
            <Badge 
              variant={status.isConfigured ? "default" : "destructive"}
              className="text-sm"
            >
              {status.isConfigured ? 'Sẵn sàng' : 'Cần cấu hình'}
            </Badge>
          </div>
        </div>

        {/* Last Test Result */}
        {status.lastTest && (
          <div className="pt-3 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Kết quả test gần nhất</h4>
            <div className={`p-3 rounded-lg border ${
              status.lastTest.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {status.lastTest.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  status.lastTest.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {status.lastTest.success ? 'Thành công' : 'Thất bại'}
                </span>
              </div>
              <p className={`text-sm ${
                status.lastTest.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {status.lastTest.message}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {new Date(status.lastTest.timestamp).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={checkEmailStatus}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Kiểm tra lại
            </button>
          </div>
        </div>

        {/* Help Text */}
        {!status.isConfigured && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Cần cấu hình email</h4>
            <p className="text-sm text-yellow-700 mb-2">
              Để sử dụng hệ thống email tự động, bạn cần:
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 ml-4">
              <li>• Tạo file .env.local với EMAIL_USER và EMAIL_PASS</li>
              <li>• Cấu hình app password cho Gmail</li>
              <li>• Đặt ADMIN_EMAIL để nhận thông báo</li>
            </ul>
            <p className="text-sm text-yellow-700 mt-2">
              Xem file <code className="bg-yellow-100 px-1 rounded">docs/EMAIL_SETUP.md</code> để biết chi tiết.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
