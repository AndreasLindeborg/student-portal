import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(
  req: NextRequest,
  { params }: { params: { quizId: string; studentId: string } }
) {
  // await the params object first
  const { quizId, studentId } = await params;
  const { answers, result } = await req.json();

  if (!quizId || !studentId || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const basePath = path.join(process.cwd(), 'shared-files');

    // Write answers file
    const answerPath = path.join(
      basePath,
      'answers',
      `answers_${quizId}_${studentId}.json`
    );
    fs.writeFileSync(
      answerPath,
      JSON.stringify(
        {
          quizId,
          studentId,
          submittedAt: new Date().toISOString(),
          answers,
        },
        null,
        2
      )
    );

    // Write result file (if provided)
    if (result) {
      const resultPath = path.join(
        basePath,
        'results',
        `result_${quizId}_${studentId}.json`
      );
      fs.writeFileSync(
        resultPath,
        JSON.stringify(
          {
            quizId,
            studentId,
            submittedAt: new Date().toISOString(),
            ...result,
          },
          null,
          2
        )
      );
    }

    return NextResponse.json(
      { message: 'Saved successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to write files' },
      { status: 500 }
    );
  }
}
