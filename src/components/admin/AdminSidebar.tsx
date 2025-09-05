"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Compass, 
  MapPin, 
  Waypoints, 
  Tag, 
  Package,
  Users,
  Settings,
  CalendarDays,
  Receipt,
  BadgePercent,
  BarChart3,
  FileText,
  Quote,
  Images,
  MessageSquare,
  LifeBuoy,
  Palette,
  Edit3,
  Mail,
  TrendingUp,
  CreditCard,
  Shield,
  Zap,
  Plane,
  Folder
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard, badge: null },
    ]
  },
  {
    name: "Bookings & Sales",
    items: [
      { name: "Bookings", href: "/admin/bookings", icon: CalendarDays, badge: "12" },
      { name: "Customers", href: "/admin/customers", icon: Users, badge: null },
      { name: "Messages", href: "/admin/messages", icon: MessageSquare, badge: "5" },
      { name: "Invoices", href: "/admin/invoices", icon: Receipt, badge: "3" },
      { name: "Coupons", href: "/admin/coupons", icon: BadgePercent, badge: null },
      { name: "Reports", href: "/admin/reports", icon: BarChart3, badge: null },
    ]
  },
  {
    name: "Content Management",
    items: [
      { name: "Regions", href: "/admin/regions", icon: Compass, badge: null },
      { name: "Destinations", href: "/admin/destinations", icon: MapPin, badge: null },
      { name: "Tours", href: "/admin/tours", icon: Plane, badge: null },
      { name: "Blog", href: "/admin/blog", icon: FileText, badge: null },
      { name: "Blog Categories", href: "/admin/categories", icon: Folder, badge: null },
      { name: "Tags", href: "/admin/tags", icon: Tag, badge: null },
      { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare, badge: null },
    ]
  },
  {
    name: "System & Admin",
    items: [
      { name: "Administrators", href: "/admin/users", icon: Shield, badge: null },
      { name: "Form Editor", href: "/admin/form-editor", icon: Edit3, badge: null },
      { name: "Email Templates", href: "/admin/email-editor", icon: Mail, badge: null },
      { name: "Settings", href: "/admin/settings", icon: Settings, badge: null },
      { name: "Appearance", href: "/admin/appearance", icon: Palette, badge: null },
      { name: "Support", href: "/admin/support", icon: LifeBuoy, badge: null },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm min-h-[calc(100vh-32px)]">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 font-medium">Roving Vietnam Travel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.name}>
            <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.name}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-500 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon 
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                          )} 
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          isActive 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">Quick Stats</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Today's Bookings:</span>
              <span className="font-semibold text-green-600">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue:</span>
              <span className="font-semibold text-blue-600">$2,450</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
