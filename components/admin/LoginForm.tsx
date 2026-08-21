"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/admin/auth";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal";
const labelClass = "mb-1.5 block text-xs font-medium text-gray-700";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-teal-dark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-xs text-gray-500">
        <a href="/admin/forgot-password" className="underline hover:text-gray-700">
          Forgot your password?
        </a>
      </p>
    </form>
  );
}
