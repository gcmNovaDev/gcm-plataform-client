import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Process Platform",
  description: "Process Platform",
  icons: {
    icon: "/Logo/GCM_Mesa_De_Trabajo1.png",
  },
};

import { AuthProvider } from "@/gcm-plataform/components/auth/AuthContext";
import RouteGuard from "@/gcm-plataform/components/auth/RouteGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
