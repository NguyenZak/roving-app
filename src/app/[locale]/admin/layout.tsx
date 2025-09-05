import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin | Roving Vietnam Travel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-r hidden md:block">
        <div className="p-4 font-bold text-lg">Admin</div>
        <nav className="px-2 py-2 space-y-1 text-sm">
          <Link href="/admin/destinations" className="block px-3 py-2 rounded hover:bg-muted">Destinations</Link>
          <Link href="/admin/tours" className="block px-3 py-2 rounded hover:bg-muted">Tours</Link>
        </nav>
      </aside>
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}


