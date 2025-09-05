"use client";

import { SessionProvider } from "next-auth/react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <AdminTopbar />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 min-h-[calc(100vh-48px)]">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}
