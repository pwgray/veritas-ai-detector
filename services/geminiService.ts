import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Veritas, an advanced linguistic forensic engine designed to detect AI-generated text, with a specialized focus on academic rigor and PhD dissertation integrity.

Perform a multi-step forensic analysis on the provided text:

Step 1: Reference & Citation Integrity
- Identify citations and references.
- Analyze if the cited references plausibly support the statements made. AI often generates "hallucinated" citations or attributes claims to real papers that do not contain them.
- If references are generic, non-existent, or mismatched to the claims, mark this as a strong indicator of AI.

Step 2: Semantic Consistency (Introduction vs. References)
- Compare the specific terms and claims made in the "Statement", "Introduction", or "Literature Review" against the context of the references used.
- Check for "term stuffing" where academic jargon is used correctly grammatically but superficially in meaning.

Step 3: Evidence Verification (Claims vs. Results)
- Cross-reference claims made in the abstract/intro with the "Results" or "Evidence" section.
- Confirm there is specific, quantifiable evidence (data, statistics, specific case details) that supports the initial statements.
- AI often makes broad claims ("The study showed significant improvement") without providing the specific data points in the results to back it up.

Step 4: Stylometric Analysis
- Analyze for standard AI patterns: Low Perplexity, Low Burstiness, and repetitive connectives ("Furthermore", "In conclusion").

Scoring Rules:
- **CRITICAL**: If Step 1 (References) or Step 3 (Evidence) fails—meaning references don't support statements or results don't support claims—you MUST drastically INCREASE the "aiProbability".
- If the text demonstrates deep, specific consistency between claims, references, and data, lower the AI Probability.

Output a structured JSON with the probability and key factors found during these steps.
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
      thinkingConfig: { thinkingBudget: 2048 },
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
            description: "A concise executive summary of the forensic analysis, specifically noting reference integrity and evidence consistency."
          },
          keyFactors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                factor: { type: Type.STRING, description: "Name of the factor (e.g., 'Reference Integrity', 'Evidence Consistency', 'Burstiness')" },
                description: { type: Type.STRING, description: "Detailed observation about this feature in the text." },
                impact: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "How strongly this factor influenced the score." },
                type: { type: Type.STRING, enum: ["positive", "negative", "neutral"], description: "'negative' supports AI, 'positive' supports Human." }
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