import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../core/config/env";
import { SoapNote } from "./soap.types";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

export const generateSoapNote = async (
    transcript: string
): Promise<SoapNote> => {

    const systemPrompt = `
You are a clinical documentation assistant.

Convert the given medical transcript into a structured SOAP note.

STRICT RULES:
- Output MUST be valid JSON
- NO extra text
- Follow schema exactly

Schema:
{
  "subjective": string,
  "objective": string,
  "assessment": string,
  "plan": string,
  "vitals": {
    "bloodPressure"?: string,
    "heartRate"?: string,
    "temperature"?: string,
    "respiratoryRate"?: string
  },
  "rangeOfMotion"?: string,
  "diagnosis": string[],
  "medications": [
    {
      "name": string,
      "dosage"?: string,
      "frequency"?: string
    }
  ]
}
`;

    const result = await model.generateContent(`
        ${systemPrompt}
        
        Transcript:
        ${transcript}
    `);

    const response = await result.response;
    const content = response.text() || "{}";

    try {
        return JSON.parse(content);
    } catch (err) {
        throw new Error("Failed to parse SOAP response");
    }
};