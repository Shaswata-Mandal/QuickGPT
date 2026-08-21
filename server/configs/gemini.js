import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateGeminiText = async (prompt, contextMessages = [], systemInstruction = null) => {

  try {

    const contents = [];

    if (systemInstruction) {
      contents.push({
        role: "user",
        parts: [{ text: systemInstruction }],
      });
    }

    contextMessages.forEach(msg => {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    });

    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return response.text;

  } catch (err) {

    console.error("GEMINI ERROR:", JSON.stringify(err?.error || err?.message || err, null, 2));

    const status = err?.status || err?.error?.code;

    if (status === 429) {

      let retryAfter;

      if (err?.error?.status === "RESOURCE_EXHAUSTED") {

        retryAfter = 86400

      }
      else {

        const retryDelay = err?.error?.details?.find(d => d["@type"]?.includes("RetryInfo"))?.retryDelay || "60s";

        retryAfter = parseInt(retryDelay.replace("s", ""), 10) || 60;

      }

      const e = new Error("RATE_LIMIT");
      e.retryAfter = retryAfter;
      e.provider = "gemini";
      e.isRateLimit = true;
      throw e;

    }

    const e = new Error("GEMINI_ERROR");
    e.provider = "gemini";
    throw e;

  }

};
