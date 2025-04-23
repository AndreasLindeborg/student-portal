"use client";

import { useAuth0 } from "@auth0/auth0-react";

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Student Login</h1>
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    </main>
  );
}
