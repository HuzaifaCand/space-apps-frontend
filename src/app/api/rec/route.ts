import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { activities, data, details } = body;

    if (!activities || !data || !details) {
      return NextResponse.json(
        { message: "Missing required fields: activities, data, or details." },
        { status: 400 }
      );
    }

    const userContent = { activities, data, details };

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You will be given a list of activities that a user wants to do, along with additional info and the probability of certain weather conditions on that day including temperature, wind, humidity, precipitation, and the heat index. Your goal is to provide a short recommendation telling the user whether their planned activities are suitable, referencing the provided data where necessary.",
        },
        {
          role: "user",
          content: JSON.stringify(userContent),
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const message =
      response.choices?.[0]?.message?.content?.trim() ||
      "No recommendation generated.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      { message: "Error generating recommendation." },
      { status: 500 }
    );
  }
}
