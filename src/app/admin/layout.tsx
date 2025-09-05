import type { Metadata } from "next";
import AdminWrapper from "@/components/admin/AdminWrapper";

export const metadata: Metadata = {
  title: "Admin | Roving Vietnam Travel",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminWrapper>
      {children}
    </AdminWrapper>
  );
}




