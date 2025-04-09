import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";

const AdminHomePage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/");

  return (
    <html lang="mn" className="h-full">
      <body className="min-h-screen w-full bg-[#0f181e] text-[#d6faff] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#13272e] border border-[#1e3a44] rounded-2xl shadow-xl px-8 py-10 space-y-8">
          <h1 className="text-2xl font-bold text-center text-white">
            Админ нүүр хуудас
          </h1>

          <div className="flex flex-col gap-4">
            <AdminCard href="/admin/lessons" label="Хичээл удирдлага" />
            <AdminCard
              href="/admin/timetable"
              label="Хичээлийн хуваарь удирдлага"
            />
            <AdminCard href="/admin/users" label="Хэрэглэгчийн удирдлага" />
            <AdminCard href="/admin/schedule" label="Хуанли удирдлага" />
          </div>
        </Link>

        {/* Хичээлийн хуваарь удирдлага */}
        <Link href="/admin/timetable">
          <div className="bg-red-500 text-white py-5 px-4 rounded-lg shadow-md hover:bg-red-600 cursor-pointer transition-all text-center min-w-[160px]">
            <h2 className="text-base font-semibold mb-1">
              Хичээлийн хуваарь удирдлага
            </h2>
          </div>
        </Link>

        {/* Хэрэглэгчийн удирдлага */}
        <Link href="/admin/users">
          <div className="bg-green-500 text-white py-5 px-4 rounded-lg shadow-md hover:bg-green-600 cursor-pointer transition-all text-center min-w-[160px]">
            <h2 className="text-base font-semibold mb-1">
              Хэрэглэгчийн удирдлага
            </h2>
          </div>
        </Link>

        {/* Хуваарь удирдлага */}
        <Link href="/admin/schedule">
          <div className="bg-yellow-500 text-white py-5 px-4 rounded-lg shadow-md hover:bg-yellow-600 cursor-pointer transition-all text-center min-w-[160px]">
            <h2 className="text-base font-semibold mb-1">Хуваарь удирдлага</h2>
          </div>
        </Link>
          {/* Хуваарь удирдлага */}
          <Link href="/admin/roadmap">
          <div className="bg-yellow-500 text-white py-5 px-4 rounded-lg shadow-md hover:bg-yellow-600 cursor-pointer transition-all text-center min-w-[160px]">
            <h2 className="text-base font-semibold mb-1">Сургалтын агуулга</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminHomePage;
