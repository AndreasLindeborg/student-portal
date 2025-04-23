import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  _: NextRequest,
  { params }: { params: { quizId: string } }
) {
  // Must await params before using it
  const { quizId } = await params;

  const filePath = path.join(
    process.cwd(),
    'shared-files',
    'quizzes',
    `quiz_${quizId}.json`
  );

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return new NextResponse('Quiz not found', { status: 404 });
  }
}
