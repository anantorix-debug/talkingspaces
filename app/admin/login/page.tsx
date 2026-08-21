import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Talking Spaces Interiors",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/logo/logo-full-teal.png"
            alt="Talking Spaces Interiors"
            width={1134}
            height={1394}
            className="mb-3 h-20 w-auto"
            unoptimized
          />
          <p className="text-xs uppercase tracking-wide text-gray-400">Admin Panel</p>
        </div>
        <div className="border border-gray-200 bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
