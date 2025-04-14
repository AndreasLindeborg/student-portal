'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Quiz } from '@/types/quiz';

export default function QuizPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error('Quiz not found');
        const data = await res.json();
        setQuiz(data);
        setAnswers(Array(data.questions.length).fill(-1));
      } catch (err) {
        console.error('Quiz not found.');
      }
    }

    loadQuiz();
  }, [quizId]);

  const handleSelect = (qIndex: number, aIndex: number) => {
    const updated = [...answers];
    updated[qIndex] = aIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const studentId = localStorage.getItem('studentId') || 'anonymous';
    const submittedAt = new Date().toISOString();

    const score = quiz.questions.reduce((acc, question, index) => {
      return acc + (answers[index] === question.answerIndex ? 1 : 0);
    }, 0);

    const result = {
      quizId,
      studentId,
      score,
      total: quiz.questions.length,
      feedback:
        score === quiz.questions.length
          ? "Excellent work! You've got full marks."
          : "Thanks for participating! You can review your answers in the results.",
      submittedAt,
    };

    const answerData = {
      quizId,
      studentId,
      submittedAt,
      answers,
    };

    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          studentId,
          answers,
          result,
        }),
      });
    } catch (error) {
      console.error('Failed to save files:', error);
    }

    router.push(`/result/${quizId}`);
  };

  if (!quiz) return <main className="p-6 text-xl">Loading quiz...</main>;

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      {quiz.questions.map((q, index) => (
        <div key={q.id} className="border p-4 rounded bg-white dark:bg-zinc-800">
          <p className="font-medium mb-2">{index + 1}. {q.text}</p>
          <ul className="space-y-1">
            {q.options.map((opt, i) => (
              <li key={i}>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={i}
                    checked={answers[index] === i}
                    onChange={() => handleSelect(index, i)}
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
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Submit Quiz
      </button>

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
