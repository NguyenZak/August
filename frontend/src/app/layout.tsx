import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";

import { ContactProvider } from "@/context/ContactContext";
import { AuthProvider } from "@/context/AuthContext";
import ContactPopup from "@/components/common/ContactPopup";
import ChatWidget from "@/components/common/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "August - Facebook Marketing Platform",
  description: "Giải pháp quản lý và tự động hóa Marketing trên Facebook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ContactProvider>
            {children}
            <ContactPopup />
            <ChatWidget />
          </ContactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
