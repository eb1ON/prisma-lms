// src/app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import SessionWrapper from "@/components/SessionWrapper"; // 👈

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '"Монгол Коосэн" Технологийн Коллеж',
  description: "lms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          {" "}
          {/* ✅ client талаас SessionProvider-оор бүрхэнэ */}
          <main className="flex items-center justify-center bg-white min-h-screen">
            <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
              {children}
            </div>
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}
