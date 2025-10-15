import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we'll log an error.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateStudyPlan = async (taskTitle: string, subject: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please set the API_KEY environment variable.";
  }

  const prompt = `You are a helpful study assistant for a student.
A student has the following task: "${taskTitle}" for their "${subject}" class.
Break this down into a simple, actionable checklist of sub-tasks for them to follow.
Provide the response as a bulleted list. For example:
- Sub-task 1
- Sub-task 2
- Sub-task 3`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating study plan:", error);
    return "Sorry, I couldn't generate a study plan right now. Please try again later.";
  }
};
