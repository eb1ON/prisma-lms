import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import SideNav from "@/components/ui/side-nav";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '"Монгол Коосэн" Технологийн Коллеж',
  description: "LMS System",
};

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground transition-colors`}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex overflow-hidden min-w-full min-h-screen">
              <div className="fixed top-0 left-0 h-screen">
                <SideNav />
              </div>
              <div className="flex-1 justify-between min-w-screen w-full ml-[260px] mr-0">
                {children}
              </div>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
