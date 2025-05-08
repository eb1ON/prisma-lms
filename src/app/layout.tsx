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
            <div className="flex min-w-full min-h-screen">
              {/* Sidebar */}
              <div className="hidden sm:block fixed top-0 left-0 h-screen">
                <SideNav />
              </div>

              {/* Mobile Sidebar placeholder (bottom nav аль хэдийн SideNav дээр байгаа тул энэ хангалттай) */}
              <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30">
                <SideNav />
              </div>

              {/* Content */}
              <div className="flex-1 w-full transition-all duration-300 ease-in-out sm:ml-[270px]">
                {children}
              </div>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
