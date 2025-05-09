import Image from "next/image"; // ✅ Next Image нэмэх
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, signIn } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <body className="min-h-screen min-w-screen max-h-screen max-w-screen relative bg-[#] text-[#d6faff] overflow-hidden flex items-center justify-center px-4">
      {/* ✅ Background Image with slight visibility */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://mk.edu.mn/wp-content/uploads/2025/01/f.png"
          alt="Login Background"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-[#5584c6] bg-opacity-20" />
      </div>

      {/* ✅ Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white backdrop-blur-lg p-8 pt-4 rounded-2xl shadow-sm shadow-[#5584c6] space-y-8 animate-fade-in">
        {/* ✅ LOGO */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-gradient-to-br from-[#a0bbdf] from-40% to-[#c68c8c] shadow-sm hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/moko.png"
              alt="Монгол Коосэн лого"
              width={84}
              height={84}
              className="object-contain drop-shadow-sm transition duration-300"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl pt-0 font-bold text-center text-black tracking-tight">
          Нэвтрэх хуудас
        </h1>

        {/* Login Form */}
        <form
          className="space-y-4 pt-0 w-full bg-[#ffffff] rounded-md p-4 shadow-sm "
          action={async (formData) => {
            "use server";
            await executeAction({
              actionFn: async () => {
                await signIn("credentials", formData);
              },
            });
          }}
        >
          <Input
            name="email"
            placeholder="Имэйл хаяг"
            type="email"
            required
            autoComplete="email"
            className="w-full p-3 rounded-md bg-[#ffffff] text-black placeholder-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-white transition"
          />
          <Input
            name="password"
            placeholder="Нууц үг"
            type="password"
            required
            autoComplete="current-password"
            className="w-full p-3 rounded-md bg-[#ffffff] text-black placeholder-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#24ffa5] transition"
          />

          <Button
            className="w-full  bg-[#5584c6] text-[#0f181e] font-semibold py-3 rounded-xl hover:bg-[#92ddce] transition duration-200"
            type="submit"
          >
            Нэвтрэх
          </Button>
        </form>
      </div>

      {/* ✅ Footer */}
      <footer className="absolute bottom-4 w-full text-center text-xs text-gray-500/70 z-10">
        © 2025 Монгол Коосэн. Бүх эрх хуулиар хамгаалагдсан.
      </footer>

      {/* ✅ Animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </body>
  );
};

export default Page;
