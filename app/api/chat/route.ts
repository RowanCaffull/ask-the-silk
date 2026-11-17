import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getSilkById } from "@/lib/silks";

const client = new Anthropic();

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

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: silk.systemPrompt,
    messages: [
      {
        role: "user",
        content: question.trim(),
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ response: text, name: silk.name });
}
