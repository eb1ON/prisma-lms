"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const SignOut = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!mounted) return null;

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleSignOut}
        className={`font-bold border transition-colors duration-200 ${
          theme === "light"
            ? "bg-[#5584c6] text-white border-[#5584c6] hover:bg-[#406dab] active:bg-[#305090] focus:ring-2 focus:ring-[#406dab]"
            : "bg-[#374151] text-white border-[#374151] hover:bg-[#1f2937] active:bg-[#111827] focus:ring-2 focus:ring-[#1f2937]"
        }`}
      >
        Гарах
      </Button>
    </div>
  );
};

export { SignOut };
