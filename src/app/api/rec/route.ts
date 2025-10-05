import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const testPayload = {
  activities: ["Hiking", "Cycling"],
  data: { temperature: 30, humidity: 80 },
  details: { duration: "2 hours" },
};

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    // console.log(body);
    // const { activities, data, details } = body;

    // Properly stringify inputs
    const userContent = testPayload;

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
    });

    return NextResponse.json({
      message:
        response.choices?.[0]?.message?.content ||
        "No recommendation generated.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error generating recommendation" },
      { status: 500 }
    );
  }
}
