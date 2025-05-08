import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import SideNav from "@/components/ui/side-nav";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '"Монгол Коосэн" Технологийн Коллеж',
  description: "lms",
};

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black`}>
        <div className="flex overflow-hidden min-w-full min-h-screen">
          {/* Fixed SideNav */}
          <div className="fixed top-0 left-0 h-screen">
            <SideNav />
          </div>

          {/* Content Area */}
          <div className="flex-1  overflow-hidden justify-between min-w-screen  bg-white ml-[200px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
