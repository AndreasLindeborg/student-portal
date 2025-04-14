'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResultPage() {
  const { quizId } = useParams();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId') || 'anonymous';

    async function fetchResult() {
      try {
        const res = await fetch(`/api/results/${quizId}?studentId=${studentId}`);
        if (!res.ok) throw new Error('Result not found');
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchResult();
  }, [quizId]);

  if (!result) return <main className="p-6 text-xl">No result available.</main>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Quiz Result</h1>
      <p><strong>Quiz ID:</strong> {result.quizId}</p>
      <p><strong>Student ID:</strong> {result.studentId}</p>
      <p><strong>Submitted:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
      <p><strong>Score:</strong> {result.score} / {result.total}</p>

      <div className="bg-zinc-800 text-white p-4 rounded">
        <p><strong>Feedback</strong></p>
        <p>{result.feedback}</p>
      </div>

      <Link
        href="/dashboard"
        className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </main>
  );
}
