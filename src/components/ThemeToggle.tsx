"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    // SSR үед болон эхний ачаалалд ямар ч юм гаргахгүй
    return null;
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={toggleTheme}
        className={`text-white font-bold border transition-colors duration-200 ${
          theme === "light"
            ? "bg-[#5584c6] border-[#5584c6] hover:bg-[#406dab] active:bg-[#305090] focus:ring-2 focus:ring-[#406dab]"
            : "bg-[#374151] border-[#374151] hover:bg-[#1f2937] active:bg-[#111827] focus:ring-2 focus:ring-[#1f2937]"
        }`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </Button>
    </div>
  );
};

export { ThemeToggle };
