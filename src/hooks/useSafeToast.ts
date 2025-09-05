"use client";

import { useEffect, useState } from 'react';

interface ToastData {
  title: string;
  description?: string;
  variant: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
}

export function useSafeToast() {
  const [toast, setToast] = useState<{
    showToast: (toast: ToastData) => void;
    hideToast: (id: string) => void;
  } | null>(null);

  useEffect(() => {
    // Only initialize toast on client side
    if (typeof window !== 'undefined') {
      try {
        const { useToast } = require('@/components/ui/toast-provider');
        setToast(useToast());
      } catch (e) {
        console.warn('Toast not available:', e);
        // Provide fallback functions
        setToast({
          showToast: () => {},
          hideToast: () => {}
        });
      }
    }
  }, []);

  return {
    showToast: toast?.showToast || (() => {}),
    hideToast: toast?.hideToast || (() => {})
  };
}
