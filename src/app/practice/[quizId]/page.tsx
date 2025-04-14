'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Quiz } from '@/types/quiz';

export default function PracticeQuizPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);

  useEffect(() => {
    async function fetchQuiz() {
      const studentId = localStorage.getItem('studentId') || 'anonymous';
      const res = await fetch(`/api/practice/${quizId}?studentId=${studentId}`);
      if (!res.ok) {
        console.error('Failed to load practice quiz.');
        return;
      }
      const data = await res.json();
      setQuiz(data);
      setAnswers(Array(data.questions.length).fill(-1));
      setRevealed(Array(data.questions.length).fill(false));
    }

    fetchQuiz();
  }, [quizId]);

  const handleSelect = (qIndex: number, aIndex: number) => {
    const updated = [...answers];
    updated[qIndex] = aIndex;
    setAnswers(updated);

    const newReveal = [...revealed];
    newReveal[qIndex] = true;
    setRevealed(newReveal);
  };

  if (!quiz) return <main className="p-6">Loading practice quiz...</main>;

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Practice: {quiz.title}</h1>
      {quiz.questions.map((q, index) => (
        <div key={q.id} className="border p-4 rounded bg-white dark:bg-zinc-800">
          <p className="font-medium mb-2">{index + 1}. {q.text}</p>
          <ul className="space-y-1">
            {q.options.map((opt, i) => {
              const selected = answers[index] === i;
              const correct = i === q.answerIndex;
              const wasRevealed = revealed[index];

              let color = '';
              if (wasRevealed) {
                if (selected && correct) color = 'text-green-600 font-semibold';
                else if (selected && !correct) color = 'text-red-600 font-semibold';
                else if (!selected && correct) color = 'text-green-500 italic';
              }

              return (
                <li key={i}>
                  <label className={`flex items-center space-x-2 ${color}`}>
                    <input
                      type="radio"
                      name={`q-${index}`}
                      value={i}
                      checked={selected}
                      disabled={wasRevealed}
                      onChange={() => handleSelect(index, i)}
                    />
                    <span>{opt}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Back to Dashboard Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="text-sm text-blue-600 underline mt-4 block"
      >
        ← Back to Dashboard
      </button>
    </main>
  );
}
