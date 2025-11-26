import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Veritas, an advanced linguistic forensic engine designed to detect AI-generated text. 
Analyze the provided text for stylistic signatures common in Large Language Models (LLMs), such as:
1. Low Perplexity: Uniform complexity and predictability.
2. Low Burstiness: Lack of sentence length/structure variation.
3. Excessive Neutrality: Avoidance of strong opinions or emotional nuance.
4. Repetitive Connectors: Overuse of "Furthermore", "In conclusion", "Additionally".
5. Hallucination Patterns: Generic claims without specific backing detail where expected.

Provide a strict probability score and a detailed breakdown of findings.
`;

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!text || text.trim().length < 50) {
    throw new Error("Text is too short for reliable analysis. Please provide at least 50 characters.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: text,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          aiProbability: { 
            type: Type.INTEGER, 
            description: "Percentage probability (0-100) that the text is AI-generated." 
          },
          verdict: { 
            type: Type.STRING, 
            enum: ["Likely AI-Generated", "Mixed Signals", "Likely Human-Written"] 
          },
          summary: { 
            type: Type.STRING,
            description: "A concise executive summary of the linguistic analysis."
          },
          keyFactors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                factor: { type: Type.STRING, description: "Name of the linguistic feature (e.g., 'Sentence Variation')" },
                description: { type: Type.STRING, description: "Detailed observation about this feature in the text." },
                impact: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "How strongly this factor influenced the score." },
                type: { type: Type.STRING, enum: ["positive", "negative", "neutral"], description: "'negative' suggests AI, 'positive' suggests Human." }
              },
              required: ["factor", "description", "impact", "type"]
            }
          }
        },
        required: ["aiProbability", "verdict", "summary", "keyFactors"]
      }
    }
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("No response received from the analysis engine.");
  }

  try {
    return JSON.parse(responseText) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON response", e);
    throw new Error("Failed to parse analysis results.");
  }
};