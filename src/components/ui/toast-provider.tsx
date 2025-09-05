"use client";

import * as React from "react";
import { createContext, useContext, useState } from "react";
import { Toast, ToastClose, ToastDescription, ToastTitle } from "./toast";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, "id">) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto hide after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        hideToast(id);
      }, toast.duration || 5000);
    }
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastIcon = (variant: ToastData["variant"]) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "destructive":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast Container - Top Right */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-in slide-in-from-top-full duration-300 ease-out"
          >
            <Toast variant={toast.variant} className="border-0 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getToastIcon(toast.variant)}
                </div>
                <div className="flex-1 min-w-0">
                  <ToastTitle>{toast.title}</ToastTitle>
                  {toast.description && (
                    <ToastDescription className="mt-1">
                      {toast.description}
                    </ToastDescription>
                  )}
                </div>
              </div>
              <ToastClose 
                onClick={() => hideToast(toast.id)}
                className="absolute right-2 top-2 opacity-70 hover:opacity-100 transition-opacity"
              />
            </Toast>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
