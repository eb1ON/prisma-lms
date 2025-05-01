// components/DescriptionPanel.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DescriptionPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const description = searchParams.get("description");

  // Modal гарсан үед scroll-г хаах
  useEffect(() => {
    if (description) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [description]);

  if (!description) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-[#1c1f23] text-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative">
        <button
          onClick={() =>
            router.push(window.location.pathname, { scroll: false })
          }
          className="absolute top-3 right-4 text-2xl text-gray-300 hover:text-red-400"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#24ffa5]">
          Хичээлийн Агуулга
        </h2>
        <p className="whitespace-pre-line text-gray-300 leading-relaxed text-lg md:text-xl lg:text-2xl font-light">
          {description}
        </p>
      </div>
    </div>
  );
}
