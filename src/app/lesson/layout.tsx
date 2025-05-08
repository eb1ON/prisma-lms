import { ReactNode } from "react";
import SideNav from "@/components/ui/side-nav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Side Navigation */}
      <div className="sticky top-0 left-0 h-screen bg-background border-r border-border z-30">
        <SideNav />
      </div>

      {/* Content */}
      <main className="flex-1 bg-background text-foreground p-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
