import { NextResponse } from "next/server";
import { processIncomingEmail } from "@/lib/email-processing";

export async function POST(request: Request) {
  const secret = request.headers.get("x-subspy-secret");
  if (secret !== process.env.EMAIL_INTAKE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { alias, from, subject, text } = body;

  if (!alias || !from || !subject) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = await processIncomingEmail({
    alias,
    from,
    subject,
    body: text ?? "",
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.error === "Unknown alias" ? 404 : 500 });
  }

  return NextResponse.json(result);
}
