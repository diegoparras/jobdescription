
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `You are a highly-skilled professional recruiter with expertise in tech talent acquisition.
Your task is to analyze the provided Job Description (PDF) and the candidate's Curriculum Vitae (CV) (PDF).

Based on a thorough comparison, provide a detailed analysis in MARKDOWN format. The analysis must include the following sections:

### Overall Summary
A brief, one-paragraph summary of the candidate's suitability for the role.

### Compatibility Score
Provide a percentage score representing the match between the CV and the job description. The score should be bold. For example: **Compatibility Score: 88%**.

### Key Strengths
A bulleted list of the candidate's skills and experiences from their CV that are a strong match for the key requirements in the job description.

### Potential Gaps
A bulleted list of areas where the candidate's CV does not explicitly meet the job description's requirements or where more information might be needed.

### Final Recommendation
Provide a clear, one-sentence recommendation in bold. Choose from: "**Strongly Recommend for Interview**", "**Recommend for Interview**", "**Consider for Interview with Reservations**", or "**Not a Suitable Match at this Time**".
`;

export const compareDocuments = async (jdBase64: string, cvBase64: string): Promise<string> => {
  const jdPart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: jdBase64,
    },
  };

  const cvPart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: cvBase64,
    },
  };

  const textPart = { text: PROMPT };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, jdPart, cvPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
