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
        className="bg-[#283131] text-[#6be4b9] border border-[#6be4b9]"
        variant="destructive"
        onClick={handleSignOut}
      >
        Гарах
      </Button>
    </div>
  );
};

export { SignOut };
