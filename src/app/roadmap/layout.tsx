import { ReactNode } from "react";
import SideNav from "@/components/ui/side-nav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {children}
    </div>
  );
}
