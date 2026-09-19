import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/ui/Toast";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalSearch } from "@/components/features/GlobalSearch";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenSource Companion",
  description: "Your path into open source starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased font-sans text-[var(--color-primary-text)] bg-[var(--color-background)] selection:bg-[var(--color-primary-accent)] selection:text-white`}>
        <AuthProvider>
          <ToastProvider>
            <AppShell>
              {children}
            </AppShell>
            <GlobalSearch />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
