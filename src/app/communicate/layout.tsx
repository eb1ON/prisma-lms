import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import SideNav from "@/components/ui/side-nav";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: '"Монгол Коосэн" Технологийн Коллеж',
  description: "lms",
};

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="mn">
      <body
        className={`flex flex-row min-h-screen w-screen overflow-x-hidden ${geistSans.variable} ${geistMono.variable}`}
      >
        <div className="flex bg-[#1e2627]">
          <SideNav />
        </div>
        <main className="flex-grow bg-[#1e2627] p-0">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
};

export { metadata };
export default Layout;
