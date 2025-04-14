import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const quizzesDir = path.join(process.cwd(), 'shared-files/quizzes');
  const filenames = fs.readdirSync(quizzesDir);

  const quizzes = filenames
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(quizzesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    });

  return NextResponse.json(quizzes);
}