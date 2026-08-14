import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      topic,
      details,
      keywords,
      tone,
      length,
    } = body;

    // VALIDATION

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog topic is required.",
        },
        { status: 400 }
      );
    }

    // LENGTH INSTRUCTIONS

    let lengthInstruction = "";

    if (length === "Short") {
      lengthInstruction =
        "Keep the blog concise, approximately 500-700 words.";
    } else if (length === "Long") {
      lengthInstruction =
        "Create a detailed long-form blog, approximately 1200-1600 words.";
    } else {
      lengthInstruction =
        "Create a medium-length blog, approximately 800-1100 words.";
    }

    // PROMPT

    const prompt = `
You are an expert blog writer, content strategist, and SEO-friendly copywriter.

Create a high-quality blog based ONLY on the information provided by the user.

BLOG TOPIC:
${topic}

EXTRA DETAILS:
${details || "No additional details provided."}

KEYWORDS:
${keywords || "No specific keywords provided."}

WRITING TONE:
${tone || "Professional"}

BLOG LENGTH:
${length || "Medium"}

LENGTH INSTRUCTION:
${lengthInstruction}

IMPORTANT RULES:

- Do not invent facts, statistics, achievements, experiences, or information that the user did not provide.
- Do not make unrealistic claims.
- Keep the writing natural and human.
- Follow the requested writing tone.
- Use the provided keywords naturally when relevant.
- Do not keyword-stuff.
- Make the blog easy to read.
- Use short paragraphs.
- Make the content useful and engaging.
- Do not add unnecessary explanations outside the blog.
- Do not use markdown headings such as "#", "##", or "###".
- The blog should have a clear structure.
- Return ONLY valid JSON.
- Do not wrap the JSON inside markdown code fences.

Return EXACTLY this JSON structure:

{
  "title": "A strong and relevant blog title",
  "introduction": "A clear and engaging introduction",
  "content": "The main blog content with readable paragraphs",
  "conclusion": "A useful conclusion that summarizes the article"
}

IMPORTANT:

- "title" must contain only the blog title.
- "introduction" must contain only the introduction.
- "content" must contain the main article body.
- "conclusion" must contain only the conclusion.
- Do not put these labels inside the values.
- Make sure the response is valid JSON.
`;

    // GEMINI

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    console.log("BLOG AI RESPONSE:", text);

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    // CLEAN POSSIBLE MARKDOWN CODE FENCES

    let cleanedText = text;

    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "")
        .trim();
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();
    }

    // PARSE JSON

    let parsedResult;

    try {
      parsedResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError);

      throw new Error(
        "AI returned an invalid blog format. Please try again."
      );
    }

    // VALIDATE RESULT

    const result = {
      title:
        typeof parsedResult.title === "string"
          ? parsedResult.title.trim()
          : "",

      introduction:
        typeof parsedResult.introduction === "string"
          ? parsedResult.introduction.trim()
          : "",

      content:
        typeof parsedResult.content === "string"
          ? parsedResult.content.trim()
          : "",

      conclusion:
        typeof parsedResult.conclusion === "string"
          ? parsedResult.conclusion.trim()
          : "",
    };

    if (
      !result.title &&
      !result.introduction &&
      !result.content &&
      !result.conclusion
    ) {
      throw new Error("AI returned an empty blog.");
    }

    // SEND TO FRONTEND

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("BLOG GENERATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate blog.",
      },
      { status: 500 }
    );
  }
}