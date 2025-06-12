import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  );
}
