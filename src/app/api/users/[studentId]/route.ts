import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper to normalize the Auth0 sub
function normalizeId(raw: string) {
  // drop any "namespace|", keep only last segment
  const idPart = raw.split("|").pop()!;
  // replace any weird chars
  return idPart.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export async function POST(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  // await params before using it
  const { studentId } = await params;
  const safeId = normalizeId(studentId);
  const dir = path.join(process.cwd(), "shared-files", "users");
  const fn = path.join(dir, `student_${safeId}.json`);

  fs.mkdirSync(dir, { recursive: true });

  const { email, name } = await req.json();

  const profile = {
    studentId: safeId,
    email: email || "",
    name: name || "",
    enrolledQuizzes: [],
  };

  fs.writeFileSync(fn, JSON.stringify(profile, null, 2));
  return NextResponse.json(profile, { status: 201 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  // await params before using it
  const { studentId } = await params;
  const safeId = normalizeId(studentId);
  const fn = path.join(
    process.cwd(),
    "shared-files",
    "users",
    `student_${safeId}.json`
  );

  try {
    const data = fs.readFileSync(fn, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
