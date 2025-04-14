import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  _: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const filePath = path.join(
    process.cwd(),
    'shared-files',
    'quizzes',
    `quiz_${params.quizId}.json`
  );

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return new NextResponse('Quiz not found', { status: 404 });
  }
}