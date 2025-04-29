// components/BackButton.tsx
"use client";

import { useRouter } from "next/navigation"; // Use next/navigation in App Router

const BackButton = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Goes to the previous page in the browser history
  };

  return (
    <button
      onClick={handleGoBack}
      className="bg-[#6be4b9] text-white py-3 px-6 rounded-lg shadow-lg hover:bg-[#56c59b] transition-all duration-300"
    >
      ← Back
    </button>
  );
};

export default BackButton;
