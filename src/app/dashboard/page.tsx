'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { Quiz } from "@/types/quiz";

interface Profile {
  studentId: string;
  email: string;
  name: string;
  enrolledQuizzes: string[];
}

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth0();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // 1) On auth, ensure the JSON-profile exists (GET → if 404 then POST to create it)
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const rawSub = user.sub!;                               // e.g. "auth0|6809277e35629091a442a64b"
    const studentId = encodeURIComponent(
      rawSub.includes('|') ? rawSub.split('|')[1] : rawSub
    );
    const apiUrl = `/api/users/${studentId}`;

    (async () => {
      let res = await fetch(apiUrl);
      if (res.status === 404) {
        // not found → create it
        res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name
          })
        });
      }
      const data: Profile = await res.json();
      setProfile(data);
    })();
  }, [isLoading, isAuthenticated, user]);

  // 2) Once profile is loaded, fetch and filter quizzes
  useEffect(() => {
    if (!profile) return;

    (async () => {
      const allRes = await fetch("/api/quizzes");
      const allQuizzes: Quiz[] = await allRes.json();

      const filtered = allQuizzes.filter(q =>
        profile.enrolledQuizzes.includes(q.quizId)
      );
      setQuizzes(filtered);
    })();
  }, [profile]);

  // 3) Render guards
  if (isLoading) return <p>Loading…</p>;
  if (!isAuthenticated) return <p>Please log in first.</p>;
  if (!profile) return <p>Initializing your profile…</p>;

  // strip off the prefix again for client-side links
  const rawSub = user!.sub!;
  const studentId = encodeURIComponent(
    rawSub.includes('|') ? rawSub.split('|')[1] : rawSub
  );

  // 4) Actual dashboard UI
  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-black text-black dark:text-white">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Welcome, {profile.name || profile.email}!
        </h1>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Log Out
        </button>
      </div>

      <h2 className="text-xl mb-4">Available Quizzes</h2>
      <ul className="space-y-4">
        {quizzes.map((quiz) => (
          <li
            key={quiz.quizId}
            className="border p-4 rounded bg-white dark:bg-zinc-800"
          >
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link
                href={`/quiz/${quiz.quizId}`}
                className="text-blue-600 dark:text-blue-400 underline"
              >
                Start Quiz
              </Link>
              <Link
                href={`/result/${quiz.quizId}/${studentId}`}
                className="text-purple-600 dark:text-purple-400 underline"
              >
                View Result
              </Link>
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
