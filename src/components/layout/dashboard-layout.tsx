"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { CustomerSidebar } from "@/components/sidebar/customer-sidebar";
import { Input } from "@/components/ui/input";
import { getUser } from "@/utils/getUser";
// import type { UserRole } from "@/lib/types"

// In a real application, this would come from your authentication system
let DEFAULT_ROLE = "admin";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  // In a real app, you would get the user's role from your auth context/API
  const [userRole, setUserRole] = useState<string>(DEFAULT_ROLE);
  const { user } = getUser();

  useEffect(() => {
    if (user?.role === "admin") {
      setUserRole("admin");
    } else {
      setUserRole("customer");
    }
  }, [user]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Render different sidebar based on user role */}
        {userRole === "admin" ? <AdminSidebar /> : <CustomerSidebar />}

        {/* Main content area */}
        <div className="flex flex-1 flex-col">
          {/* Global header with SidebarTrigger */}
          <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px]">
            <SidebarTrigger />
            {/* <div className="w-full flex-1">
              <form className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg pl-8 md:w-2/3 lg:w-1/3"
                />
              </form>
            </div> */}
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
