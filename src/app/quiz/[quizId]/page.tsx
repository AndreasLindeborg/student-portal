'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import type { Quiz } from '@/types/quiz';

export default function QuizPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  // load quiz metadata
  useEffect(() => {
    async function loadQuiz() {
      const res = await fetch(`/api/quizzes/${quizId}`);
      if (!res.ok) return console.error('Quiz not found');
      const data: Quiz = await res.json();
      setQuiz(data);
      setAnswers(Array(data.questions.length).fill(-1));
    }
    loadQuiz();
  }, [quizId]);

  const handleSelect = (qIndex: number, aIndex: number) => {
    const copy = [...answers];
    copy[qIndex] = aIndex;
    setAnswers(copy);
  };

  const handleSubmit = async () => {
    if (!quiz || !user) return;

    // 1) strip off any "auth0|" prefix if present
    const rawSub = user.sub!;                           // e.g. "auth0|6809277e35629091a442a64b"
    const idOnly = rawSub.includes('|') ? rawSub.split('|')[1] : rawSub;
    const studentId = encodeURIComponent(idOnly);       // "6809277e35629091a442a64b"

    const submittedAt = new Date().toISOString();
    const score = quiz.questions.reduce(
      (sum, q, idx) => sum + (answers[idx] === q.answerIndex ? 1 : 0),
      0
    );

    const result = {
      quizId,
      studentId,
      score,
      total: quiz.questions.length,
      submittedAt,
      feedback:
        score === quiz.questions.length
          ? "Excellent work! You've got full marks."
          : "Thanks for participating! You can review your answers in the results.",
    };

    try {
      // 2) POST to the param’ed endpoint
      await fetch(`/api/submit/${quizId}/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, result }),
      });
    } catch (e) {
      console.error('Submit failed', e);
      return;
    }

    // 3) redirect to the fully parameterized result page
    router.push(`/result/${quizId}/${studentId}`);
  };

  if (isLoading) return <main className="p-6">Loading user…</main>;
  if (!isAuthenticated) return <main className="p-6">Please log in first.</main>;
  if (!quiz) return <main className="p-6">Loading quiz…</main>;

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>

      {quiz.questions.map((q, i) => (
        <div key={q.id} className="border p-4 rounded bg-white dark:bg-zinc-800">
          <p className="mb-2 font-medium">
            {i + 1}. {q.text}
          </p>
          <ul className="space-y-1">
            {q.options.map((opt, j) => (
              <li key={j}>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === j}
                    onChange={() => handleSelect(i, j)}
                  />
                  <span>{opt}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 px-6 py-2 rounded text-white hover:bg-green-700"
      >
        Submit Quiz
      </button>

      <button
        onClick={() => router.push('/dashboard')}
        className="block mt-4 text-blue-600 underline"
      >
        ← Back to Dashboard
      </button>
    </main>
  );
}
