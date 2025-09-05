"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User2, Bell, Search, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminTopbar() {
  const { data } = useSession();
  const email = data?.user?.email;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="h-10 px-3 flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-6 h-6 w-48 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 text-xs"
            />
          </div>
        </div>

        {/* Right side - Actions & User */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-1 h-6 w-6">
            <Bell className="h-3 w-3 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
            <HelpCircle className="h-3 w-3 text-gray-600" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
            <Settings className="h-3 w-3 text-gray-600" />
          </Button>

          {/* Divider */}
          <div className="h-4 w-px bg-gray-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-1">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-gray-900">{email ?? "Admin"}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            
            <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User2 className="h-3 w-3 text-white" />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="h-6 px-2 text-xs border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <LogOut className="h-2.5 w-2.5 mr-1" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}


