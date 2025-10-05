// app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { activities, data } = await req.json();

  // Example with AI
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You will be given a list of activities that a user wants to do at and maybe some additional info as well as the probability of certain weather conditions on that day which includes temperature, wind, humidity, precipitation, and the heat index as well as means and ranges where applicable. Your goal is to be relevant to these and create a short response recommending to the user whether the day they have chosen is appropriate for the activities that they want to do by making sure you reference the data where necessary for your conclusion",
      },
      {
        role: "user",
        content: `will setup later`,
      },
    ],
  });

  return NextResponse.json({
    message: response.choices[0].message.content,
  });
}
