import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import SideNav from "@/components/ui/side-nav";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: '"Монгол Коосэн" Технологийн Коллеж',
  description: "lms",
};

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#283131] text-white`}>
        <div className="flex bg-[#283131]">
          <SideNav />
          <div className="w-full overflow-x-auto">
            <div className="flex-grow overflow-y-auto h-screen">
              <div className="w-full flex justify-center mx-auto">
                <div className="w-full md:max-w-6xl">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export { metadata };
export default Layout;
