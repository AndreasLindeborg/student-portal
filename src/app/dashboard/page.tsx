'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Quiz } from '@/types/quiz';

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    async function fetchQuizzes() {
      const studentId = localStorage.getItem('studentId') || 'anonymous';

      const userRes = await fetch(`/api/users/${studentId}`);
      if (!userRes.ok) {
        console.error('Failed to fetch student info');
        return;
      }
      const user = await userRes.json();

      const allRes = await fetch('/api/quizzes');
      const allQuizzes = await allRes.json();

      // Filter based on enrolledQuizzes
      const filtered = allQuizzes.filter((quiz: Quiz) =>
        user.enrolledQuizzes.includes(quiz.quizId)
      );

      setQuizzes(filtered);
    }

    fetchQuizzes();
  }, []);

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-black text-black dark:text-white">
      <button
        onClick={() => {
          localStorage.removeItem('studentId');
          window.location.href = '/login';
        }}
        className="mb-4 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Change Student
      </button>

      <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>
      <ul className="space-y-4">
        {quizzes.map((quiz) => (
          <li key={quiz.quizId} className="border p-4 rounded bg-white dark:bg-zinc-800">
            <h2 className="text-lg font-semibold">{quiz.title}</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center mt-2">
              <Link
                href={`/quiz/${quiz.quizId}`}
                className="text-blue-600 dark:text-blue-400 underline"
              >
                Start Quiz
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link
                href={`/result/${quiz.quizId}`}
                className="text-purple-600 dark:text-purple-400 underline"
              >
                View Result
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link
                href={`/practice/${quiz.quizId}`}
                className="text-green-600 dark:text-green-400 underline"
              >
                Practice Quiz
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}