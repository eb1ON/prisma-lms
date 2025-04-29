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
    <body className="min-h-screen w-full relative bg-[#0f181e] text-[#d6faff] overflow-hidden flex items-center justify-center px-4">
      {/* ✅ Background Image with slight visibility */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://mk.edu.mn/wp-content/uploads/2025/01/f.png"
          alt="Login Background"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-[#0f181e] bg-opacity-50" />
      </div>

      {/* ✅ Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#13272ed9] backdrop-blur-lg p-8 rounded-2xl shadow-xl space-y-8 border border-[#24ffa530] animate-fade-in">
        {/* ✅ LOGO */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-[#0f181e] flex items-center justify-center border border-[#24ffa5] shadow-inner shadow-[#24ffa520] hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/moko.png"
              alt="Монгол Коосэн лого"
              width={64}
              height={64}
              className="object-contain drop-shadow-sm transition duration-300"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-white tracking-tight">
          Нэвтрэх хуудас
        </h1>

        {/* Login Form */}
        <form
          className="space-y-4 w-full"
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
            className="w-full p-3 rounded-md bg-[#0f181e] border border-[#2a4c56] text-[#d6faff] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24ffa5] transition"
          />
          <Input
            name="password"
            placeholder="Нууц үг"
            type="password"
            required
            autoComplete="current-password"
            className="w-full p-3 rounded-md bg-[#0f181e] border border-[#2a4c56] text-[#d6faff] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24ffa5] transition"
          />

          <Button
            className="w-full bg-[#24ffa5] text-[#0f181e] font-semibold py-3 rounded-md hover:bg-[#1fe697] transition duration-200"
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
