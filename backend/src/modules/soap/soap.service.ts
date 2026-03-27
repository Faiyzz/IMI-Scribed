import OpenAI from "openai";
import { SoapNote } from "./soap.types";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
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

    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `Transcript:\n${transcript}`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
    });

    const content = response.choices[0].message.content || "{}";

    try {
        return JSON.parse(content);
    } catch (err) {
        throw new Error("Failed to parse SOAP response");
    }
};