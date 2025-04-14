import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: NextRequest,
  context: { params: { quizId: string } }
) {
  const { quizId } = context.params;
  const studentId = req.nextUrl.searchParams.get('studentId') || 'anonymous';

  const filePath = path.join(
    process.cwd(),
    'shared-files',
    'results',
    `result_${quizId}_${studentId}.json`
  );

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (err) {
    return new NextResponse('Result not found', { status: 404 });
  }
}
