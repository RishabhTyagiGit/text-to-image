import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is requited" },
        { status: 400 }
      );
    }
    const response = await client.images.generate({
      model: "black-forest-labs/flux-schnell",
      response_format: "b64_json",
      extra_body: {
        response_extension: "webp",
        width: 512,
        height: 512,
        num_inference_steps: 4,
        negative_prompt: "",
        seed: -1,
      },
      prompt: prompt,
    });
    return NextResponse.json({ imageUrl: response.data[0].b64_json });
  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
