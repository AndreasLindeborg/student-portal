import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const filePath = path.join(
    process.cwd(),
    'shared-files',
    'users',
    `student_${params.studentId}.json`
  );

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return new NextResponse('Student not found', { status: 404 });
  }
}
