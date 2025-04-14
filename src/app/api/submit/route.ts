import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizId, studentId, answers, result } = body;

    if (!quizId || !studentId || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const basePath = path.join(process.cwd(), 'shared-files');

    // Write answers file
    const answerPath = path.join(basePath, 'answers', `answers_${quizId}_${studentId}.json`);
    fs.writeFileSync(answerPath, JSON.stringify({
      quizId,
      studentId,
      submittedAt: new Date(),
      answers,
    }, null, 2));

    // Write result file
    if (result) {
      const resultPath = path.join(basePath, 'results', `result_${quizId}_${studentId}.json`);
      fs.writeFileSync(resultPath, JSON.stringify({
        ...result,
        submittedAt: new Date(),
      }, null, 2));
    }

    return NextResponse.json({ message: 'Saved successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to write files' }, { status: 500 });
  }
}
