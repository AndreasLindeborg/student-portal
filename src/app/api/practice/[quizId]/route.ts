import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  // ✔ await params
  const { quizId } = await params

  const studentId = req.nextUrl.searchParams.get('studentId')
  if (!studentId) {
    return new NextResponse('Missing studentId', { status: 400 })
  }

  const quizFile = path.join(
    process.cwd(),
    'shared-files',
    'quizzes',
    `quiz_${quizId}.json`
  )

  try {
    const raw = fs.readFileSync(quizFile, 'utf-8')
    const quiz = JSON.parse(raw)

    const questions = shuffle(quiz.questions).map((q: any) => {
      const opts = shuffle(q.options)
      const answerIndex = opts.findIndex(
        (opt) => opt === q.options[q.answerIndex]
      )
      return { ...q, options: opts, answerIndex }
    })

    return NextResponse.json({
      quizId,
      studentId,
      title: `Practice - ${quiz.title}`,
      questions,
    })
  } catch (err) {
    console.error(err)
    return new NextResponse('Practice quiz not found', { status: 404 })
  }
}
