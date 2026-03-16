import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";

import { ContactProvider } from "@/context/ContactContext";
import { AuthProvider } from "@/context/AuthContext";
import ContactPopup from "@/components/common/ContactPopup";
import ChatWidget from "@/components/common/ChatWidget";
import Tracker from "@/components/common/Tracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "August - Facebook Marketing Platform",
    template: "%s | August"
  },
  description: "Giải pháp quản lý và tự động hóa Marketing trên Facebook. Chuyên nghiệp, hiệu quả và tối ưu.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://augustevents.co.uk",
    siteName: "August",
    images: [
      {
        url: "/assets/august/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "August Marketing Platform",
      },
    ],
  },
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
            <Tracker />
            <ContactPopup />
            <ChatWidget />
          </ContactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
