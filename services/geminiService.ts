import { GoogleGenAI } from "@google/genai";
import { Team } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mapData = (data: any[]): Team[] => {
  return data.map((item: any, index: number) => ({
    ...item,
    id: `gen-${Date.now()}-${index}`,
    // Ensure coordinates exist, fallback to 0,0 if missing to prevent map crash
    coordinates: item.coordinates || { lat: 0, lng: 0 }
  }));
};

export const findTeams = async (query: string): Promise<Team[]> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `Find First Tech Challenge (FTC) robotics teams matching the query: "${query}". 
    If the query is a location, find teams in that area.
    Return a list of at least 3-5 teams if possible. 
    
    CRITICAL INSTRUCTION:
    Return ONLY a valid JSON array of objects. 
    Do NOT include markdown formatting (like \`\`\`json).
    Do NOT include citations (like [1], [2]).
    Do NOT include any conversational text.
    
    JSON Schema:
    [
      {
        "number": "string",
        "name": "string",
        "location": "string",
        "description": "string",
        "website": "string (or null)",
        "coordinates": { "lat": number, "lng": number },
        "awards": ["string"],
        "logo": "string (or null)"
      }
    ]`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: undefined, 
        responseSchema: undefined,
      }
    });

    if (response.text) {
      let jsonString = response.text.trim();
      
      // 1. Remove Markdown code blocks if present
      jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();

      // 2. Remove citations often returned by Search (e.g., [1], [12], 【source】)
      jsonString = jsonString.replace(/\[\d+\]/g, ''); 
      jsonString = jsonString.replace(/【.*?】/g, '');

      // 3. Try parsing directly
      try {
        const data = JSON.parse(jsonString);
        if (Array.isArray(data)) return mapData(data);
      } catch (e) {
        // 4. Fallback: robust extraction
        // We look for the pattern [ { ... } ] ignoring whitespace
        const complexMatch = jsonString.match(/\[\s*\{[\s\S]*\}\s*\]/);
        
        if (complexMatch) {
            try {
                const data = JSON.parse(complexMatch[0]);
                if (Array.isArray(data)) return mapData(data);
            } catch (e2) {
                console.warn("Regex extraction failed to produce valid JSON:", e2);
            }
        } else {
             // Last resort: simple bracket extraction
             const firstOpen = jsonString.indexOf('[');
             const lastClose = jsonString.lastIndexOf(']');
             if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
                 try {
                     const subStr = jsonString.substring(firstOpen, lastClose + 1);
                     const data = JSON.parse(subStr);
                     if (Array.isArray(data)) return mapData(data);
                 } catch (e3) {
                     console.warn("Simple substring extraction failed:", e3);
                 }
             }
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error finding teams:", error);
    return [];
  }
};