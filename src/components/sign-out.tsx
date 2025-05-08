"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex justify-center">
      <Button
        className="bg-[#5584c6] text-white font-bold border border-[#5584c6]"
        variant="destructive"
        onClick={handleSignOut}
      >
        Гарах
      </Button>
    </div>
  );
};

export { SignOut };
