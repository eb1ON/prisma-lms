"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DescriptionPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const description = searchParams.get("description");

  // Modal нээгдэхэд scroll-г хаах
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
      <div className="bg-background text-foreground rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative border border-border">
        <button
          onClick={() =>
            router.push(window.location.pathname, { scroll: false })
          }
          className="absolute top-3 right-4 text-2xl text-muted-foreground hover:text-red-500 transition"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Хичээлийн Агуулга
        </h2>
        <p className="whitespace-pre-line leading-relaxed text-lg md:text-xl lg:text-2xl font-light text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
