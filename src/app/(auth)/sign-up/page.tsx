import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const SignUpPage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/");

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Админ Нүүр Хуудас
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {/* Хичээл удирдлага */}
        <Link href="/admin/lessons">
          <div className="bg-blue-500 text-white py-5 px-4 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer transition-all text-center min-w-[160px]">
            <h2 className="text-base font-semibold mb-1">Хичээл удирдлага</h2>
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

export default SignUpPage;
