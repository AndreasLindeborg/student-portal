import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string; studentId: string } }
) {
  // await params before destructuring
  const { quizId, studentId } = await params;

  const filePath = path.join(
    process.cwd(),
    'shared-files',
    'results',
    `result_${quizId}_${studentId}.json`
  );

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json(
      { error: 'Result not found' },
      { status: 404 }
    );
  }
}
