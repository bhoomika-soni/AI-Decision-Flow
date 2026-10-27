import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

export async function evaluateDecision(prompt) {
  if (!ai) {
    throw new Error(
      "GEMINI_API_KEY is missing. Please check your .env file."
    );
  }

  if (!prompt || typeof prompt !== "string") {
    throw new Error("A valid decision prompt is required.");
  }

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: [
      `Evaluate the following condition and answer with exactly YES or NO.

Rules:
- Answer YES if the condition is satisfied.
- Answer NO if the condition is not satisfied.
- Do not provide explanations.
- Return only YES or NO.

Condition: ${prompt}`
    ],
  });

  const answer = response.text?.trim().toUpperCase();

  if (answer !== "YES" && answer !== "NO") {
    throw new Error(
      `Gemini returned an unexpected response: ${response.text}`
    );
  }

  return answer;
}