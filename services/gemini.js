import { GoogleGenAI } from "@google/genai";



const systemPrompt = `You are a corporate event planning expert with 15 years of experience.
When given an event description, return ONE venue recommendation as a raw JSON object.

Strict rules:
- Return ONLY a valid JSON object, no markdown fences, no explanation, no extra text
- venueName must be a real or realistic sounding venue
- location must be a real city and region
- estimatedCost must be a realistic price range like "$3,200 - $4,000"
- whyItFits must be 2-3 sentences explaining why this venue suits the request
- amenities must be an array of 4-6 relevant facility strings
- capacity should be a short string like "Up to 15 guests"

JSON shape to follow exactly:
{
  "venueName": "string",
  "location": "string",
  "estimatedCost": "string",
  "whyItFits": "string",
  "amenities": ["string"],
  "capacity": "string"
}`;

export async function getVenueProposal(userQuery) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userQuery,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  const raw = response.text.trim();

  // strip accidental markdown code fences if gemini wraps them
  const cleaned = raw.replace(/```json|```/gi, "").trim();

  const parsed = JSON.parse(cleaned);
  return parsed;
}