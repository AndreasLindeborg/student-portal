import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  const url = new URL(req.url);
  const studentId = url.searchParams.get('studentId') || 'anonymous';

  const filePath = path.join(
    process.cwd(),
    'shared-files',
    'quizzes',
    `quiz_${params.quizId}.json`
  );

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const quiz = JSON.parse(raw);

    // Shuffle questions
    const shuffledQuestions = shuffle(quiz.questions).map((q: any) => {
      const originalOptions = q.options;
      const shuffledOptions = shuffle(originalOptions);

      // Update answerIndex to new index in shuffled options
      const newAnswerIndex = shuffledOptions.findIndex(
        (opt) => opt === originalOptions[q.answerIndex]
      );

      return {
        ...q,
        options: shuffledOptions,
        answerIndex: newAnswerIndex,
      };
    });

    return NextResponse.json({ ...quiz, questions: shuffledQuestions });
  } catch (err) {
    console.error(err);
    return new NextResponse('Practice quiz not found', { status: 404 });
  }
}