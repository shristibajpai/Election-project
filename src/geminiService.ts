import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getGeminiResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are VoteWise Assistant, an intelligent companion for the election process.
        Your goal is to simplify complex election procedures, deadlines, and registration steps.
        Be helpful, non-partisan, and clear. 
        If a user is a first-time voter, provide extra encouragement and simple explanations.
        Use markdown for formatting. 
        Keep responses concise but informative.`,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
