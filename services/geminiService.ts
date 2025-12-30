import { GoogleGenAI } from "@google/genai";
import { MapTeam } from '../types';

// Get API key from environment variable (set by Vite config)
// Vite converts undefined to empty string, so we check for both
const apiKey = (process.env.API_KEY || process.env.GEMINI_API_KEY || '').trim();

// Check if API key is actually set (not empty and not the string "undefined")
const hasValidApiKey = apiKey && apiKey !== '' && apiKey !== 'undefined';

if (!hasValidApiKey) {
  console.warn('GEMINI_API_KEY is not set. AI search functionality will be disabled.');
  console.warn('Please create a .env.local file in the project root with: GEMINI_API_KEY=your_api_key_here');
}

const ai = hasValidApiKey ? new GoogleGenAI({ apiKey }) : null;

const mapData = (data: any[]): MapTeam[] => {
  return data.map((item: any, index: number) => ({
    ...item,
    id: `gen-${Date.now()}-${index}`,
    // Ensure coordinates exist, fallback to 0,0 if missing to prevent map crash
    coordinates: item.coordinates || { lat: 0, lng: 0 }
  }));
};

export const findTeams = async (query: string): Promise<MapTeam[]> => {
  if (!ai) {
    console.warn('AI service is not available. Please set GEMINI_API_KEY in .env.local');
    return [];
  }
  
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

export const suggestInnovation = async (topic: string): Promise<string> => {
  if (!ai) {
    console.warn('AI service is not available. Please set GEMINI_API_KEY in .env.local');
    return 'AI service is not available. Please configure GEMINI_API_KEY.';
  }
  
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `You are an innovation advisor for FIRST Tech Challenge (FTC) robotics teams.
    
Given the topic: "${topic}"

Provide a creative and practical innovation suggestion for an FTC team. The suggestion should be:
- Relevant to FTC robotics
- Actionable and implementable
- Creative and innovative
- Brief (2-3 sentences)

Return ONLY the suggestion text, without any markdown formatting, quotes, or additional commentary.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'text/plain',
      }
    });

    if (response.text) {
      return response.text.trim();
    }
    
    return 'Unable to generate suggestion at this time.';
  } catch (error) {
    console.error("Error suggesting innovation:", error);
    return 'Error generating suggestion. Please try again.';
  }
};

export const chatWithAssistant = async (
  message: string,
  history: any[] = [],
  lang: 'ru' | 'en' = 'ru'
): Promise<string> => {
  if (!ai) {
    console.warn('AI service is not available. Please set GEMINI_API_KEY in .env.local');
    return lang === 'ru' 
      ? 'AI сервис недоступен. Пожалуйста, настройте GEMINI_API_KEY в .env.local'
      : 'AI service is not available. Please configure GEMINI_API_KEY.';
  }
  
  try {
    const model = 'gemini-2.5-flash';
    
    const systemPrompt = lang === 'ru'
      ? `Ты - AI ассистент для команды FIRST Tech Challenge (FTC). Помогай с вопросами по робототехнике, программированию, механике, стратегии и всему, что связано с FTC. Отвечай кратко, но информативно.`
      : `You are an AI assistant for a FIRST Tech Challenge (FTC) team. Help with questions about robotics, programming, mechanics, strategy, and everything related to FTC. Answer concisely but informatively.`;
    
    // Build conversation context from history
    let conversationContext = '';
    if (history && history.length > 0) {
      conversationContext = history.map((h: any) => {
        const role = h.role === 'user' ? 'User' : 'Assistant';
        const text = h.text || (h.parts && h.parts[0]?.text) || '';
        return `${role}: ${text}`;
      }).join('\n');
    }
    
    const prompt = conversationContext
      ? `${systemPrompt}\n\n${lang === 'ru' ? 'История разговора:' : 'Conversation history:'}\n${conversationContext}\n\n${lang === 'ru' ? 'Текущий вопрос пользователя:' : 'Current user question:'} ${message}`
      : `${systemPrompt}\n\n${lang === 'ru' ? 'Вопрос пользователя:' : 'User question:'} ${message}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'text/plain',
      }
    });

    if (response.text) {
      return response.text.trim();
    }
    
    return lang === 'ru' 
      ? 'Не удалось получить ответ. Попробуйте еще раз.'
      : 'Unable to get response. Please try again.';
  } catch (error) {
    console.error("Error chatting with assistant:", error);
    return lang === 'ru'
      ? 'Произошла ошибка при общении с ассистентом. Попробуйте еще раз.'
      : 'An error occurred while chatting with the assistant. Please try again.';
  }
};