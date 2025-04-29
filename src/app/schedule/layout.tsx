import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import SideNav from "@/components/ui/side-nav";

const inter = Inter({ subsets: ["latin"] });

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

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="mn" className="h-full">
      <body
        className={`${inter.className} bg-[#283131] h-full flex overflow-hidden`}
      >
        <SideNav />
        <div className="w-full h-full overflow-hidden flex flex-col">
          <div className="flex-grow overflow-y-auto h-full">
            <div className="w-full flex justify-center mx-auto">
              <main className="w-full max-w-7xl">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
