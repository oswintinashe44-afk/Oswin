import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async analyzeProductImage(imageUri: string) {
    try {
      const base64Data = imageUri.split(',')[1] || imageUri;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: "Analyze this product for a high-performance marketplace. Be precise and professional."
          },
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              priceRange: { type: Type.STRING, description: "Estimated market price range (e.g., $50 - $70)" },
              category: { type: Type.STRING },
              description: { type: Type.STRING, description: "Short, punchy listing description" },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            },
            required: ["title", "priceRange", "category", "description"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error('Gemini Analysis Error:', error);
      throw error;
    }
  },

  async getHustleInsights() {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Provide 3 short, punchy 'Hustle Insights' for a marketplace user in 2026. Focus on tech trends, electronics, and local delivery spikes.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error('Gemini Insights Error:', error);
      return [
        "Electronics demand is spiking in your area.",
        "Vintage tech listings getting 40% more engagement.",
        "Courier delivery fees are up by 15% this weekend."
      ];
    }
  },

  async askAssistant(query: string, context?: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction: `You are the HustleHub AI, a smart business assistant for a multi-module super app. 
          You help users with marketplace trends, delivery logistics, and business optimization.
          Keep responses concise, professional, and slightly futuristic/energetic.
          Current user context: ${context || 'General user'}`
        }
      });
      return response.text;
    } catch (error) {
      console.error('Gemini Assistant Error:', error);
      return "I'm currently recalibrating my neural networks. Please try again in a moment.";
    }
  }
};
