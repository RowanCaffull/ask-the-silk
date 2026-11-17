import { NextRequest, NextResponse } from "next/server";
import { getSilkById } from "@/lib/silks";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { silkId, question } = await req.json();

  if (!silkId || !question?.trim()) {
    return NextResponse.json(
      { error: "silkId and question are required" },
      { status: 400 }
    );
  }

  const silk = getSilkById(silkId);
  if (!silk) {
    return NextResponse.json({ error: "Unknown silk" }, { status: 400 });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: silk.systemPrompt,
      messages: [{ role: "user", content: question.trim() }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";

  return NextResponse.json({ response: text, name: silk.name });
}
