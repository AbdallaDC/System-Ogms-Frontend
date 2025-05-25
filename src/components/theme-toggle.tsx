"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenuButton
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      tooltip="Toggle Theme"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-5 w-5" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5" />
          <span>Dark Mode</span>
        </>
      )}
    </SidebarMenuButton>
  );
}
