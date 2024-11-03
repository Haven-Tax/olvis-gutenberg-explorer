import "server-only";
import Groq from "groq-sdk";
import { BookMetaData, LlmBookAnalysis } from './types';

if (!process.env.GROG_API_KEY) {
  throw new Error("GROG_API_KEY is not set");
}
const modelName = "llama3-70b-8192";
const groq = new Groq({ apiKey: process.env.GROG_API_KEY });

const safeJsonParse = <T>(jsonString: string)  : T | undefined => {
  if (jsonString.length === 0) {
    return undefined;
  }
  if (!jsonString.endsWith("}")) {
    return JSON.parse(jsonString + "}") as T;
  }
  return JSON.parse(jsonString) as T;
}

export const getBookAnalysis = async (metaData: BookMetaData): Promise<LlmBookAnalysis | undefined> => {
  const llmResponse = await groq.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant that likes to read books and documents, and can answer questions about them. Answer questions or else!',
      },
      {
        role: 'user',
        content: `Given the following book or document: ${metaData.title} by ${metaData.authors.map((a) => a.name).join(', ')}, 
        Give the response in a valid JSON string, don't include any other text. 
        Answer the following question: 
        1. Write a short summary. JSON key: summary
        2. Write a list of main characters or important people. JSON key: characters, array of strings
        3. What sentiment the authors convey. JSON key: sentiments, array of strings
        4. What is the plot? JSON key: plot`,
      },
    ],
  });
  const jsonString = llmResponse.choices[0].message.content ?? "";
  return safeJsonParse<LlmBookAnalysis>(jsonString);
}

export const askBookQuestion = async (metaData: BookMetaData, question: string): Promise<string | undefined> => {
  const llmResponse = await groq.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant that likes to read books and documents, and can answer questions about them.',
      },
      {
        role: 'user',
        content: `Given the following book or document: ${metaData.title} by ${metaData.authors.map((a) => a.name).join(', ')}, 
        please answer this question: ${question}`,
      },
    ],
  });
  
  return llmResponse.choices[0].message.content ?? undefined;
}


