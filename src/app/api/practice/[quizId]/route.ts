import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  // 1) await params before using
  const { quizId } = await params;

  // 2) pull studentId from query if you need it
  const studentId = req.nextUrl.searchParams.get('studentId') || 'anonymous';

  const filePath = path.join(
    process.cwd(),
    'shared-files',
    'quizzes',
    `quiz_${quizId}.json`
  );

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const quiz = JSON.parse(raw);

    // Shuffle questions/options for practice
    const shuffledQuestions = shuffle(quiz.questions).map((q: any) => {
      const originalOptions = q.options;
      const shuffledOptions = shuffle(originalOptions);

      // find new index of the correct answer
      const newAnswerIndex = shuffledOptions.findIndex(
        opt => opt === originalOptions[q.answerIndex]
      );

      return {
        ...q,
        options: shuffledOptions,
        answerIndex: newAnswerIndex,
      };
    });

    return NextResponse.json({
      quizId,
      title: `Practice - ${quiz.title}`,
      questions: shuffledQuestions
    });
  } catch (err) {
    console.error(err);
    return new NextResponse('Practice quiz not found', { status: 404 });
  }
}
