// app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GA4 데이터 분석 - 자연어 쿼리",
  description: "자연어로 GA4 데이터를 조회하고 분석하는 서비스",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="ko">
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-white`}>
        <AppProvider>
          <div className="claude-container">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}