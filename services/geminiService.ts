
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly when initializing.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Access response.text as a property, not a method, and ensure basic text tasks use gemini-3-flash-preview.
export async function getAIExtendedExplanation(question: string, context: string, answer: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional English Tutor. 
      A student is confused by this question: "${question}". 
      Context/Existing explanation: "${context}". 
      The correct answer is: "${answer}". 
      Explain why this is correct in a friendly, detailed way, and give 2 more examples.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I couldn't generate a detailed explanation right now. Please check the basic explanation below.";
  }
}

// Fix: Use responseSchema and responseMimeType to ensure structured, valid JSON output from the model.
export async function generateNewQuestions(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 new English grammar multiple choice questions on the topic of "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              q: { type: Type.STRING, description: 'The question text with a "________" blank.' },
              o: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Array of 4 options.' },
              a: { type: Type.INTEGER, description: 'Index of the correct answer (0-3).' },
              e: { type: Type.STRING, description: 'Detailed explanation for the answer.' },
              category: { type: Type.STRING, description: 'Topic category.' },
            },
            required: ['q', 'o', 'a', 'e', 'category'],
          },
        },
      },
    });
    // Fix: Safely parse JSON from the response text.
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
}
