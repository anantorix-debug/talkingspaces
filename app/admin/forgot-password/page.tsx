import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password | Talking Spaces Interiors",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Forgot your password?</h1>
        <p className="mt-3 text-sm text-gray-600">
          This admin panel doesn&apos;t have automated email-based password resets set up.
          Ask your Master Admin to reset your password for you from the Users page.
        </p>
        <Link href="/admin/login" className="mt-6 inline-block text-sm font-medium text-gray-900 underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
