'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim()) {
      localStorage.setItem('studentId', studentId);
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
      <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-800 p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">Student Login</h1>
        <input
          type="text"
          placeholder="Enter your student ID"
          className="w-full p-2 border rounded text-black"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Log In
        </button>
      </form>
    </main>
  );
}
